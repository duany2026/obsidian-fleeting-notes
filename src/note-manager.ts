import { App, Notice, TFile, TFolder, normalizePath } from "obsidian";
import { FleetingNotesSettings, RecentEntry } from "./types";

/* 构造匹配某天分区标题的正则：同时兼容补零与不补零两种日期写法 */
export function buildDayHeaderRegex(dateStr: string): RegExp {
  const parts = dateStr.split("-");
  const variants = [dateStr, `${parts[0]}-${Number(parts[1])}-${Number(parts[2])}`];
  const uniq = [...new Set(variants)];
  return new RegExp(`^## (?:${uniq.join("|")})(?=\\s|$).*$`, "m");
}
/* 围栏遮罩：mask[i]=true 表示该行是 ```/~~~ 围栏行或位于围栏内部。
   解析与追加共用同一口径，围栏里的 `## 2026-…`、`- HH:MM` 一律不算分区与条目。
   只认顶格（至多缩进 3 个空格）的围栏标记：Tab 缩进行是插件写的内容行，
   用户闪念里贴的 ``` 不能当成围栏开关；开闭必须同字符（``` 配 ```、~~~ 配 ~~~）且收尾不短于开头。
   openMarker 供追加侧判断：文件结尾还在未闭合的围栏里时，用同一个标记收口再落新分区 */
