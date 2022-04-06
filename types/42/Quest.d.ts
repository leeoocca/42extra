export interface Quest {
	id: number;
	name: string;
	slug: string;
	kind: Kind;
	internal_name: string;
	description: string;
	cursus_id: number;
	campus_id: null;
	created_at: string; // Date
	updated_at: string; // Date
	grade_id: number | null;
	position: number;
}

export interface QuestUser {
	id: number;
	end_at: string | null; // Date
	quest_id: number;
	validated_at: string | null; // Date
	prct: number | null;
	advancement: string | null;
	created_at: string; // Date
	updated_at: string; // Date
	user: User;
	quest: Quest;
}

export type Kind = "main" | "mandatory" | "optional";
