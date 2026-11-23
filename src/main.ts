import { Notice, Plugin, TFile } from "obsidian";
import { DEFAULT_SETTINGS, FleetingNotesSettings } from "./types";
import { NoteManager } from "./note-manager";
import { HomepageView, VIEW_TYPE_HOMEPAGE } from "./homepage-view";
import { FleetingSettingTab } from "./settings";

export default class FleetingNotesPlugin extends Plugin {
	settings: FleetingNotesSettings = DEFAULT_SETTINGS;
	noteManager!: NoteManager;
	private _refreshTimer: ReturnType<typeof setTimeout> | null;
	private _saveTimer: ReturnType<typeof setTimeout> | null;
	private _saveResolvers: Array<(value?: unknown) => void>;
	private _lastDateStr: string;

  async onload() {
    await this.loadSettings();
    this.noteManager = new NoteManager(this.app, this.settings, () => {
      void this.saveSettings();
    });
    this.registerView(
      VIEW_TYPE_HOMEPAGE,
      (leaf) => new HomepageView(leaf, this.noteManager, this.settings)
    );
    this.addRibbonIcon("zap", "\u95EA\u5FF5\u7B14\u8BB0", () => this.activateHomepage());
    this.addCommand({
      id: "fleeting-notes-open-homepage",
      name: "\u6253\u5F00\u95EA\u5FF5\u7B14\u8BB0\u4E3B\u9875",
      callback: () => this.activateHomepage()
    });
    this.addCommand({
      id: "fleeting-notes-open-current",
      name: "\u6253\u5F00\u5F53\u524D\u5F52\u6863\u6587\u4EF6",
      callback: () => this.openCurrentFile()
    });
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => {
        if (leaf && leaf.view instanceof HomepageView) {
          leaf.view.refresh();
        }
      })
    );
    this.registerEvent(
      this.app.vault.on("modify", (file) => {
        // 自写回声只跳过一次：这瓶 modify 是本插件刚才写入触发的，submit 流程已经刷过界面
        if (file instanceof TFile && this.noteManager.lastWritePath === file.path) {
          this.noteManager.lastWritePath = null;
          return;
        }
        if (this.isRelevantArchiveFile(file)) this.scheduleRefresh(300);
      })
    );
    this.registerEvent(
      this.app.vault.on("create", (file) => {
        if (this.isRelevantArchiveFile(file, true)) this.scheduleRefresh(200);
      })
    );
    this.registerEvent(
      this.app.vault.on("delete", (file) => {
        if (this.isRelevantArchiveFile(file, true)) this.scheduleRefresh(200);
      })
    );
    this.registerEvent(
      this.app.vault.on("rename", (file, oldPath) => this.handleFileRename(file, oldPath))
    );
    // 跨零点把「今日」翻篇：徽标与显示范围是渲染时的快照，不主动刷新会整晚停在昨天；
    // 同时清掉按周期算好的归档路径缓存，跨月/跨周/跨年后新记录要落到新文件
    this._lastDateStr = this.noteManager.getTodayStr();
    this.registerInterval(window.setInterval(() => {
      const today = this.noteManager.getTodayStr();
      if (today !== this._lastDateStr) {
        this._lastDateStr = today;
        this.noteManager.invalidateFilePathCache();
        this.scheduleRefresh(0);
      }
    }, 60 * 1000));
    this.addSettingTab(new FleetingSettingTab(this.app, this));
  }
  scheduleRefresh(delay) {
    if (this._refreshTimer) {
      clearTimeout(this._refreshTimer);
    }
    this._refreshTimer = setTimeout(() => {
      this._refreshTimer = null;
      // 同时打开多个主页视图（拆分页签）时全部刷新，避免后台视图停留在旧数据
      for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE_HOMEPAGE)) {
        if (leaf.view instanceof HomepageView) {
          leaf.view.refresh();
        }
      }
    }, delay);
  }
  /* 判断变更文件是否与当前周期/显示范围相关：无关文件（如按月归档时的日记 2026-08-30.md）不再触发重扫与重渲染 */
  isRelevantArchiveFile(file, invalidateCache = false) {
    if (!(file instanceof TFile)) return false;
    const folder = this.settings.storageFolder;
    if (folder && !file.path.startsWith(folder + "/")) return false;
    const capturedId = this.noteManager.matchArchiveName(file.name);
    if (!capturedId) return false;
    if (invalidateCache) {
      this.noteManager.invalidateFilePathCache();
    }
    const relevant = new Set(this.noteManager.getRecentPeriodIds(new Date(), this.settings.filePeriod));
    relevant.add(this.noteManager.getCurrentPeriodId());
    return relevant.has(capturedId);
  }
  handleFileRename(file, oldPath) {
    const folder = this.settings.storageFolder;
    const affected = (path) => {
      if (!path) return false;
      if (!folder) return true;
      if (path.startsWith(folder + "/")) return true;
      if ((folder + "/").startsWith(path + "/")) return true;
      return false;
    };
    if (!affected(file == null ? void 0 : file.path) && !affected(oldPath)) return;
    this.noteManager.invalidateFilePathCache();
    this.scheduleRefresh(200);
  }
  onunload() {
    // 关闭本插件的所有主页视图，避免禁用/重载后残留死视图
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_HOMEPAGE);
    if (this._refreshTimer) {
      clearTimeout(this._refreshTimer);
      this._refreshTimer = null;
    }
    if (this._saveTimer) {
      clearTimeout(this._saveTimer);
      this._saveTimer = null;
      // 300ms 防抖窗口内禁用/退出时立即落盘，避免最后一批设置变更丢失；
      // 等待中的调用方在落盘（成功或失败）后统一放行
      const resolvers = this._saveResolvers || [];
      this._saveResolvers = [];
      void this.saveData(this.settings).catch((e) => console.error("FleetingNotes saveData on unload failed:", e)).finally(() => {
        for (const r of resolvers) r();
      });
    }
  }
  /* 校验存储目录输入：反斜杠转正斜杠、去首尾空白、去尾斜杠、禁止 .. 段 */
  sanitizeFolder(raw) {
    if (!raw) return "";
    let v = String(raw).trim().replace(/\\/g, "/").replace(/\/+/g, "/").replace(/\/+$/, "");
    if (v.includes("/../") || v === ".." || v.startsWith("../") || v.endsWith("/..")) {
      new Notice("\u5B58\u50A8\u76EE\u5F55\u4E0D\u5141\u8BB8\u5305\u542B .. \u6BB5");
      return "";
    }
    return v;
  }
  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    if (this.settings.storageFolder) {
      this.settings.storageFolder = this.sanitizeFolder(this.settings.storageFolder);
    }
  }
  async saveSettings() {
    this.noteManager.updateSettings(this.settings);
    this.scheduleRefresh(0);
    if (this._saveTimer) {
      clearTimeout(this._saveTimer);
    }
    // 防抖窗口内多次调用都等最后一次真实落盘：旧实现会把早前的 promise 提前 resolve，
    // 调用方 await 到的并不是"已保存"
    this._saveResolvers = this._saveResolvers || [];
    return new Promise((resolve) => {
      this._saveResolvers.push(resolve);
      this._saveTimer = setTimeout(async () => {
        this._saveTimer = null;
        const resolvers = this._saveResolvers;
        this._saveResolvers = [];
        try {
          await this.saveData(this.settings);
        } catch (e) {
          console.error("FleetingNotes saveData failed:", e);
          new Notice("闪念笔记：设置保存失败");
        }
        for (const r of resolvers) r();
      }, 300);
    });
  }
  async activateHomepage() {
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_HOMEPAGE);
    let leaf;
    if (leaves.length > 0) {
      leaf = leaves[0];
    } else {
      leaf = this.app.workspace.getLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE_HOMEPAGE, active: true });
    }
    this.app.workspace.revealLeaf(leaf);
    if (leaf.view instanceof HomepageView) {
      leaf.view.refresh();
    }
  }
  async openCurrentFile() {
    try {
      const file = await this.noteManager.ensureCurrentFile();
      await this.app.workspace.getLeaf(false).openFile(file);
    } catch (e) {
      console.error("FleetingNotes openCurrentFile failed:", e);
      new Notice(`打开归档文件失败：${e && e.message ? e.message : e}`);
    }
  }
}
