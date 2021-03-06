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
	nbr_of_success: number | null;
	users_url: string;
}

export type Kind = "pedagogy" | "project" | "scolarity" | "social";

export type Tier = "challenge" | "easy" | "hard" | "medium" | "none";

export interface Title {
	id: number;
	name: string;
}
