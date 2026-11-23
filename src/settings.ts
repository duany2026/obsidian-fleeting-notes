import { App, PluginSettingTab, Setting } from "obsidian";
import type FleetingNotesPlugin from "./main";
import type { DisplayRange, FilePeriod } from "./types";

export class FleetingSettingTab extends PluginSettingTab {
	plugin: FleetingNotesPlugin;

  constructor(app: App, plugin: FleetingNotesPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "\u95EA\u5FF5\u7B14\u8BB0\u8BBE\u7F6E" });
    new Setting(containerEl).setName("\u5B58\u50A8\u76EE\u5F55").setDesc("\u95EA\u5FF5\u7B14\u8BB0\u6587\u4EF6\u6240\u5728\u7684\u6587\u4EF6\u5939\u8DEF\u5F84\u3002\u4F8B\u5982\uFF1A\u8BBE\u4E3A\u300C\u95EA\u5FF5\u7B14\u8BB0\u300D\uFF0C\u6587\u4EF6\u5C06\u4FDD\u5B58\u5728 \u95EA\u5FF5\u7B14\u8BB0/2026-06.md\u3002\u7559\u7A7A\u5219\u653E\u5728\u4ED3\u5E93\u6839\u76EE\u5F55\u3002\u4FEE\u6539\u76EE\u5F55\u4E0D\u4F1A\u81EA\u52A8\u8FC1\u79FB\u5DF2\u6709\u6587\u4EF6\u3002").addText(
      (text) => text.setPlaceholder("\u7559\u7A7A = \u4ED3\u5E93\u6839\u76EE\u5F55").setValue(this.plugin.settings.storageFolder).onChange(async (value) => {
        const sanitized = this.plugin.sanitizeFolder(value);
        if (sanitized !== value) {
          text.setValue(sanitized);
        }
        this.plugin.settings.storageFolder = sanitized;
        await this.plugin.saveSettings();
      })
    );
    new Setting(containerEl).setName("\u6587\u4EF6\u5F52\u6863\u5468\u671F").setDesc("新记录的归档方式。切换只影响新记录写入哪个文件，已有文件保持不变；「最近记录」仅读取按当前周期归档的文件。").addDropdown(
      (dropdown) => dropdown.addOption("month", "\u6309\u6708\uFF082026-06.md\uFF09").addOption("week", "\u6309\u5468\uFF082026-W23.md\uFF09").addOption("year", "\u6309\u5E74\uFF082026.md\uFF09").setValue(this.plugin.settings.filePeriod).onChange(async (value) => {
        this.plugin.settings.filePeriod = value as FilePeriod;
        await this.plugin.saveSettings();
      })
    );
    new Setting(containerEl).setName("\u4E3B\u9875\u663E\u793A\u8303\u56F4").setDesc("\u300C\u6700\u8FD1\u8BB0\u5F55\u300D\u533A\u57DF\u5C55\u793A\u7684\u65F6\u95F4\u8303\u56F4\u3002").addDropdown(
      (dropdown) => dropdown.addOption("month", "\u672C\u6708").addOption("week", "\u672C\u5468").addOption("today", "\u4ECA\u65E5").setValue(this.plugin.settings.displayRange).onChange(async (value) => {
        this.plugin.settings.displayRange = value as DisplayRange;
        await this.plugin.saveSettings();
      })
    );
    containerEl.createEl("h3", { text: "\u4F7F\u7528\u8BF4\u660E" });
    const help = containerEl.createDiv({ cls: "fleeting-help" });
    help.createEl("p", {
      text: "\u5728\u4E3B\u9875\u8F93\u5165\u6846\u4E2D\u5199\u5165\u5185\u5BB9\uFF0C\u70B9\u51FB\u300C\u8BB0\u5F55\u300D\u6216\u6309 Ctrl+Enter \u4FDD\u5B58\u3002\u8BB0\u5F55\u6309\u6708\uFF08/\u5468/\u5E74\uFF09\u5F52\u6863\u5230\u4E00\u4E2A Markdown \u6587\u4EF6\u4E2D\uFF0C\u6309\u65E5\u671F\u5206\u7EC4\u3001\u6309\u65F6\u95F4\u6392\u5E8F\u3002"
    });
    help.createEl("p", {
      text: "\u4F60\u53EF\u4EE5\u70B9\u51FB\u6BCF\u6761\u8BB0\u5F55\u53F3\u4FA7\u7684\u7BAD\u5934\u56FE\u6807\u5B9A\u4F4D\u5230\u539F\u6587\u4EF6\u5BF9\u5E94\u4F4D\u7F6E\uFF0C\u4E5F\u53EF\u4EE5\u76F4\u63A5\u6253\u5F00\u5F52\u6863\u6587\u4EF6\u624B\u5DE5\u7F16\u8F91\u3002\u6587\u4EF6\u91CD\u547D\u540D\u540E\u63D2\u4EF6\u4ECD\u80FD\u6B63\u786E\u8BC6\u522B\u3002"
    });
    containerEl.createEl("h4", { text: "\u6587\u4EF6\u683C\u5F0F\u793A\u4F8B" });
    const codeBlock = help.createEl("pre", { cls: "fleeting-code-block" });
    codeBlock.createEl("code", {
      text: `## 2026-06-01

- 13:40
	\u5185\u5BB9\u7B2C\u4E00\u884C
	\u7B2C\u4E8C\u884C
- 19:30
	\u665A\u4E0A\u7684\u8BB0\u5F55

## 2026-06-02

- 08:15
	\u65E9\u4E0A\u5199\u7684`
    });
  }
}
