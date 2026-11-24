import { getLanguage, moment } from "obsidian";

/* 界面文案三语表（zh-CN / zh-TW / en）。
   - zh-CN 是权威源语言：新增文案先写简中，再补繁中与英文
   - 只翻译界面显示；写进归档文件的格式（文件名 2026-06.md、## 2026-06-01、- HH:MM）
     本身语言中性，不进表
   - 占位符统一写成 {name}
   - zh-TW / en 以 Record<I18nKey, string> 声明：缺词条或多出词条时 tsc 直接报错 */
const zhCN = {
  "plugin.name": "闪念笔记",
  "cmd.openHomepage": "打开闪念笔记主页",
  "cmd.openCurrent": "打开当前归档文件",

  "notice.folderDotDot": "存储目录不允许包含 .. 段",
  "notice.saveSettingsFailed": "闪念笔记：设置保存失败",
  "notice.openCurrentFailed": "打开归档文件失败：{msg}",
  "notice.writeTarget": "闪念笔记：本次及之后的记录将写入「{name}」",
  "notice.fileMissing": "归档文件不存在或已被移动",
  "notice.locateFailed": "未能定位到该条记录，文件内容可能已变化",
  "notice.saveFailed": "保存失败：{msg}",
  "notice.retry": "请重试",

  "error.openFile": "打开文件失败：{path} — {msg}",
  "error.writeFile": "写入文件失败：{path} — {msg}",

  "view.placeholder": "记下此刻的想法…",
  "view.submit": "记录",
  "view.recent": "最近记录",
  "view.headerDate": "{month}{day}日 {weekday}",
  "view.badge.today": "今日 {n}",
  "view.badge.week": "本周 {n}",
  "view.badge.month": "本月 {n}",
  "view.today": "今天",
  "view.yesterday": "昨天",
  "view.empty.title": "还没有记录",
  "view.empty.sub": "写下你的第一个想法吧",
  "view.emptyRange.title": "当前范围无记录",
  "view.emptyRange.sub": "可在设置中调整显示范围",
  "view.goto": "定位到原文件",
  "view.loadFailed": "加载失败",
  "view.reopen": "请重新打开主页",

  "weekday.0": "周日",
  "weekday.1": "周一",
  "weekday.2": "周二",
  "weekday.3": "周三",
  "weekday.4": "周四",
  "weekday.5": "周五",
  "weekday.6": "周六",
  "month.1": "1月",
  "month.2": "2月",
  "month.3": "3月",
  "month.4": "4月",
  "month.5": "5月",
  "month.6": "6月",
  "month.7": "7月",
  "month.8": "8月",
  "month.9": "9月",
  "month.10": "10月",
  "month.11": "11月",
  "month.12": "12月",

  "settings.heading": "闪念笔记设置",
  "settings.folder.name": "存储目录",
  "settings.folder.desc": "闪念笔记文件所在的文件夹路径。例如：设为「闪念笔记」，文件将保存在 闪念笔记/2026-06.md。留空则放在仓库根目录。修改目录不会自动迁移已有文件。",
  "settings.folder.placeholder": "留空 = 仓库根目录",
  "settings.period.name": "文件归档周期",
  "settings.period.desc": "新记录的归档方式。切换只影响新记录写入哪个文件，已有文件保持不变；「最近记录」仅读取按当前周期归档的文件。",
  "settings.period.month": "按月（2026-06.md）",
  "settings.period.week": "按周（2026-W23.md）",
  "settings.period.year": "按年（2026.md）",
  "settings.range.name": "主页显示范围",
  "settings.range.desc": "「最近记录」区域展示的时间范围。",
  "settings.range.month": "本月",
  "settings.range.week": "本周",
  "settings.range.today": "今日",
  "settings.help.heading": "使用说明",
  "settings.help.p1": "在主页输入框中写入内容，点击「记录」或按 Ctrl+Enter 保存。记录按月（/周/年）归档到一个 Markdown 文件中，按日期分组、按时间排序。",
  "settings.help.p2": "你可以点击每条记录右侧的箭头图标定位到原文件对应位置，也可以直接打开归档文件手工编辑。文件重命名后插件仍能正确识别。",
  "settings.example.heading": "文件格式示例",
  "settings.example.line1": "内容第一行",
  "settings.example.line2": "第二行",
  "settings.example.evening": "晚上的记录",
  "settings.example.morning": "早上写的"
} as const;

export type I18nKey = keyof typeof zhCN;
export type Lang = "zh-CN" | "zh-TW" | "en";

