export type FilePeriod = "month" | "week" | "year";
export type DisplayRange = "month" | "week" | "today";

export interface FleetingNotesSettings {
	storageFolder: string;
	filePeriod: FilePeriod;
	displayRange: DisplayRange;
	acceptedFallbackNames: string[];
}

export interface RecentEntry {
	date: string;
	time: string;
	content: string;
	filePath: string;
	line: number;
	occurrence?: number;
}

export const DEFAULT_SETTINGS: FleetingNotesSettings = {
	storageFolder: "",
	filePeriod: "month",
	displayRange: "month",
	acceptedFallbackNames: []
};
