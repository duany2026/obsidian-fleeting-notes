import { ItemView, WorkspaceLeaf, TFile, setIcon, MarkdownView } from "obsidian";
import { NoteManager } from "./note-manager";

export const VIEW_TYPE_HOMEPAGE = "fleeting-notes-homepage";

export class HomepageView extends ItemView {
	private noteManager: NoteManager;
	private resizeObserver: ResizeObserver | null = null;

	constructor(leaf: WorkspaceLeaf, noteManager: NoteManager, _cb: () => void) {
		super(leaf);
		this.noteManager = noteManager;
	}

	getViewType(): string { return VIEW_TYPE_HOMEPAGE; }
	getDisplayText(): string { return "闪念笔记"; }
	getIcon(): string { return "zap"; }

	async onOpen(): Promise<void> {
		await this.render();
		this.setupResizeObserver();
	}

	async onClose(): Promise<void> {
		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
			this.resizeObserver = null;
		}
	}

	async refresh(): Promise<void> { await this.render(); }

	private setupResizeObserver(): void {
		const root = this.containerEl.children[1] as HTMLElement;
		this.resizeObserver = new ResizeObserver(() => {
			this.updateNarrowClass(root);
		});
		this.resizeObserver.observe(root);
		this.updateNarrowClass(root);
	}

	private updateNarrowClass(root: HTMLElement): void {
		const width = root.clientWidth;
		if (width > 0 && width < 400) {
			root.addClass("fn-narrow");
		} else {
			root.removeClass("fn-narrow");
		}
	}

	private async render(): Promise<void> {
		const root = this.containerEl.children[1] as HTMLElement;
		root.empty();
		root.addClass("fn-homepage");
		this.updateNarrowClass(root);

		const entries = await this.noteManager.getRecentEntries(30);

		const todayCount = entries.filter(e => {
			const now = new Date();
			const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
			return e.date === today;
		}).length;

		const stickyTop = root.createDiv({ cls: "fn-sticky-top" });

		const header = stickyTop.createDiv({ cls: "fn-header" });
		const headerLeft = header.createDiv({ cls: "fn-header-left" });
		headerLeft.createDiv({ cls: "fn-header-title", text: "闪念笔记" });
		const headerSub = headerLeft.createDiv({ cls: "fn-header-sub" });
		const now = new Date();
		const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
		headerSub.createSpan({ text: `${now.getMonth() + 1}月${now.getDate()}日 周${weekdays[now.getDay()]}` });
		if (todayCount > 0) {
			headerSub.createSpan({ cls: "fn-header-dot", text: "·" });
			const badge = headerSub.createSpan({ cls: "fn-header-badge", text: `今日 ${todayCount} 条` });
			badge.addClass("fn-badge-active");
		}

		const inputArea = stickyTop.createDiv({ cls: "fn-input-area" });

		const textArea = inputArea.createEl("textarea", {
			cls: "fn-input",
			attr: { placeholder: "记下此刻的想法…", rows: "3" },
		});

		const submitBtn = inputArea.createEl("button", { cls: "fn-submit-btn" });
		submitBtn.createSpan({ text: "记录" });

		const autoResize = () => {
			textArea.style.height = "auto";
			textArea.style.height = Math.min(textArea.scrollHeight, 150) + "px";
		};

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
		listHeader.createSpan({ cls: "fn-list-label", text: "最近记录" });
		if (entries.length > 0) {
			listHeader.createSpan({ cls: "fn-list-count", text: `${entries.length}` });
		}

		const listEl = listSection.createDiv({ cls: "fn-list" });

		if (entries.length === 0) {
			const empty = listEl.createDiv({ cls: "fn-empty" });
			const emptyIcon = empty.createDiv({ cls: "fn-empty-icon" });
			setIcon(emptyIcon, "sparkles");
			empty.createDiv({ cls: "fn-empty-text", text: "还没有记录" });
			empty.createDiv({ cls: "fn-empty-sub", text: "写下你的第一个想法吧" });
			return;
		}

		let lastDate = "";
		for (const entry of entries) {
			if (entry.date !== lastDate) {
				const sep = listEl.createDiv({ cls: "fn-date-sep" });
				sep.createDiv({ cls: "fn-sep-line" });
				const sepDot = sep.createDiv({ cls: "fn-sep-dot" });
				const sepLabel = sep.createDiv({ cls: "fn-sep-label" });

				const today = new Date();
				const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
				const yesterday = new Date(today);
				yesterday.setDate(yesterday.getDate() - 1);
				const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

				if (entry.date === todayStr) {
					sepLabel.createSpan({ cls: "fn-sep-today", text: "今天" });
					sepLabel.createSpan({ cls: "fn-sep-date", text: entry.date });
					sepDot.addClass("fn-sep-dot-today");
				} else if (entry.date === yesterdayStr) {
					sepLabel.createSpan({ cls: "fn-sep-today", text: "昨天" });
					sepLabel.createSpan({ cls: "fn-sep-date", text: entry.date });
				} else {
					sepLabel.createSpan({ text: entry.date });
				}
				lastDate = entry.date;
			}

			const item = listEl.createDiv({ cls: "fn-item" });

			const timeCol = item.createDiv({ cls: "fn-item-time-col" });
			timeCol.createDiv({ cls: "fn-time-dot" });
			timeCol.createSpan({ cls: "fn-item-time", text: entry.time });

			const contentCol = item.createDiv({ cls: "fn-item-content-col" });
			contentCol.createDiv({ cls: "fn-item-content", text: entry.content });

			const goCol = item.createDiv({ cls: "fn-item-go-col" });
			const goBtn = goCol.createDiv({ cls: "fn-goto-btn" });
			setIcon(goBtn, "external-link");
			goBtn.setAttribute("aria-label", "定位到原文件");
			goBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				this.navigateToEntry(entry.filePath, entry.line);
			});
		}
	}

	private async navigateToEntry(filePath: string, line: number): Promise<void> {
		const file = this.app.vault.getAbstractFileByPath(filePath);
		if (!(file instanceof TFile)) return;

		const leaf = this.app.workspace.getLeaf(false);
		await leaf.openFile(file);

		setTimeout(() => {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (view) {
				const editor = view.editor;
				editor.setCursor({ line, ch: 0 });
				editor.scrollIntoView(
					{ from: { line, ch: 0 }, to: { line: line + 1, ch: 0 } },
					true
				);
			}
		}, 200);
	}

	private async handleSubmit(textArea: HTMLTextAreaElement): Promise<void> {
		const text = textArea.value.trim();
		if (!text) {
			textArea.addClass("fn-input-error");
			setTimeout(() => textArea.removeClass("fn-input-error"), 1500);
			return;
		}
		textArea.value = "";
		textArea.style.height = "auto";
		try {
			await this.noteManager.appendEntry(text);
			await this.render();
		} catch {
			textArea.value = text;
		}
	}
}
