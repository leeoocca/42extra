export interface Team {
	id: number;
	name: string;
	url: string;
	final_mark: number;
	project_id: number;
	created_at: Date;
	updated_at: Date;
	status: Status;
	terminating_at: Date | null;
	users: User[];
	"locked?": boolean;
	"validated?": boolean;
	"closed?": boolean;
	repo_url: string | null;
	repo_uuid: string;
	locked_at: Date;
	closed_at: Date;
	project_session_id: number;
	project_gitlab_path: string | null;
	scale_teams: ScaleTeam[];
	teams_uploads: TeamsUpload[];
}

export interface ScaleTeam {
	id: number;
	scale_id: number;
	comment: string;
	created_at: Date;
	updated_at: Date;
	feedback: string;
	final_mark: number;
	flag: Flag;
	begin_at: Date;
	correcteds: CorrectionUser[];
	corrector: CorrectionUser;
	truant: any;
	filled_at: Date;
	questions_with_answers: any[];
}

export interface CorrectionUser {
	id: number;
	login: string;
	url: string;
}

export interface Flag {
	id: number;
	name: string;
	positive: boolean;
	icon: string;
	created_at: Date;
	updated_at: Date;
}

export enum Status {
	"finished",
}

export interface TeamsUpload {
	id: number;
	final_mark: number;
	comment: string;
	created_at: Date;
	upload_id: number;
}

export interface User {
	id: number;
	login: string;
	url: string;
	leader: boolean;
	occurrence: number;
	validated: boolean;
	projects_user_id: number;
}