const zhTW: Record<I18nKey, string> = {
  "plugin.name": "閃念筆記",
  "cmd.openHomepage": "開啟閃念筆記主頁",
  "cmd.openCurrent": "開啟目前的歸檔檔案",

  "notice.folderDotDot": "儲存目錄不允許包含 .. 段",
  "notice.saveSettingsFailed": "閃念筆記：設定儲存失敗",
  "notice.openCurrentFailed": "開啟歸檔檔案失敗：{msg}",
  "notice.writeTarget": "閃念筆記：本次及之後的記錄將寫入「{name}」",
  "notice.fileMissing": "歸檔檔案不存在或已被移動",
  "notice.locateFailed": "未能定位到該筆記錄，檔案內容可能已變更",
  "notice.saveFailed": "儲存失敗：{msg}",
  "notice.retry": "請重試",

  "error.openFile": "開啟檔案失敗：{path} — {msg}",
  "error.writeFile": "寫入檔案失敗：{path} — {msg}",

  "view.placeholder": "記下此刻的想法…",
  "view.submit": "記錄",
  "view.recent": "最近記錄",
  "view.headerDate": "{month}{day}日 {weekday}",
  "view.badge.today": "今日 {n}",
  "view.badge.week": "本週 {n}",
  "view.badge.month": "本月 {n}",
  "view.today": "今天",
  "view.yesterday": "昨天",
  "view.empty.title": "還沒有記錄",
  "view.empty.sub": "寫下你的第一個想法吧",
  "view.emptyRange.title": "目前範圍沒有記錄",
  "view.emptyRange.sub": "可在設定中調整顯示範圍",
  "view.goto": "定位到原始檔案",
  "view.loadFailed": "載入失敗",
  "view.reopen": "請重新開啟主頁",

  "weekday.0": "週日",
  "weekday.1": "週一",
  "weekday.2": "週二",
  "weekday.3": "週三",
  "weekday.4": "週四",
  "weekday.5": "週五",
  "weekday.6": "週六",
  "month.1": "1月",
  "month.2": "2月",
  "month.3": "3月",
  "month.4": "4月",
  "month.5": "5月",
  "month.6": "6月",
  "month.7": "7月",
  "month.8": "8月",
  "month.9": "9月",
  "month.10": "10月",
  "month.11": "11月",
  "month.12": "12月",

  "settings.heading": "閃念筆記設定",
  "settings.folder.name": "儲存目錄",
  "settings.folder.desc": "閃念筆記檔案所在的資料夾路徑。例如：設為「閃念筆記」，檔案將儲存在 閃念筆記/2026-06.md。留空則放在儲存庫根目錄。修改目錄不會自動搬移已有檔案。",
  "settings.folder.placeholder": "留空 = 儲存庫根目錄",
  "settings.period.name": "檔案歸檔週期",
  "settings.period.desc": "新記錄的歸檔方式。切換只影響新記錄寫入哪個檔案，已有檔案保持不變；「最近記錄」僅讀取按目前週期歸檔的檔案。",
  "settings.period.month": "按月（2026-06.md）",
  "settings.period.week": "按週（2026-W23.md）",
  "settings.period.year": "按年（2026.md）",
  "settings.range.name": "主頁顯示範圍",
  "settings.range.desc": "「最近記錄」區域顯示的時間範圍。",
  "settings.range.month": "本月",
  "settings.range.week": "本週",
  "settings.range.today": "今日",
  "settings.help.heading": "使用說明",
  "settings.help.p1": "在主頁輸入框中寫入內容，點擊「記錄」或按 Ctrl+Enter 儲存。記錄按月（/週/年）歸檔到一個 Markdown 檔案中，按日期分組、按時間排序。",
  "settings.help.p2": "你可以點擊每筆記錄右側的箭頭圖示定位到原始檔案對應位置，也可以直接開啟歸檔檔案手動編輯。檔案重新命名後外掛仍能正確識別。",
  "settings.example.heading": "檔案格式範例",
  "settings.example.line1": "內容第一行",
  "settings.example.line2": "第二行",
  "settings.example.evening": "晚上的記錄",
  "settings.example.morning": "早上寫的"
};

