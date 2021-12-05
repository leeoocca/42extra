export interface Achievement {
	id: number;
	name: string;
	description: string;
	tier: Tier;
	kind: Kind;
	visible: boolean;
	image: string;
	nbr_of_success: number | null;
	users_url: string;
	achievements: string[];
	campus: string[];
	parent: AchievementPreview | null;
	title: Title | null;
}

export interface AchievementPreview {
	id: number;
	name: string;
	description: string;
	tier: Tier;
	kind: Kind;
	visible: boolean;
	image: string;
	nbr_of_success: null | null;
	users_url: string;
}

export enum Kind {
	Pedagogy = "pedagogy",
	Project = "project",
	Scolarity = "scolarity",
	Social = "social",
}

export enum Tier {
	Challenge = "challenge",
	Easy = "easy",
	Hard = "hard",
	Medium = "medium",
	None = "none",
}

export interface Title {
	id: number;
	name: string;
}
