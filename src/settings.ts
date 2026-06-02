import { App, PluginSettingTab, Setting } from "obsidian";
import type FleetingNotesPlugin from "./main";

export class FleetingSettingTab extends PluginSettingTab {
	plugin: FleetingNotesPlugin;

	constructor(app: App, plugin: FleetingNotesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", { text: "闪念笔记设置" });

		new Setting(containerEl)
			.setName("存储目录")
			.setDesc("闪念笔记文件所在的文件夹路径。留空则放在仓库根目录。")
			.addText((text) =>
				text
					.setPlaceholder("留空 = 仓库根目录")
					.setValue(this.plugin.settings.storageFolder)
					.onChange(async (value) => {
						this.plugin.settings.storageFolder = value.replace(/\/+$/, "");
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("文件名模板")
			.setDesc("月度文件名模板。{yyyy-MM} 会被替换为当月，如 2026-06。")
			.addText((text) =>
				text
					.setPlaceholder("{yyyy-MM}.md")
					.setValue(this.plugin.settings.fileTemplate)
					.onChange(async (value) => {
						if (!value.includes("{yyyy-MM}")) return;
						this.plugin.settings.fileTemplate = value;
						await this.plugin.saveSettings();
					})
			);

		containerEl.createEl("h3", { text: "关于" });
		const help = containerEl.createDiv({ cls: "fleeting-help" });
		help.createEl("p", {
			text: "闪念笔记会按月生成一个 Markdown 文件，按日期分组、按时间记录。你可以直接打开文件编辑，也可以点闪电图标在主页里快速输入。",
		});
		const codeBlock = help.createEl("pre", { cls: "fleeting-code-block" });
		codeBlock.createEl("code", {
			text: `## 2026-06-01\n\n- 13:40\n\t内容第一行\n\t第二行\n- 19:30\n\t晚上的记录\n\n## 2026-06-02\n\n- 08:15\n\t早上写的`,
		});
	}
}