const en: Record<I18nKey, string> = {
  "plugin.name": "Fleeting notes",
  "cmd.openHomepage": "Open fleeting notes",
  "cmd.openCurrent": "Open current archive file",

  "notice.folderDotDot": "The storage folder cannot contain \"..\" segments",
  "notice.saveSettingsFailed": "Fleeting notes: failed to save settings",
  "notice.openCurrentFailed": "Failed to open the archive file: {msg}",
  "notice.writeTarget": "Fleeting notes: this and future entries go to \"{name}\"",
  "notice.fileMissing": "The archive file doesn't exist or was moved",
  "notice.locateFailed": "Couldn't find this entry — the file may have changed",
  "notice.saveFailed": "Failed to save: {msg}",
  "notice.retry": "try again",

  "error.openFile": "Failed to open file: {path} — {msg}",
  "error.writeFile": "Failed to write file: {path} — {msg}",

  "view.placeholder": "Capture the thought on your mind…",
  "view.submit": "Save",
  "view.recent": "Recent entries",
  "view.headerDate": "{weekday}, {month} {day}",
  "view.badge.today": "Today {n}",
  "view.badge.week": "This week {n}",
  "view.badge.month": "This month {n}",
  "view.today": "Today",
  "view.yesterday": "Yesterday",
  "view.empty.title": "No entries yet",
  "view.empty.sub": "Write down your first idea",
  "view.emptyRange.title": "No entries in this range",
  "view.emptyRange.sub": "You can change the display range in settings",
  "view.goto": "Show in file",
  "view.loadFailed": "Failed to load",
  "view.reopen": "Please reopen the home view",

  "weekday.0": "Sun",
  "weekday.1": "Mon",
  "weekday.2": "Tue",
  "weekday.3": "Wed",
  "weekday.4": "Thu",
  "weekday.5": "Fri",
  "weekday.6": "Sat",
  "month.1": "Jan",
  "month.2": "Feb",
  "month.3": "Mar",
  "month.4": "Apr",
  "month.5": "May",
  "month.6": "Jun",
  "month.7": "Jul",
  "month.8": "Aug",
  "month.9": "Sep",
  "month.10": "Oct",
  "month.11": "Nov",
  "month.12": "Dec",

  "settings.heading": "Fleeting notes",
  "settings.folder.name": "Storage folder",
  "settings.folder.desc": "Folder that holds the archive files. For example, set it to \"Fleeting\" and entries are saved in Fleeting/2026-06.md. Leave empty to use the vault root. Changing the folder does not move existing files.",
  "settings.folder.placeholder": "Empty = vault root",
  "settings.period.name": "Archive period",
  "settings.period.desc": "How new entries are archived. Switching only changes which file new entries go to; existing files stay as they are. \"Recent entries\" only reads files of the current period.",
  "settings.period.month": "Monthly (2026-06.md)",
  "settings.period.week": "Weekly (2026-W23.md)",
  "settings.period.year": "Yearly (2026.md)",
  "settings.range.name": "Home display range",
  "settings.range.desc": "Time range shown in \"Recent entries\".",
  "settings.range.month": "This month",
  "settings.range.week": "This week",
  "settings.range.today": "Today",
  "settings.help.heading": "How to use",
  "settings.help.p1": "Type in the input box on the home view, then click \"Save\" or press Ctrl+Enter. Entries are archived into one Markdown file per month (or week / year), grouped by date and sorted by time.",
  "settings.help.p2": "Click the arrow on an entry to jump to it in the archive file, or open the file and edit by hand. Renamed archive files are still recognized.",
  "settings.example.heading": "File format example",
  "settings.example.line1": "First line of the entry",
  "settings.example.line2": "Second line",
  "settings.example.evening": "An evening note",
  "settings.example.morning": "Written in the morning"
};

export const I18N: Record<Lang, Record<I18nKey, string>> = { "zh-CN": zhCN, "zh-TW": zhTW, en };

/* 当前界面语言：插件 onload 时由 initLanguage() 按 Obsidian 界面语言确定。
   Obsidian 切换界面语言需要重启应用，插件随之重载，因此加载时取一次即可 */
export let I18N_LANG: Lang = "zh-CN";

/* 把语言码归一到 zh-CN / zh-TW / en：
   zh 系里带 hant/tw/hk/mo 的归繁体、其余归简体；en 开头与其余一切语言（含取不到）回退 en */
export function resolveLanguage(code: unknown): Lang {
  if (!code || typeof code !== "string") return "en";
  const lower = code.toLowerCase();
  if (lower.startsWith("zh")) {
    return /hant|tw|hk|mo/.test(lower) ? "zh-TW" : "zh-CN";
  }
  return "en";
}

/* getLanguage() 自 Obsidian 1.8.7 起提供；更老的版本（minAppVersion 1.7.2）上退回
   moment.locale()——Obsidian 启动时会把 moment 的区域设成界面语言 */
export function initLanguage(): Lang {
  let code: string | undefined;
  try {
    code = typeof getLanguage === "function" ? getLanguage() : moment.locale();
  } catch {
    code = undefined;
  }
  I18N_LANG = resolveLanguage(code);
  return I18N_LANG;
}

/* 取词：当前语言缺词时回退 zh-CN，两处都没有返回 key 本身（便于发现漏翻） */
export function tr(key: I18nKey, vars?: Record<string, string | number>): string {
  const s = I18N[I18N_LANG]?.[key] ?? I18N["zh-CN"][key] ?? key;
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (m0, name: string) => (vars[name] === undefined || vars[name] === null ? m0 : String(vars[name])));
}

/* 取异常的说明文字：有 message 用 message，否则用 fallback（缺省时把异常本身转成字符串） */
export function errorText(e: unknown, fallback?: string): string {
  const m = (e as { message?: unknown } | null)?.message;
  if (typeof m === "string" && m) return m;
  if (fallback !== undefined) return fallback;
  return typeof e === "string" || typeof e === "number" ? String(e) : JSON.stringify(e) ?? "";
}