function fenceMask(lines) {
  const mask = new Array(lines.length).fill(false);
  let fence = null;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^ {0,3}(`{3,}|~{3,})/);
    if (m) {
      const char = m[1][0];
      const len = m[1].length;
      if (!fence) {
        fence = { char, len };
        mask[i] = true;
      } else if (char === fence.char && len >= fence.len) {
        fence = null;
        mask[i] = true;
      } else {
        mask[i] = true;
      }
    } else if (fence) {
      mask[i] = true;
    }
  }
  return { mask, openMarker: fence ? fence.char.repeat(fence.len) : null };
}
/* 在归档全文中追加一条闪念（纯函数）：已有当日分区则插到该分区末尾（时间正序），否则文末新建当日分区。
   CRLF 行尾的归档文件保持行尾一致：新增行跟随文件已有行尾，避免混入裸 LF。
   分区边界与解析侧同口径：`# `/`## ` 标题都截断当日分区，且两侧都跳过代码围栏内部 */
function applyFleetingAppend(existing, todayStr, entry) {
  const eol = existing.includes("\r\n") ? "\r\n" : "\n";
  const entryEol = eol === "\n" ? entry : entry.split("\n").join(eol);
  const lines = existing.split("\n");
  const { mask, openMarker } = fenceMask(lines);
  const dayRe = buildDayHeaderRegex(todayStr);
  let headerIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (!mask[i] && dayRe.test(lines[i])) {
      headerIdx = i;
      break;
    }
  }
  if (headerIdx !== -1) {
    let insertIdx = lines.length;
    for (let j = headerIdx + 1; j < lines.length; j++) {
      // `# ` 也算边界：解析侧遇一级/二级标题都会重置日期归属，插到 H1 之下条目就丢进无名分区
      if (!mask[j] && /^#{1,2} /.test(lines[j])) {
        insertIdx = j;
        break;
      }
    }
    if (openMarker) {
      // 尾部未闭合围栏的开启行也是边界：新条目要落在围栏开启之前，
      // 否则被写进围栏内部，解析侧再也看不到它
      let k = lines.length - 1;
      while (k > headerIdx && mask[k]) k--;
      const fenceStart = k + 1;
      if (fenceStart > headerIdx && fenceStart < insertIdx) insertIdx = fenceStart;
    }
    const before = lines.slice(0, insertIdx).join("\n").trimEnd();
    const rest = lines.slice(insertIdx).join("\n");
    // 拼接缝结构上最多两个连续换行（before 已 trimEnd，rest 为空或以 "## " 开头）；
    // 不做全文件 \n{3,} 替换，避免压缩用户在其他日期分区有意保留的空行
    return before + eol + entryEol + eol + rest;
  }
  const prefix = existing.trimEnd();
  // 文件结尾还挂在未闭合围栏里时用原标记收口（~~~ 开的用 ``` 收不上），
  // 否则新分区标题落进围栏，追加/解析两侧都认不出
  const closer = openMarker ? eol + openMarker : "";
  return (prefix ? prefix + closer + eol + eol : "") + `## ${todayStr}` + eol + eol + entryEol + eol;
}
export class NoteManager {
	private app: App;
	private settings: FleetingNotesSettings;
	private persistSettings: (() => void) | null;
	private currentFilePathCache: string | null;
	private currentFilePathCacheKey: string | null;
	private writeQueue: Promise<void>;
	private _acceptedFallbackNames: Set<string>;
	lastWritePath: string | null;

  constructor(app: App, settings: FleetingNotesSettings, persistSettings?: () => void) {
    this.app = app;
    this.settings = settings;
    // 用户确认过的非标准命名归档文件（如手动加了后缀）：仅首次写入时提示一次，之后不再打扰
    this._acceptedFallbackNames = new Set(Array.isArray(settings.acceptedFallbackNames) ? settings.acceptedFallbackNames : []);
    this.persistSettings = persistSettings || null;
    this.currentFilePathCache = null;
    this.currentFilePathCacheKey = null;
    this.writeQueue = Promise.resolve();
  }
  /* ---------- 写入队列（串行化所有写操作，防止并发覆盖） ---------- */
  enqueueWrite(task) {
    const run = this.writeQueue.then(task, task);
    this.writeQueue = run.catch(() => {});
    return run;
  }
  updateSettings(settings) {
    this.settings = settings;
  }
  invalidateFilePathCache() {
    this.currentFilePathCache = null;
    this.currentFilePathCacheKey = null;
  }
  /* ---------- 时间工具 ---------- */
  getMonthStr(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }
  getISOWeekStr(d) {
    const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dayNum = date.getDay() || 7;
    date.setDate(date.getDate() + 4 - dayNum);
    const year = date.getFullYear();
    const jan1 = new Date(year, 0, 1);
    // 先取整天数再算周：DST 时区的毫秒差会多出 1 小时，直接用毫秒值 ceil 会令周号整体 +1
    const dayDiff = Math.round((date.getTime() - jan1.getTime()) / 864e5);
    const weekNum = Math.ceil((dayDiff + 1) / 7);
    return `${year}-W${String(weekNum).padStart(2, "0")}`;
  }
  getYearStr(d) {
    return `${d.getFullYear()}`;
  }
  getTodayStr() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }
  getTimeStr() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  }
  /* ---------- 文件路径 ---------- */
  /* regex 按 specificity 从高到低排序：日 > 月 > 周 > 年。
     扫描时对每个文件取第一个命中的 regex 定类型，避免日文件被月 regex 误捕获。 */
  getScanRegexes() {
    return [
      /^(\d{4}-\d{2}-\d{2}).*\.md$/i,
      /^(\d{4}-\d{2}).*\.md$/i,
      /^(\d{4}-W\d{2}).*\.md$/i,
      /^(\d{4}).*\.md$/i
    ];
  }
  getCurrentPeriodId() {
    const now = new Date();
    switch (this.settings.filePeriod) {
      case "week":
        return this.getISOWeekStr(now);
      case "year":
        return this.getYearStr(now);
      default:
        return this.getMonthStr(now);
    }
  }
  /* 名称匹配任一归档命名模式时返回捕获的周期 id（按 specificity 首个命中优先），否则返回 null */
  matchArchiveName(name) {
    for (const regex of this.getScanRegexes()) {
      const m = name.match(regex);
      if (m) return m[1];
    }
    return null;
  }
  /* 内容层面确认是归档结构（有日期分区标题 + 至少一条"时间戳行后紧跟 Tab 缩进内容行"的条目），
     防止把日期开头的普通笔记当备胎；只认 `- HH:MM` 行会把带时间清单的会议纪要之类误判进来。
     判定前先剥掉代码围栏，围栏里的示例格式行不算数 */
  async looksLikeArchive(file) {
    const content = await this.app.vault.cachedRead(file);
    const lines = content.split("\n");
    const { mask } = fenceMask(lines);
    const body = lines.filter((_, i) => !mask[i]).join("\n");
    return /^## \d{4}-\d{1,2}-\d{1,2}(?:\s|$)/m.test(body) && /^- \d{2}:\d{2}\r?\n\t/m.test(body);
  }
  async getCurrentFilePath() {
    const currentId = this.getCurrentPeriodId();
    const cacheKey = `${this.settings.filePeriod}|${this.settings.storageFolder}|${currentId}`;
    if (this.currentFilePathCacheKey === cacheKey && this.currentFilePathCache) {
      return this.currentFilePathCache;
    }
    const folder = this.settings.storageFolder;
    const defaultFileName = `${currentId}.md`;
    const defaultPath = folder ? normalizePath(`${folder}/${defaultFileName}`) : normalizePath(defaultFileName);
    let result = null;
    const directHit = this.app.vault.getAbstractFileByPath(defaultPath);
    if (directHit instanceof TFile) {
      result = directHit.path;
    } else {
      const allFiles = folder ? this.app.vault.getFiles().filter((f) => f.path.startsWith(folder + "/")) : this.app.vault.getFiles();
      let fallback = null;
      for (const f of allFiles) {
        if (this.matchArchiveName(f.name) !== currentId) continue;
        if (f.name === defaultFileName) {
          result = f.path;
          break;
        }
        // 同步盘的冲突副本（`2026-06 1.md`）不作写入备胎：它按定义是同一份的复制，
        // 写进副本等于把新记录锁进同步盘迟早要清掉的残片里
        if (/\s\d+\.md$/i.test(f.name)) continue;
        // 非标准命名：内容确实符合归档格式才可作为备胎，避免把日期开头的普通笔记当归档文件写入
        if (!fallback && await this.looksLikeArchive(f)) {
          fallback = f.path;
        }
      }
      result = result || fallback;
    }
    if (!result) {
      result = defaultPath;
    }
    this.currentFilePathCache = result;
    this.currentFilePathCacheKey = cacheKey;
    return result;
  }
  /* ---------- 文件操作 ---------- */
  async ensureDirectoryExists(dirPath) {
    if (!dirPath)
      return;
    if (this.app.vault.getAbstractFileByPath(dirPath) instanceof TFolder)
      return;
    const parent = dirPath.substring(0, dirPath.lastIndexOf("/"));
    if (parent)
      await this.ensureDirectoryExists(parent);
    if (!this.app.vault.getAbstractFileByPath(dirPath)) {
      try {
        await this.app.vault.createFolder(dirPath);
      } catch (e) {
        if (!(this.app.vault.getAbstractFileByPath(dirPath) instanceof TFolder)) {
          throw e;
        }
      }
    }
  }
  /* 返回 { file, created }：created 标记文件是否由本次调用创建，供失败回滚判断（只删自己建的） */
  async ensureFileExists(filePath, initialContent) {
    const existing = this.app.vault.getAbstractFileByPath(filePath);
    if (existing instanceof TFile)
      return { file: existing, created: false };
    const dir = filePath.substring(0, filePath.lastIndexOf("/"));
    await this.ensureDirectoryExists(dir);
    try {
      const file = await this.app.vault.create(filePath, initialContent);
      return { file, created: true };
    } catch (e) {
      const retry = this.app.vault.getAbstractFileByPath(filePath);
      if (retry instanceof TFile) return { file: retry, created: false };
      throw e;
    }
  }
  /** 确保当前周期文件存在（仅创建，不追加条目） */
  async ensureCurrentFile() {
    const filePath = await this.getCurrentFilePath();
    const { file } = await this.ensureFileExists(filePath, "");
    return file;
  }
  /* ---------- 追加一条闪念 ---------- */
  async appendEntry(content) {
    return this.enqueueWrite(() => this._appendEntryUnchecked(content));
  }
  async _appendEntryUnchecked(content) {
    const filePath = await this.getCurrentFilePath();
    let file;
    let createdByUs = false;
    try {
      const ensured = await this.ensureFileExists(filePath, "");
      file = ensured.file;
      createdByUs = ensured.created;
    } catch (e) {
      throw new Error(`打开文件失败：${filePath} — ${e && e.message ? e.message : e}`);
    }
    const todayStr = this.getTodayStr();
    const timeStr = this.getTimeStr();
    const indented = content.split("\n").map((l) => "\t" + l).join("\n");
    const entry = `- ${timeStr}\n${indented}`;
    try {
      // vault.process 原子地"读最新内容→拼接→写回"，消除与同步盘/外部编辑之间的整文件覆盖竞态。
      // 回声标记必须先标再写：modify 事件由宿主异发派发，写完成后才标的话，
      // 事件可能先于赋值到达，自写回声没被消费就多刷一次；写失败时在 catch 里撤掉
      this.lastWritePath = file.path;
      await this.app.vault.process(file, (existing) => applyFleetingAppend(existing, todayStr, entry));
      // 回声标记一次性消费：紧随自写的那个 modify 事件不再触发整页重绘（调用处已经刷过），
      // 之后同路径的任何改动照常刷新
    } catch (e) {
      this.lastWritePath = null;
      // 只回滚本次调用自己创建的文件，避免误删外部恰好同名创建的文件
      if (createdByUs) {
        try {
          await this.app.vault.delete(file);
        } catch (deleteErr) {
          console.error("FleetingNotes cleanup created file failed:", deleteErr);
        }
      }
      throw new Error(`写入文件失败：${file.path} — ${e && e.message ? e.message : e}`);
    }
    // 写入目标不是标准命名的归档文件时，首次以中性文案告知去向并记住（如用户有意
    // 给归档文件加了后缀属正常用法），之后写入不再打扰；误写防护由备胎的内容识别兜底
    const defaultName = `${this.getCurrentPeriodId()}.md`;
    if (file.name !== defaultName && !this._acceptedFallbackNames.has(file.name)) {
      this._acceptedFallbackNames.add(file.name);
      this.settings.acceptedFallbackNames = [...this._acceptedFallbackNames];
      if (this.persistSettings) this.persistSettings();
      new Notice(`闪念笔记：本次及之后的记录将写入「${file.name}」`);
    }
  }
  /* ---------- 获取最近记录 ---------- */
  async getRecentEntries() {
    const files = await this.collectRecentFiles();
    const entries: RecentEntry[] = [];
    for (const file of files) {
      await this.parseEntriesFromFile(file, entries);
    }
    entries.sort((a, b) => {
      const c = b.date.localeCompare(a.date);
      return c !== 0 ? c : b.time.localeCompare(a.time);
    });
    // 同一记录可能同时存在于标准文件和备份副本（如 2026-08.md 与 2026-08-备份.md），按内容去重。
    // 键附带条目在其文件内的出现序号：同一分钟内的重复闪念各占一个序号不会被吞，
    // 而备份副本与原件在各自文件中的序号一致，跨文件合并时仍能正确去重
    const seen = /* @__PURE__ */ new Set();
    return entries.filter((e) => {
      const key = `${e.date}|${e.time}|${e.content}|${e.occurrence || 1}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  /* 根据当前周期收集需要扫描的文件（先试探已知路径，未命中再全量扫描兜底） */
  async collectRecentFiles() {
    const folder = this.settings.storageFolder;
    const now = new Date();
    const periods = this.getRecentPeriodIds(now, this.settings.filePeriod);
    const keep = [];
    const seen = /* @__PURE__ */ new Set();
    const tryAdd = (file) => {
      if (file instanceof TFile && !seen.has(file.path)) {
        keep.push(file);
        seen.add(file.path);
      }
    };
    for (const id of periods) {
      const fileName = `${id}.md`;
      const path = folder ? normalizePath(`${folder}/${fileName}`) : normalizePath(fileName);
      tryAdd(this.app.vault.getAbstractFileByPath(path));
    }
    if (keep.length < periods.length) {
      const allFiles = folder ? this.app.vault.getFiles().filter((f) => f.path.startsWith(folder + "/")) : this.app.vault.getFiles();
      for (const f of allFiles) {
        if (seen.has(f.path)) continue;
        const captured = this.matchArchiveName(f.name);
        if (!captured || !periods.includes(captured)) continue;
        // 非标准命名：内容确实符合归档格式才纳入，避免无关笔记混入最近列表
        if (f.name !== `${captured}.md` && !(await this.looksLikeArchive(f))) continue;
        tryAdd(f);
      }
    }
    return keep;
  }
  /* 返回覆盖"徽章统计所需日期区间"（当前自然周 ∪ 当前自然月）的周期 id 列表，跨月/跨年自动并入相邻周期。
     列表自身的显示范围过滤由视图层完成；这里覆盖周∪月可保证月初/月末/跨年时本周、本月徽章不少计 */
  getRecentPeriodIds(now, filePeriod) {
    const ids = [];
    const seen = /* @__PURE__ */ new Set();
    const push = (d) => {
      let id;
      switch (filePeriod) {
        case "week":
          id = this.getISOWeekStr(d);
          break;
        case "year":
          id = this.getYearStr(d);
          break;
        default:
          id = this.getMonthStr(d);
          break;
      }
      if (!seen.has(id)) {
        seen.add(id);
        ids.push(id);
      }
    };
    const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(base);
    weekStart.setDate(base.getDate() - (base.getDay() === 0 ? 6 : base.getDay() - 1));
    const monthStart = new Date(base.getFullYear(), base.getMonth(), 1);
    const start = weekStart < monthStart ? weekStart : monthStart;
    for (let d = new Date(start); d <= base; d.setDate(d.getDate() + 1)) {
      push(d);
    }
    return ids;
  }
  async parseEntriesFromFile(file: TFile, entries: RecentEntry[]): Promise<void> {
    if (!(file instanceof TFile)) return;
    const content = await this.app.vault.cachedRead(file);
    const lines = content.split("\n");
    const { mask } = fenceMask(lines);
    let currentDate = "";
    const localSeen = /* @__PURE__ */ new Map();
    for (let i = 0; i < lines.length; i++) {
      if (mask[i]) continue;
      const dateMatch = lines[i].match(/^## (\d{4})-(\d{1,2})-(\d{1,2})(?=\s|$)/);
      if (dateMatch) {
        // 归一化为补零日期：未补零的手写标题（如 2026-9-5）也能与插件生成的分区正确归组；
        // 边界 (?=\s|$) 与追加侧 buildDayHeaderRegex 一致：`## 2026-06-01会议`（无空格）视为新分区，不再误归组
        currentDate = `${dateMatch[1]}-${dateMatch[2].padStart(2, "0")}-${dateMatch[3].padStart(2, "0")}`;
        continue;
      }
      // 其他一级/二级标题重置日期归属：追加侧把任意 `# `/`## ` 当分区边界，
      // 不重置的话用户手写在 `## 杂记` 下的 `- HH:MM` 行会被算进上一个日期分区
      if (/^#{1,2} /.test(lines[i])) {
        currentDate = "";
        continue;
      }
      const timeMatch = lines[i].match(/^- (\d{2}:\d{2})/);
      if (timeMatch && currentDate) {
        const time = timeMatch[1];
        const startLine = i;
        let textLines = [];
        let j = i + 1;
        while (j < lines.length) {
          const next = lines[j];
          if (/^- \d{2}:\d{2}/.test(next) || /^## /.test(next))
            break;
          if (next.startsWith("	")) {
            // 行尾 \r（CRLF 文件）剥掉：内容与去重键不再携带行尾残留，
            // LF 原件 / CRLF 备份副本这类跨行尾风格的重复记录也能正确合并为一条
            textLines.push(next.replace(/^\t/, "").replace(/\r$/, ""));
          } else if (next.trim() === "") {
            textLines.push("");
          } else {
            break;
          }
          j++;
        }
        const text = textLines.join("\n").trimEnd().replace(/\n{3,}/g, "\n\n");
        if (text) {
          // 记录该键在文件内的出现序号：同一分钟内记录两条相同内容时各占一个序号，
          // 供 getRecentEntries 跨文件去重时区分"合法重复"与"备份副本"
          const key = `${currentDate}|${time}|${text}`;
          const occurrence = (localSeen.get(key) || 0) + 1;
          localSeen.set(key, occurrence);
          entries.push({
            date: currentDate,
            time,
            content: text,
            filePath: file.path,
            line: startLine,
            occurrence
          });
        }
      }
    }
  }
}
