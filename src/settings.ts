import { App, PluginSettingTab, Setting } from "obsidian";
import type FleetingNotesPlugin from "./main";
import type { DisplayRange, FilePeriod } from "./types";
import { tr } from "./i18n";

export class FleetingSettingTab extends PluginSettingTab {
	plugin: FleetingNotesPlugin;

  constructor(app: App, plugin: FleetingNotesPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new Setting(containerEl).setName(tr("settings.heading")).setHeading();
    new Setting(containerEl).setName(tr("settings.folder.name")).setDesc(tr("settings.folder.desc")).addText(
      (text) => text.setPlaceholder(tr("settings.folder.placeholder")).setValue(this.plugin.settings.storageFolder).onChange(async (value) => {
        const sanitized = this.plugin.sanitizeFolder(value);
        if (sanitized !== value) {
          text.setValue(sanitized);
        }
        this.plugin.settings.storageFolder = sanitized;
        await this.plugin.saveSettings();
      })
    );
    new Setting(containerEl).setName(tr("settings.period.name")).setDesc(tr("settings.period.desc")).addDropdown(
      (dropdown) => dropdown.addOption("month", tr("settings.period.month")).addOption("week", tr("settings.period.week")).addOption("year", tr("settings.period.year")).setValue(this.plugin.settings.filePeriod).onChange(async (value) => {
        this.plugin.settings.filePeriod = value as FilePeriod;
        await this.plugin.saveSettings();
      })
    );
    new Setting(containerEl).setName(tr("settings.range.name")).setDesc(tr("settings.range.desc")).addDropdown(
      (dropdown) => dropdown.addOption("month", tr("settings.range.month")).addOption("week", tr("settings.range.week")).addOption("today", tr("settings.range.today")).setValue(this.plugin.settings.displayRange).onChange(async (value) => {
        this.plugin.settings.displayRange = value as DisplayRange;
        await this.plugin.saveSettings();
      })
    );
    new Setting(containerEl).setName(tr("settings.help.heading")).setHeading();
    const help = containerEl.createDiv({ cls: "fleeting-help" });
    help.createEl("p", { text: tr("settings.help.p1") });
    help.createEl("p", { text: tr("settings.help.p2") });
    new Setting(containerEl).setName(tr("settings.example.heading")).setHeading();
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
}
