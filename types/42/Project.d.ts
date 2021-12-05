import { Campus } from "./Campus";
import { Cursus } from "./Cursus";

export interface Project {
	id: number;
	name: string;
	slug: string;
	parent: ProjectPreview;
	children: ProjectPreview[];
	attachments: any[];
	created_at: Date;
	updated_at: Date;
	exam: boolean;
	git_id: number;
	repository: string;
	recommendation: Recommendation;
	cursus: Cursus[];
	campus: Campus[];
	videos: any[];
	project_sessions: ProjectSession[];
}

export interface ProjectPreview {
	id: number;
	name: string;
	slug: string;
	url: string;
}

// TODO verify
export interface ProjectSession {
	id: number;
	solo: boolean | null;
	begin_at: Date | null;
	end_at: Date | null;
	estimate_time: string | null;
	difficulty: number | null;
	objectives: string[];
	description: string;
	duration_days: null;
	terminating_after: number | null;
	project_id: number;
	campus_id: number | null;
	cursus_id: number | null;
	created_at: Date;
	updated_at: Date;
	max_people: null;
	is_subscriptable: boolean;
	scales: Scale[];
	uploads: Upload[];
	team_behaviour: TeamBehaviour;
	commit: string | null;
}

export interface Scale {
	id: number;
	correction_number: number;
	is_primary: boolean;
}

// TODO verify
export enum TeamBehaviour {
	"by_rule",
	"user",
}

export interface Upload {
	id: number;
	name: string;
}

// TODO verify
export enum Recommendation {
	"forbidden",
	"recommended",
}