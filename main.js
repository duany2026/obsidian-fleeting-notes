var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => FleetingNotesPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian5 = require("obsidian");

// src/types.ts
var DEFAULT_SETTINGS = {
  storageFolder: "",
  filePeriod: "month",
  displayRange: "month",
  acceptedFallbackNames: []
};

// src/note-manager.ts
var import_obsidian2 = require("obsidian");

// src/i18n.ts
var import_obsidian = require("obsidian");
var zhCN = {
  "plugin.name": "\u95EA\u5FF5\u7B14\u8BB0",
  "cmd.openHomepage": "\u6253\u5F00\u95EA\u5FF5\u7B14\u8BB0\u4E3B\u9875",
  "cmd.openCurrent": "\u6253\u5F00\u5F53\u524D\u5F52\u6863\u6587\u4EF6",
  "notice.folderDotDot": "\u5B58\u50A8\u76EE\u5F55\u4E0D\u5141\u8BB8\u5305\u542B .. \u6BB5",
  "notice.saveSettingsFailed": "\u95EA\u5FF5\u7B14\u8BB0\uFF1A\u8BBE\u7F6E\u4FDD\u5B58\u5931\u8D25",
  "notice.openCurrentFailed": "\u6253\u5F00\u5F52\u6863\u6587\u4EF6\u5931\u8D25\uFF1A{msg}",
  "notice.writeTarget": "\u95EA\u5FF5\u7B14\u8BB0\uFF1A\u672C\u6B21\u53CA\u4E4B\u540E\u7684\u8BB0\u5F55\u5C06\u5199\u5165\u300C{name}\u300D",
  "notice.fileMissing": "\u5F52\u6863\u6587\u4EF6\u4E0D\u5B58\u5728\u6216\u5DF2\u88AB\u79FB\u52A8",
  "notice.locateFailed": "\u672A\u80FD\u5B9A\u4F4D\u5230\u8BE5\u6761\u8BB0\u5F55\uFF0C\u6587\u4EF6\u5185\u5BB9\u53EF\u80FD\u5DF2\u53D8\u5316",
  "notice.saveFailed": "\u4FDD\u5B58\u5931\u8D25\uFF1A{msg}",
  "notice.retry": "\u8BF7\u91CD\u8BD5",
  "error.openFile": "\u6253\u5F00\u6587\u4EF6\u5931\u8D25\uFF1A{path} \u2014 {msg}",
  "error.writeFile": "\u5199\u5165\u6587\u4EF6\u5931\u8D25\uFF1A{path} \u2014 {msg}",
  "view.placeholder": "\u8BB0\u4E0B\u6B64\u523B\u7684\u60F3\u6CD5\u2026",
  "view.submit": "\u8BB0\u5F55",
  "view.recent": "\u6700\u8FD1\u8BB0\u5F55",
  "view.headerDate": "{month}{day}\u65E5 {weekday}",
  "view.badge.today": "\u4ECA\u65E5 {n}",
  "view.badge.week": "\u672C\u5468 {n}",
  "view.badge.month": "\u672C\u6708 {n}",
  "view.today": "\u4ECA\u5929",
  "view.yesterday": "\u6628\u5929",
  "view.empty.title": "\u8FD8\u6CA1\u6709\u8BB0\u5F55",
  "view.empty.sub": "\u5199\u4E0B\u4F60\u7684\u7B2C\u4E00\u4E2A\u60F3\u6CD5\u5427",
  "view.emptyRange.title": "\u5F53\u524D\u8303\u56F4\u65E0\u8BB0\u5F55",
  "view.emptyRange.sub": "\u53EF\u5728\u8BBE\u7F6E\u4E2D\u8C03\u6574\u663E\u793A\u8303\u56F4",
  "view.goto": "\u5B9A\u4F4D\u5230\u539F\u6587\u4EF6",
  "view.loadFailed": "\u52A0\u8F7D\u5931\u8D25",
  "view.reopen": "\u8BF7\u91CD\u65B0\u6253\u5F00\u4E3B\u9875",
  "weekday.0": "\u5468\u65E5",
  "weekday.1": "\u5468\u4E00",
  "weekday.2": "\u5468\u4E8C",
  "weekday.3": "\u5468\u4E09",
  "weekday.4": "\u5468\u56DB",
  "weekday.5": "\u5468\u4E94",
  "weekday.6": "\u5468\u516D",
  "month.1": "1\u6708",
  "month.2": "2\u6708",
  "month.3": "3\u6708",
  "month.4": "4\u6708",
  "month.5": "5\u6708",
  "month.6": "6\u6708",
  "month.7": "7\u6708",
  "month.8": "8\u6708",
  "month.9": "9\u6708",
  "month.10": "10\u6708",
  "month.11": "11\u6708",
  "month.12": "12\u6708",
  "settings.heading": "\u95EA\u5FF5\u7B14\u8BB0\u8BBE\u7F6E",
  "settings.folder.name": "\u5B58\u50A8\u76EE\u5F55",
  "settings.folder.desc": "\u95EA\u5FF5\u7B14\u8BB0\u6587\u4EF6\u6240\u5728\u7684\u6587\u4EF6\u5939\u8DEF\u5F84\u3002\u4F8B\u5982\uFF1A\u8BBE\u4E3A\u300C\u95EA\u5FF5\u7B14\u8BB0\u300D\uFF0C\u6587\u4EF6\u5C06\u4FDD\u5B58\u5728 \u95EA\u5FF5\u7B14\u8BB0/2026-06.md\u3002\u7559\u7A7A\u5219\u653E\u5728\u4ED3\u5E93\u6839\u76EE\u5F55\u3002\u4FEE\u6539\u76EE\u5F55\u4E0D\u4F1A\u81EA\u52A8\u8FC1\u79FB\u5DF2\u6709\u6587\u4EF6\u3002",
  "settings.folder.placeholder": "\u7559\u7A7A = \u4ED3\u5E93\u6839\u76EE\u5F55",
  "settings.period.name": "\u6587\u4EF6\u5F52\u6863\u5468\u671F",
  "settings.period.desc": "\u65B0\u8BB0\u5F55\u7684\u5F52\u6863\u65B9\u5F0F\u3002\u5207\u6362\u53EA\u5F71\u54CD\u65B0\u8BB0\u5F55\u5199\u5165\u54EA\u4E2A\u6587\u4EF6\uFF0C\u5DF2\u6709\u6587\u4EF6\u4FDD\u6301\u4E0D\u53D8\uFF1B\u300C\u6700\u8FD1\u8BB0\u5F55\u300D\u4EC5\u8BFB\u53D6\u6309\u5F53\u524D\u5468\u671F\u5F52\u6863\u7684\u6587\u4EF6\u3002",
  "settings.period.month": "\u6309\u6708\uFF082026-06.md\uFF09",
  "settings.period.week": "\u6309\u5468\uFF082026-W23.md\uFF09",
  "settings.period.year": "\u6309\u5E74\uFF082026.md\uFF09",
  "settings.range.name": "\u4E3B\u9875\u663E\u793A\u8303\u56F4",
  "settings.range.desc": "\u300C\u6700\u8FD1\u8BB0\u5F55\u300D\u533A\u57DF\u5C55\u793A\u7684\u65F6\u95F4\u8303\u56F4\u3002",
  "settings.range.month": "\u672C\u6708",
  "settings.range.week": "\u672C\u5468",
  "settings.range.today": "\u4ECA\u65E5",
  "settings.help.heading": "\u4F7F\u7528\u8BF4\u660E",
  "settings.help.p1": "\u5728\u4E3B\u9875\u8F93\u5165\u6846\u4E2D\u5199\u5165\u5185\u5BB9\uFF0C\u70B9\u51FB\u300C\u8BB0\u5F55\u300D\u6216\u6309 Ctrl+Enter \u4FDD\u5B58\u3002\u8BB0\u5F55\u6309\u6708\uFF08/\u5468/\u5E74\uFF09\u5F52\u6863\u5230\u4E00\u4E2A Markdown \u6587\u4EF6\u4E2D\uFF0C\u6309\u65E5\u671F\u5206\u7EC4\u3001\u6309\u65F6\u95F4\u6392\u5E8F\u3002",
  "settings.help.p2": "\u4F60\u53EF\u4EE5\u70B9\u51FB\u6BCF\u6761\u8BB0\u5F55\u53F3\u4FA7\u7684\u7BAD\u5934\u56FE\u6807\u5B9A\u4F4D\u5230\u539F\u6587\u4EF6\u5BF9\u5E94\u4F4D\u7F6E\uFF0C\u4E5F\u53EF\u4EE5\u76F4\u63A5\u6253\u5F00\u5F52\u6863\u6587\u4EF6\u624B\u5DE5\u7F16\u8F91\u3002\u6587\u4EF6\u91CD\u547D\u540D\u540E\u63D2\u4EF6\u4ECD\u80FD\u6B63\u786E\u8BC6\u522B\u3002",
  "settings.example.heading": "\u6587\u4EF6\u683C\u5F0F\u793A\u4F8B",
  "settings.example.line1": "\u5185\u5BB9\u7B2C\u4E00\u884C",
  "settings.example.line2": "\u7B2C\u4E8C\u884C",
  "settings.example.evening": "\u665A\u4E0A\u7684\u8BB0\u5F55",
  "settings.example.morning": "\u65E9\u4E0A\u5199\u7684"
};
var zhTW = {
  "plugin.name": "\u9583\u5FF5\u7B46\u8A18",
  "cmd.openHomepage": "\u958B\u555F\u9583\u5FF5\u7B46\u8A18\u4E3B\u9801",
  "cmd.openCurrent": "\u958B\u555F\u76EE\u524D\u7684\u6B78\u6A94\u6A94\u6848",
  "notice.folderDotDot": "\u5132\u5B58\u76EE\u9304\u4E0D\u5141\u8A31\u5305\u542B .. \u6BB5",
  "notice.saveSettingsFailed": "\u9583\u5FF5\u7B46\u8A18\uFF1A\u8A2D\u5B9A\u5132\u5B58\u5931\u6557",
  "notice.openCurrentFailed": "\u958B\u555F\u6B78\u6A94\u6A94\u6848\u5931\u6557\uFF1A{msg}",
  "notice.writeTarget": "\u9583\u5FF5\u7B46\u8A18\uFF1A\u672C\u6B21\u53CA\u4E4B\u5F8C\u7684\u8A18\u9304\u5C07\u5BEB\u5165\u300C{name}\u300D",
  "notice.fileMissing": "\u6B78\u6A94\u6A94\u6848\u4E0D\u5B58\u5728\u6216\u5DF2\u88AB\u79FB\u52D5",
  "notice.locateFailed": "\u672A\u80FD\u5B9A\u4F4D\u5230\u8A72\u7B46\u8A18\u9304\uFF0C\u6A94\u6848\u5167\u5BB9\u53EF\u80FD\u5DF2\u8B8A\u66F4",
  "notice.saveFailed": "\u5132\u5B58\u5931\u6557\uFF1A{msg}",
  "notice.retry": "\u8ACB\u91CD\u8A66",
  "error.openFile": "\u958B\u555F\u6A94\u6848\u5931\u6557\uFF1A{path} \u2014 {msg}",
  "error.writeFile": "\u5BEB\u5165\u6A94\u6848\u5931\u6557\uFF1A{path} \u2014 {msg}",
  "view.placeholder": "\u8A18\u4E0B\u6B64\u523B\u7684\u60F3\u6CD5\u2026",
  "view.submit": "\u8A18\u9304",
  "view.recent": "\u6700\u8FD1\u8A18\u9304",
  "view.headerDate": "{month}{day}\u65E5 {weekday}",
  "view.badge.today": "\u4ECA\u65E5 {n}",
  "view.badge.week": "\u672C\u9031 {n}",
  "view.badge.month": "\u672C\u6708 {n}",
  "view.today": "\u4ECA\u5929",
  "view.yesterday": "\u6628\u5929",
  "view.empty.title": "\u9084\u6C92\u6709\u8A18\u9304",
  "view.empty.sub": "\u5BEB\u4E0B\u4F60\u7684\u7B2C\u4E00\u500B\u60F3\u6CD5\u5427",
  "view.emptyRange.title": "\u76EE\u524D\u7BC4\u570D\u6C92\u6709\u8A18\u9304",
  "view.emptyRange.sub": "\u53EF\u5728\u8A2D\u5B9A\u4E2D\u8ABF\u6574\u986F\u793A\u7BC4\u570D",
  "view.goto": "\u5B9A\u4F4D\u5230\u539F\u59CB\u6A94\u6848",
  "view.loadFailed": "\u8F09\u5165\u5931\u6557",
  "view.reopen": "\u8ACB\u91CD\u65B0\u958B\u555F\u4E3B\u9801",
  "weekday.0": "\u9031\u65E5",
  "weekday.1": "\u9031\u4E00",
  "weekday.2": "\u9031\u4E8C",
  "weekday.3": "\u9031\u4E09",
  "weekday.4": "\u9031\u56DB",
  "weekday.5": "\u9031\u4E94",
  "weekday.6": "\u9031\u516D",
  "month.1": "1\u6708",
  "month.2": "2\u6708",
  "month.3": "3\u6708",
  "month.4": "4\u6708",
  "month.5": "5\u6708",
  "month.6": "6\u6708",
  "month.7": "7\u6708",
  "month.8": "8\u6708",
  "month.9": "9\u6708",
  "month.10": "10\u6708",
  "month.11": "11\u6708",
  "month.12": "12\u6708",
  "settings.heading": "\u9583\u5FF5\u7B46\u8A18\u8A2D\u5B9A",
  "settings.folder.name": "\u5132\u5B58\u76EE\u9304",
  "settings.folder.desc": "\u9583\u5FF5\u7B46\u8A18\u6A94\u6848\u6240\u5728\u7684\u8CC7\u6599\u593E\u8DEF\u5F91\u3002\u4F8B\u5982\uFF1A\u8A2D\u70BA\u300C\u9583\u5FF5\u7B46\u8A18\u300D\uFF0C\u6A94\u6848\u5C07\u5132\u5B58\u5728 \u9583\u5FF5\u7B46\u8A18/2026-06.md\u3002\u7559\u7A7A\u5247\u653E\u5728\u5132\u5B58\u5EAB\u6839\u76EE\u9304\u3002\u4FEE\u6539\u76EE\u9304\u4E0D\u6703\u81EA\u52D5\u642C\u79FB\u5DF2\u6709\u6A94\u6848\u3002",
  "settings.folder.placeholder": "\u7559\u7A7A = \u5132\u5B58\u5EAB\u6839\u76EE\u9304",
  "settings.period.name": "\u6A94\u6848\u6B78\u6A94\u9031\u671F",
  "settings.period.desc": "\u65B0\u8A18\u9304\u7684\u6B78\u6A94\u65B9\u5F0F\u3002\u5207\u63DB\u53EA\u5F71\u97FF\u65B0\u8A18\u9304\u5BEB\u5165\u54EA\u500B\u6A94\u6848\uFF0C\u5DF2\u6709\u6A94\u6848\u4FDD\u6301\u4E0D\u8B8A\uFF1B\u300C\u6700\u8FD1\u8A18\u9304\u300D\u50C5\u8B80\u53D6\u6309\u76EE\u524D\u9031\u671F\u6B78\u6A94\u7684\u6A94\u6848\u3002",
  "settings.period.month": "\u6309\u6708\uFF082026-06.md\uFF09",
  "settings.period.week": "\u6309\u9031\uFF082026-W23.md\uFF09",
  "settings.period.year": "\u6309\u5E74\uFF082026.md\uFF09",
  "settings.range.name": "\u4E3B\u9801\u986F\u793A\u7BC4\u570D",
  "settings.range.desc": "\u300C\u6700\u8FD1\u8A18\u9304\u300D\u5340\u57DF\u986F\u793A\u7684\u6642\u9593\u7BC4\u570D\u3002",
  "settings.range.month": "\u672C\u6708",
  "settings.range.week": "\u672C\u9031",
  "settings.range.today": "\u4ECA\u65E5",
  "settings.help.heading": "\u4F7F\u7528\u8AAA\u660E",
  "settings.help.p1": "\u5728\u4E3B\u9801\u8F38\u5165\u6846\u4E2D\u5BEB\u5165\u5167\u5BB9\uFF0C\u9EDE\u64CA\u300C\u8A18\u9304\u300D\u6216\u6309 Ctrl+Enter \u5132\u5B58\u3002\u8A18\u9304\u6309\u6708\uFF08/\u9031/\u5E74\uFF09\u6B78\u6A94\u5230\u4E00\u500B Markdown \u6A94\u6848\u4E2D\uFF0C\u6309\u65E5\u671F\u5206\u7D44\u3001\u6309\u6642\u9593\u6392\u5E8F\u3002",
  "settings.help.p2": "\u4F60\u53EF\u4EE5\u9EDE\u64CA\u6BCF\u7B46\u8A18\u9304\u53F3\u5074\u7684\u7BAD\u982D\u5716\u793A\u5B9A\u4F4D\u5230\u539F\u59CB\u6A94\u6848\u5C0D\u61C9\u4F4D\u7F6E\uFF0C\u4E5F\u53EF\u4EE5\u76F4\u63A5\u958B\u555F\u6B78\u6A94\u6A94\u6848\u624B\u52D5\u7DE8\u8F2F\u3002\u6A94\u6848\u91CD\u65B0\u547D\u540D\u5F8C\u5916\u639B\u4ECD\u80FD\u6B63\u78BA\u8B58\u5225\u3002",
  "settings.example.heading": "\u6A94\u6848\u683C\u5F0F\u7BC4\u4F8B",
  "settings.example.line1": "\u5167\u5BB9\u7B2C\u4E00\u884C",
  "settings.example.line2": "\u7B2C\u4E8C\u884C",
  "settings.example.evening": "\u665A\u4E0A\u7684\u8A18\u9304",
  "settings.example.morning": "\u65E9\u4E0A\u5BEB\u7684"
};
var en = {
  "plugin.name": "Fleeting notes",
  "cmd.openHomepage": "Open fleeting notes",
  "cmd.openCurrent": "Open current archive file",
  "notice.folderDotDot": 'The storage folder cannot contain ".." segments',
  "notice.saveSettingsFailed": "Fleeting notes: failed to save settings",
  "notice.openCurrentFailed": "Failed to open the archive file: {msg}",
  "notice.writeTarget": 'Fleeting notes: this and future entries go to "{name}"',
  "notice.fileMissing": "The archive file doesn't exist or was moved",
  "notice.locateFailed": "Couldn't find this entry \u2014 the file may have changed",
  "notice.saveFailed": "Failed to save: {msg}",
  "notice.retry": "try again",
  "error.openFile": "Failed to open file: {path} \u2014 {msg}",
  "error.writeFile": "Failed to write file: {path} \u2014 {msg}",
  "view.placeholder": "Capture the thought on your mind\u2026",
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
  "settings.folder.desc": 'Folder that holds the archive files. For example, set it to "Fleeting" and entries are saved in Fleeting/2026-06.md. Leave empty to use the vault root. Changing the folder does not move existing files.',
  "settings.folder.placeholder": "Empty = vault root",
  "settings.period.name": "Archive period",
  "settings.period.desc": 'How new entries are archived. Switching only changes which file new entries go to; existing files stay as they are. "Recent entries" only reads files of the current period.',
  "settings.period.month": "Monthly (2026-06.md)",
  "settings.period.week": "Weekly (2026-W23.md)",
  "settings.period.year": "Yearly (2026.md)",
  "settings.range.name": "Home display range",
  "settings.range.desc": 'Time range shown in "Recent entries".',
  "settings.range.month": "This month",
  "settings.range.week": "This week",
  "settings.range.today": "Today",
  "settings.help.heading": "How to use",
  "settings.help.p1": 'Type in the input box on the home view, then click "Save" or press Ctrl+Enter. Entries are archived into one Markdown file per month (or week / year), grouped by date and sorted by time.',
  "settings.help.p2": "Click the arrow on an entry to jump to it in the archive file, or open the file and edit by hand. Renamed archive files are still recognized.",
  "settings.example.heading": "File format example",
  "settings.example.line1": "First line of the entry",
  "settings.example.line2": "Second line",
  "settings.example.evening": "An evening note",
  "settings.example.morning": "Written in the morning"
};
var I18N = { "zh-CN": zhCN, "zh-TW": zhTW, en };
var I18N_LANG = "zh-CN";
function resolveLanguage(code) {
  if (!code || typeof code !== "string") return "en";
  const lower = code.toLowerCase();
  if (lower.startsWith("zh")) {
    return /hant|tw|hk|mo/.test(lower) ? "zh-TW" : "zh-CN";
  }
  return "en";
}
function initLanguage() {
  let code;
  try {
    code = typeof import_obsidian.getLanguage === "function" ? (0, import_obsidian.getLanguage)() : import_obsidian.moment.locale();
  } catch (e) {
    code = void 0;
  }
  I18N_LANG = resolveLanguage(code);
  return I18N_LANG;
}
function tr(key, vars) {
  var _a, _b, _c;
  const s = (_c = (_b = (_a = I18N[I18N_LANG]) == null ? void 0 : _a[key]) != null ? _b : I18N["zh-CN"][key]) != null ? _c : key;
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (m0, name) => vars[name] === void 0 || vars[name] === null ? m0 : String(vars[name]));
}
function errorText(e, fallback) {
  var _a;
  const m = e == null ? void 0 : e.message;
  if (typeof m === "string" && m) return m;
  if (fallback !== void 0) return fallback;
  return typeof e === "string" || typeof e === "number" ? String(e) : (_a = JSON.stringify(e)) != null ? _a : "";
}

