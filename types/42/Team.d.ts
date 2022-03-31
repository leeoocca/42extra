export interface Team {
	id: number;
	name: string;
	url: string;
	final_mark: number;
	project_id: number;
	created_at: string; // Date
	updated_at: string; // Date
	status: Status;
	terminating_at: string | null; // Date
	users: TeamUser[];
	"locked?": boolean;
	"validated?": boolean;
	"closed?": boolean;
	repo_url: string | null;
	repo_uuid: string;
	locked_at: string; // Date
	closed_at: string; // Date
	project_session_id: number;
	project_gitlab_path: string | null;
	scale_teams: ScaleTeam[];
	teams_uploads: TeamsUpload[];
}

export interface ScaleTeam {
	id: number;
	scale_id: number;
	comment: string;
	created_at: string; // Date
	updated_at: string; // Date
	feedback: string;
	final_mark: number;
	flag: Flag;
	begin_at: string; // Date
	correcteds: CorrectionUser[];
	corrector: CorrectionUser;
	truant: any;
	filled_at: string; // Date
	questions_with_answers: any[];
}

export interface CorrectionUser {
	id: number;
	login: string;
	url: string;
}

export interface Flag {
	id: number;
	name: FlagName;
	positive: boolean;
	icon: string;
	created_at: string; // Date
	updated_at: string; // Date
}

export enum FlagName {
	Cheat = "Cheat",
	EmptyWork = "Empty work",
	ForbiddenFunction = "Forbidden Function",
	NoAuthorFile = "No author file",
	Norme = "Norme",
	Ok = "Ok",
}

export enum Status {
	Finished = "finished",
	InProgress = "in_progress",
	Parent = "parent",
	WaitingForCorrection = "waiting_for_correction",
}

export interface TeamsUpload {
	id: number;
	final_mark: number;
	comment: string;
	created_at: string; // Date
	upload_id: number;
}

export interface TeamUser {
	id: number;
	login: string;
	url: string;
	leader: boolean;
	occurrence: number;
	validated: boolean;
	projects_user_id: number;
}
