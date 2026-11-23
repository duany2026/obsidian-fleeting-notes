import { ItemView, MarkdownView, Notice, TFile, WorkspaceLeaf, setIcon } from "obsidian";
import { buildDayHeaderRegex, NoteManager } from "./note-manager";
import { FleetingNotesSettings, RecentEntry } from "./types";

export const VIEW_TYPE_HOMEPAGE = "fleeting-notes-homepage";
export class HomepageView extends ItemView {
	private noteManager: NoteManager;
	private settings: FleetingNotesSettings;
	private resizeObserver: ResizeObserver | null;
	private rendering: boolean;
	private submitLocked: boolean;
	private pendingRefresh: boolean;
	private headerDate: HTMLElement | null;
	private todayBadge: HTMLElement | null;
	private weekBadge: HTMLElement | null;
	private monthBadge: HTMLElement | null;
	private listCount: HTMLElement | null;
	private listEl: HTMLElement | null;
	private _openFileTimer: ReturnType<typeof setTimeout> | null;
	private _inputErrorTimer: ReturnType<typeof setTimeout> | null;
	private _autoResize: (() => void) | null;

  constructor(leaf: WorkspaceLeaf, noteManager: NoteManager, settings: FleetingNotesSettings) {
    super(leaf);
    this.resizeObserver = null;
    this.rendering = false;
    this.submitLocked = false;
    this.headerDate = null;
    this.todayBadge = null;
    this.weekBadge = null;
    this.monthBadge = null;
    this.listCount = null;
    this.listEl = null;
    this.noteManager = noteManager;
    this.settings = settings;
  }
  getViewType() {
    return VIEW_TYPE_HOMEPAGE;
  }
  getDisplayText() {
    return "\u95EA\u5FF5\u7B14\u8BB0";
  }
  getIcon() {
    return "zap";
  }
  async onOpen() {
    await this.buildSkeleton();
    this.setupResizeObserver();
    // 打开即渲染初始内容：工作区恢复时事件可能先于视图就绪触发，不能只依赖事件驱动首屏
    await this.refreshContent();
  }
  async onClose() {
    if (this._openFileTimer) {
      clearTimeout(this._openFileTimer);
      this._openFileTimer = null;
    }
    if (this._inputErrorTimer) {
      clearTimeout(this._inputErrorTimer);
      this._inputErrorTimer = null;
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }
  async refresh() {
    await this.refreshContent();
  }
  setupResizeObserver() {
    // 同一视图实例重复 onOpen 时先断开旧观察器，避免滞留的冗余回调
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    const root = this.containerEl.children[1];
    this.resizeObserver = new ResizeObserver(() => {
      this.updateNarrowClass(root);
    });
    this.resizeObserver.observe(root);
    this.updateNarrowClass(root);
  }
  updateNarrowClass(root) {
    const width = root.clientWidth;
    if (width > 0 && width < 400) {
      root.addClass("fn-narrow");
    } else {
      root.removeClass("fn-narrow");
    }
  }
  buildSkeleton() {
    const root = this.containerEl.children[1];
    root.empty();
    root.addClass("fn-homepage");
    this.updateNarrowClass(root);
    const stickyTop = root.createDiv({ cls: "fn-sticky-top" });
    const header = stickyTop.createDiv({ cls: "fn-header" });
    const headerLeft = header.createDiv({ cls: "fn-header-left" });
    const headerSub = headerLeft.createDiv({ cls: "fn-header-sub" });
    this.headerDate = headerSub.createSpan({ cls: "fn-header-date" });
    headerSub.createSpan({ cls: "fn-header-dot", text: "\xB7" });
    this.todayBadge = headerSub.createSpan({ cls: "fn-header-badge fn-badge-high" });
    headerSub.createSpan({ cls: "fn-header-dot", text: "\xB7" });
    this.weekBadge = headerSub.createSpan({ cls: "fn-header-badge" });
    headerSub.createSpan({ cls: "fn-header-dot", text: "\xB7" });
    this.monthBadge = headerSub.createSpan({ cls: "fn-header-badge" });
    const inputArea = stickyTop.createDiv({ cls: "fn-input-area" });
    const textArea = inputArea.createEl("textarea", {
      cls: "fn-input",
      attr: { placeholder: "\u8BB0\u4E0B\u6B64\u523B\u7684\u60F3\u6CD5\u2026", rows: "3" }
    });
    const submitBtn = inputArea.createEl("button", { cls: "fn-submit-btn" });
    submitBtn.createSpan({ text: "\u8BB0\u5F55" });
    const autoResize = () => {
      textArea.setCssProps({ height: "auto" });
      textArea.setCssProps({ height: Math.min(textArea.scrollHeight, 150) + "px" });
    };
    this._autoResize = autoResize;
    submitBtn.addEventListener("click", () => this.handleSubmit(textArea));
    textArea.addEventListener("input", autoResize);
    textArea.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        this.handleSubmit(textArea);
      }
    });
    const listSection = root.createDiv({ cls: "fn-list-section" });
    const listHeader = listSection.createDiv({ cls: "fn-list-header" });
    listHeader.createSpan({ cls: "fn-list-label", text: "\u6700\u8FD1\u8BB0\u5F55" });
    this.listCount = listHeader.createSpan({ cls: "fn-list-count fn-hidden" });
    this.listEl = listSection.createDiv({ cls: "fn-list" });
    return root;
  }
  async refreshContent() {
    if (this.rendering) {
      this.pendingRefresh = true;
      return;
    }
    this.rendering = true;
    try {
      const entries = await this.noteManager.getRecentEntries();
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      if (this.headerDate) {
        const weekdays = ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"];
        this.headerDate.setText(`${now.getMonth() + 1}\u6708${now.getDate()}\u65E5 \u5468${weekdays[now.getDay()]}`);
      }
      const todayCount = entries.filter((e) => e.date === todayStr).length;
      if (this.todayBadge)
        this.todayBadge.setText(`\u4ECA\u65E5 ${todayCount}`);
      const weekStart = new Date(now);
      const daysFromMonday = now.getDay() === 0 ? 6 : now.getDay() - 1;
      weekStart.setDate(now.getDate() - daysFromMonday);
      const weekStartStr = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;
      const weekCount = entries.filter((e) => e.date >= weekStartStr).length;
      if (this.weekBadge)
        this.weekBadge.setText(`\u672C\u5468 ${weekCount}`);
      const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const monthCount = entries.filter((e) => e.date.startsWith(monthStr)).length;
      if (this.monthBadge)
        this.monthBadge.setText(`\u672C\u6708 ${monthCount}`);
      const filtered = entries.filter((e) => {
        switch (this.settings.displayRange) {
          case "today":
            return e.date === todayStr;
          case "week":
            return e.date >= weekStartStr;
          default:
            return e.date.startsWith(monthStr);
        }
      });
      if (this.listCount) {
        this.listCount.setText(`${filtered.length}`);
        this.listCount.toggleClass("fn-hidden", filtered.length === 0);
      }
      if (!this.listEl) {
        this.rendering = false;
        return;
      }
      this.listEl.empty();
      if (filtered.length === 0) {
        const empty = this.listEl.createDiv({ cls: "fn-empty" });
        const emptyIcon = empty.createDiv({ cls: "fn-empty-icon" });
        setIcon(emptyIcon, "sparkles");
        if (entries.length === 0) {
          empty.createDiv({ cls: "fn-empty-text", text: "\u8FD8\u6CA1\u6709\u8BB0\u5F55" });
          empty.createDiv({ cls: "fn-empty-sub", text: "\u5199\u4E0B\u4F60\u7684\u7B2C\u4E00\u4E2A\u60F3\u6CD5\u5427" });
        } else {
          empty.createDiv({ cls: "fn-empty-text", text: "\u5F53\u524D\u8303\u56F4\u65E0\u8BB0\u5F55" });
          empty.createDiv({ cls: "fn-empty-sub", text: "\u53EF\u5728\u8BBE\u7F6E\u4E2D\u8C03\u6574\u663E\u793A\u8303\u56F4" });
        }
      } else {
        let lastDate = "";
        for (const entry of filtered) {
          if (entry.date !== lastDate) {
            const sep = this.listEl.createDiv({ cls: "fn-date-sep" });
            sep.createDiv({ cls: "fn-sep-line" });
            const sepDot = sep.createDiv({ cls: "fn-sep-dot" });
            const sepLabel = sep.createDiv({ cls: "fn-sep-label" });
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;
            if (entry.date === todayStr) {
              sepLabel.createSpan({ cls: "fn-sep-today", text: "\u4ECA\u5929" });
              sepLabel.createSpan({ cls: "fn-sep-date", text: entry.date });
              sepDot.addClass("fn-sep-dot-today");
            } else if (entry.date === yesterdayStr) {
              sepLabel.createSpan({ cls: "fn-sep-today", text: "\u6628\u5929" });
              sepLabel.createSpan({ cls: "fn-sep-date", text: entry.date });
            } else {
              sepLabel.createSpan({ text: entry.date });
            }
            lastDate = entry.date;
          }
          const item = this.listEl.createDiv({ cls: "fn-item" });
          const contentCol = item.createDiv({ cls: "fn-item-content-col" });
          contentCol.createDiv({ cls: "fn-item-content", text: entry.content });
          const rightCol = item.createDiv({ cls: "fn-item-right-col" });
          rightCol.createSpan({ cls: "fn-item-time", text: entry.time });
          const goBtn = rightCol.createDiv({ cls: "fn-goto-btn" });
          setIcon(goBtn, "external-link");
          goBtn.setAttribute("aria-label", "\u5B9A\u4F4D\u5230\u539F\u6587\u4EF6");
          goBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.navigateToEntry(entry.filePath, entry.line, entry);
          });
        }
      }
    } catch (e) {
      console.error("FleetingNotes refreshContent failed:", e);
      if (this.listEl) {
        this.listEl.empty();
        const errDiv = this.listEl.createDiv({ cls: "fn-empty" });
        errDiv.createDiv({ cls: "fn-empty-text", text: "\u52A0\u8F7D\u5931\u8D25" });
        errDiv.createDiv({ cls: "fn-empty-sub", text: e && e.message ? e.message : "\u8BF7\u91CD\u65B0\u6253\u5F00\u4E3B\u9875" });
      }
    } finally {
      this.rendering = false;
      if (this.pendingRefresh) {
        this.pendingRefresh = false;
        this.refresh();
      }
    }
  }
  async navigateToEntry(filePath: string, line: number, entry?: RecentEntry): Promise<void> {
    const file = this.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof TFile)) {
      new Notice("归档文件不存在或已被移动");
      return;
    }
    const resolved = await this.resolveEntryLine(file, line, entry);
    // 解析不到目标行时仍打开文件便于查看，但明确提示
    if (resolved < 0) {
      new Notice("未能定位到该条记录，文件内容可能已变化");
    }
    // 已有同一文件的 Markdown 视图时直接在其中定位
    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (activeView && activeView.file && activeView.file.path === filePath) {
      await this.focusLineWhenReady(activeView, resolved);
      return;
    }
    const leaf = this.app.workspace.getLeaf(false);
    let cleaned = false;
    let focused = false;
    const tryFocus = (view) => {
      if (focused || !view) return;
      void this.focusLineWhenReady(view, resolved).then((ok) => {
        if (ok) focused = true;
      });
    };
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      if (ref) this.app.workspace.offref(ref);
      if (timeout) clearTimeout(timeout);
    };
    const ref = this.app.workspace.on("file-open", (opened) => {
      if (opened && opened.path !== filePath)
        return;
      cleanup();
      tryFocus(this.app.workspace.getActiveViewOfType(MarkdownView));
    });
    this.registerEvent(ref);
    const timeout = setTimeout(cleanup, 5e3);
    // 跟踪起来，onClose 时统一清：视图关了以后再触发 cleanup 虽无害（只 offref/clear），
    // 但裸定时器是个悬空引用，插件重载时也一样留着
    this._openFileTimer = timeout;
    try {
      await leaf.openFile(file);
    } catch (e) {
      cleanup();
      throw e;
    }
    // 双保险：file-open 事件触发时编辑器文档往往尚未加载完成（lineCount 偏小），
    // 直接 setCursor 会落在空文档上、文档加载后被重置回开头；openFile 返回后再补一次
    // 尝试（等待文档就绪），两次尝试由 focused 去重
    tryFocus(this.app.workspace.getActiveViewOfType(MarkdownView));
  }
  /* entry.line 是解析时的快照，文件被编辑过会漂移；先校验快照行（形状 + 时间戳都要对上），失效则按 日期+时间 在文件内重搜 */
  async resolveEntryLine(file: TFile, line: number, entry?: RecentEntry): Promise<number> {
    const content = await this.app.vault.cachedRead(file);
    const lines = content.split("\n");
    // 只验形状的话，文件编辑后同一行号换上另一条记录的时间也会被当成命中，静默跳到错的那条
    const snapshotOk = entry
      ? line >= 0 && line < lines.length && new RegExp(`^- ${entry.time}(?:\\s|$)`).test(lines[line])
      : line >= 0 && line < lines.length && /^- \d{2}:\d{2}/.test(lines[line]);
    if (snapshotOk) {
      return line;
    }
    if (!entry) return -1;
    const dateRe = buildDayHeaderRegex(entry.date);
    const startIdx = lines.findIndex((l) => dateRe.test(l));
    if (startIdx === -1) return -1;
    const timeRe = new RegExp(`^- ${entry.time}(?:\\s|$)`);
    for (let i = startIdx + 1; i < lines.length; i++) {
      if (/^## /.test(lines[i])) break;
      if (timeRe.test(lines[i])) return i;
    }
    return -1;
  }
  /* 等待编辑器文档就绪后定位。openFile/file-open 触发时编辑器文档可能尚未加载完成
     （lineCount 偏小），直接 setCursor 会落在空文档上、文档加载后被重置回开头；
     短重试直到行数覆盖目标行。返回是否成功定位 */
  async focusLineWhenReady(view, line) {
    for (let tries = 0; tries < 20; tries++) {
      // 视图已关（容器脱离文档）就别再等了：setCursor 落在死视图上没意义
      if (view && view.containerEl && !view.containerEl.isConnected) return false;
      const editor = view && view.editor;
      if (editor && line >= 0 && editor.lineCount() > line) {
        editor.setCursor({ line, ch: 0 });
        editor.scrollIntoView(
          { from: { line, ch: 0 }, to: { line: line + 1, ch: 0 } },
          true
        );
        return true;
      }
      if (line < 0) return false;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return false;
  }
  async handleSubmit(textArea: HTMLTextAreaElement): Promise<void> {
    if (this.submitLocked) return;
    const text = textArea.value.trim();
    if (!text) {
      textArea.addClass("fn-input-error");
      // 入集合跟踪：onClose 统一清，避免视图关了以后定时器还在死 DOM 上跑
      if (this._inputErrorTimer) clearTimeout(this._inputErrorTimer);
      this._inputErrorTimer = setTimeout(() => {
        this._inputErrorTimer = null;
        textArea.removeClass("fn-input-error");
      }, 1500);
      return;
    }
    this.submitLocked = true;
    textArea.value = "";
    if (this._autoResize) this._autoResize();
    let saved = false;
    try {
      await this.noteManager.appendEntry(text);
      saved = true;
    } catch (e) {
      // await 期间用户可能已输入新内容，恢复时拼回去而不是覆盖
      textArea.value = textArea.value ? `${text}\n${textArea.value}` : text;
      if (this._autoResize) this._autoResize();
      new Notice(`\u4FDD\u5B58\u5931\u8D25\uFF1A${e && e.message ? e.message : "\u8BF7\u91CD\u8BD5"}`);
    } finally {
      this.submitLocked = false;
    }
    if (saved) {
      try {
        await this.refreshContent();
      } catch (e) {
        console.error("FleetingNotes refresh after submit failed:", e);
      }
    }
  }
}
