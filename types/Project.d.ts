export interface Cursus {
	id: number;
	created_at: Date;
	name: string;
	slug: string;
}

export interface Language {
	id: number;
	name: string;
	identifier: string;
	created_at: Date;
	updated_at: Date;
}

export interface Campus {
	id: number;
	name: string;
	time_zone: string;
	language: Language;
	users_count: number;
	vogsphere_id?: number;
	country: string;
	address: string;
	zip: string;
	city: string;
	website: string;
	facebook: string;
	twitter: string;
	active: boolean;
	email_extension: string;
	default_hidden_phone: boolean;
}

export interface Scale {
	id: number;
	correction_number: number;
	is_primary: boolean;
}

export interface ProjectSession {
	id: number;
	solo: boolean;
	begin_at?: any;
	end_at?: any;
	estimate_time: number;
	difficulty: number;
	objectives: string[];
	description: string;
	duration_days?: any;
	terminating_after?: any;
	project_id: number;
	campus_id?: number;
	cursus_id?: number;
	created_at: Date;
	updated_at: Date;
	max_people?: any;
	is_subscriptable: boolean;
	scales: Scale[];
	uploads: any[];
	team_behaviour: string;
	commit: string;
}

export interface Project {
	id: number;
	name: string;
	slug: string;
	parent: any | null;
	children: any[];
	attachments: any[];
	created_at: Date;
	updated_at: Date;
	exam: boolean;
	git_id: number;
	repository: string;
	recommendation: string;
	cursus: Cursus[];
	campus: Campus[];
	videos: any[];
	project_sessions: ProjectSession[];
}
