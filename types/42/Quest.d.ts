export interface Quest {
	id: number;
	name: string;
	slug: string;
	kind: Kind;
	internal_name: string;
	description: string;
	cursus_id: number;
	campus_id: null;
	created_at: Date;
	updated_at: Date;
	grade_id: number | null;
	position: number;
}

export interface QuestUser {
	id: number;
	end_at: Date | null;
	quest_id: number;
	validated_at: Date | null;
	prct: number | null;
	advancement: string | null;
	created_at: Date;
	updated_at: Date;
	user: User;
	quest: Quest;
}

export enum Kind {
	"main",
	"mandatory",
	"optional",
}
