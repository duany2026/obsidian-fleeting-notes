import { Notice, Plugin, TFile, WorkspaceLeaf } from "obsidian";
import { FleetingNotesSettings, DEFAULT_SETTINGS } from "./types";
import { NoteManager } from "./note-manager";
import { HomepageView, VIEW_TYPE_HOMEPAGE } from "./homepage-view";
import { FleetingSettingTab } from "./settings";

export default class FleetingNotesPlugin extends Plugin {
	settings: FleetingNotesSettings = DEFAULT_SETTINGS;
	noteManager!: NoteManager;

	async onload(): Promise<void> {
		await this.loadSettings();
		this.noteManager = new NoteManager(this.app, this.settings);

		this.registerView(VIEW_TYPE_HOMEPAGE, (leaf) =>
			new HomepageView(leaf, this.noteManager, () => this.activateHomepage())
		);

		// 闪电图标 → 打开主页
		this.addRibbonIcon("zap", "闪念笔记", () => this.activateHomepage());

		// 命令：打开主页
		this.addCommand({
			id: "fleeting-notes-open-homepage",
			name: "打开闪念笔记主页",
			callback: () => this.activateHomepage(),
		});

		// 命令：打开当月文件
		this.addCommand({
			id: "fleeting-notes-open-current",
			name: "打开本月闪念笔记文件",
			callback: () => this.openCurrentMonthFile(),
		});

		// 切换标签页时，如果切到主页就自动刷新（确保看到最新内容）
		this.registerEvent(
			this.app.workspace.on("active-leaf-change", (leaf) => {
				if (leaf && leaf.view instanceof HomepageView) {
					leaf.view.refresh();
				}
			})
		);

		this.addSettingTab(new FleetingSettingTab(this.app, this));
	}

	onunload(): void {}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
		this.noteManager.updateSettings(this.settings);
	}

	async activateHomepage(): Promise<void> {
		const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_HOMEPAGE);
		let leaf: WorkspaceLeaf;

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

	private async openCurrentMonthFile(): Promise<void> {
		const path = this.noteManager.getCurrentMonthPath();
		const file = this.app.vault.getAbstractFileByPath(path);
		if (file instanceof TFile) {
			await this.app.workspace.getLeaf(false).openFile(file);
		} else {
			await this.noteManager.appendEntry("");
			const f = this.app.vault.getAbstractFileByPath(path);
			if (f instanceof TFile) {
				await this.app.workspace.getLeaf(false).openFile(f);
			}
		}
	}
}
