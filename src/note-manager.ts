import { App, TFile, TFolder, normalizePath } from "obsidian";
import { FleetingNotesSettings } from "./types";

export class NoteManager {
	private app: App;
	private settings: FleetingNotesSettings;

	constructor(app: App, settings: FleetingNotesSettings) {
		this.app = app;
		this.settings = settings;
	}

	updateSettings(settings: FleetingNotesSettings): void {
		this.settings = settings;
	}

	/* ---------- 路径工具 ---------- */

	private getMonthStr(): string {
		const now = new Date();
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
	}

	private getTodayStr(): string {
		const now = new Date();
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
	}

	private getTimeStr(): string {
		const now = new Date();
		return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
	}

	/** 构建月度文件名正则（用于匹配 vault 中已有文件） */
	private getFileRegex(): RegExp {
		const template = this.settings.fileTemplate;
		const escaped = template.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const pattern = escaped.replace("\\{yyyy-MM\\}", "(\\d{4}-\\d{2})");
		return new RegExp(`^${pattern.replace(/(\\d\{2\}\))(.+)$/, "$1.*$2")}`);
	}

	/**
	 * 获取当月文件路径。
	 * 优先扫描 vault 中已有的文件，找不到再用设置中的路径创建。
	 */
	getCurrentMonthPath(): string {
		const monthStr = this.getMonthStr();
		const fileRegex = this.getFileRegex();

		// 先扫描 vault 中是否已有匹配的月度文件
		const allFiles = this.app.vault.getFiles();
		for (const f of allFiles) {
			const m = f.name.match(fileRegex);
			if (m && m[1] === monthStr) {
				return f.path; // 找到了，直接用已有路径
			}
		}

		// 没找到，按设置生成默认路径
		const fileName = this.settings.fileTemplate.replace("{yyyy-MM}", monthStr);
		const folder = this.settings.storageFolder;
		return folder ? normalizePath(`${folder}/${fileName}`) : normalizePath(fileName);
	}

	/* ---------- 文件操作 ---------- */

	private async ensureDirectoryExists(dirPath: string): Promise<void> {
		if (!dirPath) return;
		if (this.app.vault.getAbstractFileByPath(dirPath) instanceof TFolder) return;
		const parent = dirPath.substring(0, dirPath.lastIndexOf("/"));
		if (parent) await this.ensureDirectoryExists(parent);
		if (!this.app.vault.getAbstractFileByPath(dirPath)) {
			await this.app.vault.createFolder(dirPath);
		}
	}

	private async ensureFileExists(filePath: string, initialContent: string): Promise<TFile> {
		const existing = this.app.vault.getAbstractFileByPath(filePath);
		if (existing instanceof TFile) return existing;
		const dir = filePath.substring(0, filePath.lastIndexOf("/"));
		await this.ensureDirectoryExists(dir);
		return await this.app.vault.create(filePath, initialContent);
	}

	/* ---------- 追加一条闪念 ---------- */

	async appendEntry(content: string): Promise<void> {
		const filePath = this.getCurrentMonthPath();
		const file = await this.ensureFileExists(filePath, "");
		const existing = await this.app.vault.read(file);

		const todayHeader = `## ${this.getTodayStr()}`;
		const timeStr = this.getTimeStr();

		// 内容每行缩进一级
		const indented = content.split("\n").map((l) => `\t${l}`).join("\n");
		const entry = `- ${timeStr}\n${indented}`;

		let newContent: string;

		if (existing.includes(todayHeader)) {
			// 在今天区块末尾插入（下一个 ## 之前或文件末尾）
			const hIdx = existing.indexOf(todayHeader);
			const after = existing.substring(hIdx + todayHeader.length);
			const nextH = after.search(/\n## /);
			const insertPos = nextH !== -1 ? hIdx + todayHeader.length + nextH : existing.length;
			const before = existing.substring(0, insertPos).trimEnd();
			const rest = existing.substring(insertPos);
			newContent = before + "\n" + entry + "\n" + rest;
		} else {
			// 新建日期区块，追加到文件末尾
			newContent = existing.trimEnd() + `\n\n${todayHeader}\n\n${entry}\n`;
		}

		await this.app.vault.modify(file, newContent);
	}

	/* ---------- 获取最近记录 ---------- */

	async getRecentEntries(limit: number = 30): Promise<
		Array<{ date: string; time: string; content: string; filePath: string; line: number }>
	> {
		const entries: Array<{ date: string; time: string; content: string; filePath: string; line: number }> = [];
		const template = this.settings.fileTemplate;

		const escaped = template.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const pattern = escaped.replace("\\{yyyy-MM\\}", "(\\d{4}-\\d{2})");
		const fileRegex = new RegExp(`^${pattern.replace(/(\\d\{2\}\))(.+)$/, "$1.*$2")}`);

		const folder = this.settings.storageFolder;
		const allFiles = folder
			? this.app.vault.getFiles().filter((f) => f.path.startsWith(folder + "/"))
			: this.app.vault.getFiles();

		for (const file of allFiles) {
			if (!file.name.match(fileRegex)) continue;
			const content = await this.app.vault.read(file);
			const lines = content.split("\n");

			// 逐行扫描，记录每个日期区块和条目的行号
			let currentDate = "";
			for (let i = 0; i < lines.length; i++) {
				const dateMatch = lines[i].match(/^## (\d{4}-\d{2}-\d{2})/);
				if (dateMatch) {
					currentDate = dateMatch[1];
					continue;
				}
				const timeMatch = lines[i].match(/^- (\d{2}:\d{2})/);
				if (timeMatch && currentDate) {
					const time = timeMatch[1];
					const startLine = i;
					// 收集该条目的所有后续缩进行
					let textLines: string[] = [];
					let j = i + 1;
					while (j < lines.length) {
						const next = lines[j];
						// 下一个条目或下一个日期标题 → 结束
						if (/^- \d{2}:\d{2}/.test(next) || /^## /.test(next)) break;
						// tab 缩进的内容行
						if (next.startsWith("\t")) {
							textLines.push(next.replace(/^\t/, ""));
						} else if (next.trim() === "") {
							// 空行也保留（条目内段落间隔）
							textLines.push("");
						} else {
							break;
						}
						j++;
					}
					const text = textLines.join("\n").trimEnd().replace(/\n{3,}/g, "\n\n");
					if (text) {
						entries.push({
							date: currentDate,
							time,
							content: text,
							filePath: file.path,
							line: startLine,
						});
					}
				}
			}
		}

		// 按日期+时间倒序
		entries.sort((a, b) => {
			const c = b.date.localeCompare(a.date);
			return c !== 0 ? c : b.time.localeCompare(a.time);
		});

		return entries.slice(0, limit);
	}
}