// src/note-manager.ts
function buildDayHeaderRegex(dateStr) {
  const parts = dateStr.split("-");
  const variants = [dateStr, `${parts[0]}-${Number(parts[1])}-${Number(parts[2])}`];
  const uniq = [...new Set(variants)];
  return new RegExp(`^## (?:${uniq.join("|")})(?=\\s|$).*$`, "m");
}
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
      if (!mask[j] && /^#{1,2} /.test(lines[j])) {
        insertIdx = j;
        break;
      }
    }
    if (openMarker) {
      let k = lines.length - 1;
      while (k > headerIdx && mask[k]) k--;
      const fenceStart = k + 1;
      if (fenceStart > headerIdx && fenceStart < insertIdx) insertIdx = fenceStart;
    }
    const before = lines.slice(0, insertIdx).join("\n").trimEnd();
    const rest = lines.slice(insertIdx).join("\n");
    return before + eol + entryEol + eol + rest;
  }
  const prefix = existing.trimEnd();
  const closer = openMarker ? eol + openMarker : "";
  return (prefix ? prefix + closer + eol + eol : "") + `## ${todayStr}` + eol + eol + entryEol + eol;
}
var NoteManager = class {
  constructor(app, settings, persistSettings) {
    this.app = app;
    this.settings = settings;
    this._acceptedFallbackNames = new Set(Array.isArray(settings.acceptedFallbackNames) ? settings.acceptedFallbackNames : []);
    this.persistSettings = persistSettings || null;
    this.currentFilePathCache = null;
    this.currentFilePathCacheKey = null;
    this.writeQueue = Promise.resolve();
  }
  /* ---------- 写入队列（串行化所有写操作，防止并发覆盖） ---------- */
  enqueueWrite(task) {
    const run = this.writeQueue.then(task, task);
    this.writeQueue = run.catch(() => {
    });
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
    const dayDiff = Math.round((date.getTime() - jan1.getTime()) / 864e5);
    const weekNum = Math.ceil((dayDiff + 1) / 7);
    return `${year}-W${String(weekNum).padStart(2, "0")}`;
  }
  getYearStr(d) {
    return `${d.getFullYear()}`;
  }
  getTodayStr() {
    const now = /* @__PURE__ */ new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }
  getTimeStr() {
    const now = /* @__PURE__ */ new Date();
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
    const now = /* @__PURE__ */ new Date();
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
    const defaultPath = folder ? (0, import_obsidian2.normalizePath)(`${folder}/${defaultFileName}`) : (0, import_obsidian2.normalizePath)(defaultFileName);
    let result = null;
    const directHit = this.app.vault.getAbstractFileByPath(defaultPath);
    if (directHit instanceof import_obsidian2.TFile) {
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
        if (/\s\d+\.md$/i.test(f.name)) continue;
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
    if (this.app.vault.getAbstractFileByPath(dirPath) instanceof import_obsidian2.TFolder)
      return;
    const parent = dirPath.substring(0, dirPath.lastIndexOf("/"));
    if (parent)
      await this.ensureDirectoryExists(parent);
    if (!this.app.vault.getAbstractFileByPath(dirPath)) {
      try {
        await this.app.vault.createFolder(dirPath);
      } catch (e) {
        if (!(this.app.vault.getAbstractFileByPath(dirPath) instanceof import_obsidian2.TFolder)) {
          throw e;
        }
      }
    }
  }
  /* 返回 { file, created }：created 标记文件是否由本次调用创建，供失败回滚判断（只删自己建的） */
  async ensureFileExists(filePath, initialContent) {
    const existing = this.app.vault.getAbstractFileByPath(filePath);
    if (existing instanceof import_obsidian2.TFile)
      return { file: existing, created: false };
    const dir = filePath.substring(0, filePath.lastIndexOf("/"));
    await this.ensureDirectoryExists(dir);
    try {
      const file = await this.app.vault.create(filePath, initialContent);
      return { file, created: true };
    } catch (e) {
      const retry = this.app.vault.getAbstractFileByPath(filePath);
      if (retry instanceof import_obsidian2.TFile) return { file: retry, created: false };
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
      throw new Error(tr("error.openFile", { path: String(filePath), msg: errorText(e) }));
    }
    const todayStr = this.getTodayStr();
    const timeStr = this.getTimeStr();
    const indented = content.split("\n").map((l) => "	" + l).join("\n");
    const entry = `- ${timeStr}
${indented}`;
    try {
      this.lastWritePath = file.path;
      await this.app.vault.process(file, (existing) => applyFleetingAppend(existing, todayStr, entry));
    } catch (e) {
      this.lastWritePath = null;
      if (createdByUs) {
        try {
          await this.app.vault.delete(file);
        } catch (deleteErr) {
          console.error("FleetingNotes cleanup created file failed:", deleteErr);
        }
      }
      throw new Error(tr("error.writeFile", { path: String(file.path), msg: errorText(e) }));
    }
    const defaultName = `${this.getCurrentPeriodId()}.md`;
    if (file.name !== defaultName && !this._acceptedFallbackNames.has(file.name)) {
      this._acceptedFallbackNames.add(file.name);
      this.settings.acceptedFallbackNames = [...this._acceptedFallbackNames];
      if (this.persistSettings) this.persistSettings();
      new import_obsidian2.Notice(tr("notice.writeTarget", { name: String(file.name) }));
    }
  }
  /* ---------- 获取最近记录 ---------- */
  async getRecentEntries() {
    const files = await this.collectRecentFiles();
    const entries = [];
    for (const file of files) {
      await this.parseEntriesFromFile(file, entries);
    }
    entries.sort((a, b) => {
      const c = b.date.localeCompare(a.date);
      return c !== 0 ? c : b.time.localeCompare(a.time);
    });
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
    const now = /* @__PURE__ */ new Date();
    const periods = this.getRecentPeriodIds(now, this.settings.filePeriod);
    const keep = [];
    const seen = /* @__PURE__ */ new Set();
    const tryAdd = (file) => {
      if (file instanceof import_obsidian2.TFile && !seen.has(file.path)) {
        keep.push(file);
        seen.add(file.path);
      }
    };
    for (const id of periods) {
      const fileName = `${id}.md`;
      const path = folder ? (0, import_obsidian2.normalizePath)(`${folder}/${fileName}`) : (0, import_obsidian2.normalizePath)(fileName);
      tryAdd(this.app.vault.getAbstractFileByPath(path));
    }
    if (keep.length < periods.length) {
      const allFiles = folder ? this.app.vault.getFiles().filter((f) => f.path.startsWith(folder + "/")) : this.app.vault.getFiles();
      for (const f of allFiles) {
        if (seen.has(f.path)) continue;
        const captured = this.matchArchiveName(f.name);
        if (!captured || !periods.includes(captured)) continue;
        if (f.name !== `${captured}.md` && !await this.looksLikeArchive(f)) continue;
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
  async parseEntriesFromFile(file, entries) {
    if (!(file instanceof import_obsidian2.TFile)) return;
    const content = await this.app.vault.cachedRead(file);
    const lines = content.split("\n");
    const { mask } = fenceMask(lines);
    let currentDate = "";
    const localSeen = /* @__PURE__ */ new Map();
    for (let i = 0; i < lines.length; i++) {
      if (mask[i]) continue;
      const dateMatch = lines[i].match(/^## (\d{4})-(\d{1,2})-(\d{1,2})(?=\s|$)/);
      if (dateMatch) {
        currentDate = `${dateMatch[1]}-${dateMatch[2].padStart(2, "0")}-${dateMatch[3].padStart(2, "0")}`;
        continue;
      }
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
};

// src/homepage-view.ts
var import_obsidian3 = require("obsidian");
var VIEW_TYPE_HOMEPAGE = "fleeting-notes-homepage";
var HomepageView = class extends import_obsidian3.ItemView {
  constructor(leaf, noteManager, settings) {
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
    return tr("plugin.name");
  }
  getIcon() {
    return "zap";
  }
  async onOpen() {
    await this.buildSkeleton();
    this.setupResizeObserver();
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
      attr: { placeholder: tr("view.placeholder"), rows: "3" }
    });
    const submitBtn = inputArea.createEl("button", { cls: "fn-submit-btn" });
    submitBtn.createSpan({ text: tr("view.submit") });
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
    listHeader.createSpan({ cls: "fn-list-label", text: tr("view.recent") });
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
      const now = /* @__PURE__ */ new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      if (this.headerDate) {
        this.headerDate.setText(tr("view.headerDate", {
          month: tr(`month.${now.getMonth() + 1}`),
          day: now.getDate(),
          weekday: tr(`weekday.${now.getDay()}`)
        }));
      }
      const todayCount = entries.filter((e) => e.date === todayStr).length;
      if (this.todayBadge)
        this.todayBadge.setText(tr("view.badge.today", { n: todayCount }));
      const weekStart = new Date(now);
      const daysFromMonday = now.getDay() === 0 ? 6 : now.getDay() - 1;
      weekStart.setDate(now.getDate() - daysFromMonday);
      const weekStartStr = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;
      const weekCount = entries.filter((e) => e.date >= weekStartStr).length;
      if (this.weekBadge)
        this.weekBadge.setText(tr("view.badge.week", { n: weekCount }));
      const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const monthCount = entries.filter((e) => e.date.startsWith(monthStr)).length;
      if (this.monthBadge)
        this.monthBadge.setText(tr("view.badge.month", { n: monthCount }));
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
        (0, import_obsidian3.setIcon)(emptyIcon, "sparkles");
        if (entries.length === 0) {
          empty.createDiv({ cls: "fn-empty-text", text: tr("view.empty.title") });
          empty.createDiv({ cls: "fn-empty-sub", text: tr("view.empty.sub") });
        } else {
          empty.createDiv({ cls: "fn-empty-text", text: tr("view.emptyRange.title") });
          empty.createDiv({ cls: "fn-empty-sub", text: tr("view.emptyRange.sub") });
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
              sepLabel.createSpan({ cls: "fn-sep-today", text: tr("view.today") });
              sepLabel.createSpan({ cls: "fn-sep-date", text: entry.date });
              sepDot.addClass("fn-sep-dot-today");
            } else if (entry.date === yesterdayStr) {
              sepLabel.createSpan({ cls: "fn-sep-today", text: tr("view.yesterday") });
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
          (0, import_obsidian3.setIcon)(goBtn, "external-link");
          goBtn.setAttribute("aria-label", tr("view.goto"));
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
        errDiv.createDiv({ cls: "fn-empty-text", text: tr("view.loadFailed") });
        errDiv.createDiv({ cls: "fn-empty-sub", text: errorText(e, tr("view.reopen")) });
      }
    } finally {
      this.rendering = false;
      if (this.pendingRefresh) {
        this.pendingRefresh = false;
        this.refresh();
      }
    }
  }
  async navigateToEntry(filePath, line, entry) {
    const file = this.app.vault.getAbstractFileByPath(filePath);
    if (!(file instanceof import_obsidian3.TFile)) {
      new import_obsidian3.Notice(tr("notice.fileMissing"));
      return;
    }
    const resolved = await this.resolveEntryLine(file, line, entry);
    if (resolved < 0) {
      new import_obsidian3.Notice(tr("notice.locateFailed"));
    }
    const activeView = this.app.workspace.getActiveViewOfType(import_obsidian3.MarkdownView);
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
      tryFocus(this.app.workspace.getActiveViewOfType(import_obsidian3.MarkdownView));
    });
    this.registerEvent(ref);
    const timeout = setTimeout(cleanup, 5e3);
    this._openFileTimer = timeout;
    try {
      await leaf.openFile(file);
    } catch (e) {
      cleanup();
      throw e;
    }
    tryFocus(this.app.workspace.getActiveViewOfType(import_obsidian3.MarkdownView));
  }
  /* entry.line 是解析时的快照，文件被编辑过会漂移；先校验快照行（形状 + 时间戳都要对上），失效则按 日期+时间 在文件内重搜 */
  async resolveEntryLine(file, line, entry) {
    const content = await this.app.vault.cachedRead(file);
    const lines = content.split("\n");
    const snapshotOk = entry ? line >= 0 && line < lines.length && new RegExp(`^- ${entry.time}(?:\\s|$)`).test(lines[line]) : line >= 0 && line < lines.length && /^- \d{2}:\d{2}/.test(lines[line]);
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
  async handleSubmit(textArea) {
    if (this.submitLocked) return;
    const text = textArea.value.trim();
    if (!text) {
      textArea.addClass("fn-input-error");
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
      textArea.value = textArea.value ? `${text}
${textArea.value}` : text;
      if (this._autoResize) this._autoResize();
      new import_obsidian3.Notice(tr("notice.saveFailed", { msg: errorText(e, tr("notice.retry")) }));
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
};

// src/settings.ts
var import_obsidian4 = require("obsidian");
var FleetingSettingTab = class extends import_obsidian4.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian4.Setting(containerEl).setName(tr("settings.heading")).setHeading();
    new import_obsidian4.Setting(containerEl).setName(tr("settings.folder.name")).setDesc(tr("settings.folder.desc")).addText(
      (text) => text.setPlaceholder(tr("settings.folder.placeholder")).setValue(this.plugin.settings.storageFolder).onChange(async (value) => {
        const sanitized = this.plugin.sanitizeFolder(value);
        if (sanitized !== value) {
          text.setValue(sanitized);
        }
        this.plugin.settings.storageFolder = sanitized;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(tr("settings.period.name")).setDesc(tr("settings.period.desc")).addDropdown(
      (dropdown) => dropdown.addOption("month", tr("settings.period.month")).addOption("week", tr("settings.period.week")).addOption("year", tr("settings.period.year")).setValue(this.plugin.settings.filePeriod).onChange(async (value) => {
        this.plugin.settings.filePeriod = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(tr("settings.range.name")).setDesc(tr("settings.range.desc")).addDropdown(
      (dropdown) => dropdown.addOption("month", tr("settings.range.month")).addOption("week", tr("settings.range.week")).addOption("today", tr("settings.range.today")).setValue(this.plugin.settings.displayRange).onChange(async (value) => {
        this.plugin.settings.displayRange = value;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian4.Setting(containerEl).setName(tr("settings.help.heading")).setHeading();
    const help = containerEl.createDiv({ cls: "fleeting-help" });
    help.createEl("p", { text: tr("settings.help.p1") });
    help.createEl("p", { text: tr("settings.help.p2") });
    new import_obsidian4.Setting(containerEl).setName(tr("settings.example.heading")).setHeading();
    const codeBlock = help.createEl("pre", { cls: "fleeting-code-block" });
    codeBlock.createEl("code", {
      text: `## 2026-06-01

- 13:40
	${tr("settings.example.line1")}
	${tr("settings.example.line2")}
- 19:30
	${tr("settings.example.evening")}

## 2026-06-02

- 08:15
	${tr("settings.example.morning")}`
    });
  }
};

// src/main.ts
var FleetingNotesPlugin = class extends import_obsidian5.Plugin {
  constructor() {
    super(...arguments);
    this.settings = DEFAULT_SETTINGS;
  }
  async onload() {
    initLanguage();
    await this.loadSettings();
    this.noteManager = new NoteManager(this.app, this.settings, () => {
      void this.saveSettings();
    });
    this.registerView(
      VIEW_TYPE_HOMEPAGE,
      (leaf) => new HomepageView(leaf, this.noteManager, this.settings)
    );
    this.addRibbonIcon("zap", tr("plugin.name"), () => this.activateHomepage());
    this.addCommand({
      id: "fleeting-notes-open-homepage",
      name: tr("cmd.openHomepage"),
      callback: () => this.activateHomepage()
    });
    this.addCommand({
      id: "fleeting-notes-open-current",
      name: tr("cmd.openCurrent"),
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
        if (file instanceof import_obsidian5.TFile && this.noteManager.lastWritePath === file.path) {
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
    this._lastDateStr = this.noteManager.getTodayStr();
    this.registerInterval(window.setInterval(() => {
      const today = this.noteManager.getTodayStr();
      if (today !== this._lastDateStr) {
        this._lastDateStr = today;
        this.noteManager.invalidateFilePathCache();
        this.scheduleRefresh(0);
      }
    }, 60 * 1e3));
    this.addSettingTab(new FleetingSettingTab(this.app, this));
  }
  scheduleRefresh(delay) {
    if (this._refreshTimer) {
      clearTimeout(this._refreshTimer);
    }
    this._refreshTimer = setTimeout(() => {
      this._refreshTimer = null;
      for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE_HOMEPAGE)) {
        if (leaf.view instanceof HomepageView) {
          leaf.view.refresh();
        }
      }
    }, delay);
  }
  /* 判断变更文件是否与当前周期/显示范围相关：无关文件（如按月归档时的日记 2026-08-30.md）不再触发重扫与重渲染 */
  isRelevantArchiveFile(file, invalidateCache = false) {
    if (!(file instanceof import_obsidian5.TFile)) return false;
    const folder = this.settings.storageFolder;
    if (folder && !file.path.startsWith(folder + "/")) return false;
    const capturedId = this.noteManager.matchArchiveName(file.name);
    if (!capturedId) return false;
    if (invalidateCache) {
      this.noteManager.invalidateFilePathCache();
    }
    const relevant = new Set(this.noteManager.getRecentPeriodIds(/* @__PURE__ */ new Date(), this.settings.filePeriod));
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
    if (this._refreshTimer) {
      clearTimeout(this._refreshTimer);
      this._refreshTimer = null;
    }
    if (this._saveTimer) {
      clearTimeout(this._saveTimer);
      this._saveTimer = null;
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
      new import_obsidian5.Notice(tr("notice.folderDotDot"));
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
          new import_obsidian5.Notice(tr("notice.saveSettingsFailed"));
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
      new import_obsidian5.Notice(tr("notice.openCurrentFailed", { msg: errorText(e) }));
    }
  }
};
