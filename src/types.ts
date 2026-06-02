export interface FleetingNotesSettings {
	/** 存储目录 */
	storageFolder: string;
	/** 文件名模板，{yyyy-MM} 替换为当月 */
	fileTemplate: string;
}

export const DEFAULT_SETTINGS: FleetingNotesSettings = {
	storageFolder: "",
	fileTemplate: "{yyyy-MM}.md",
};
