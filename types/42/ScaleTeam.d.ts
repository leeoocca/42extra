import { Language, Status } from ".";

export interface TeamClass {
	id: number;
	name: string;
	url: string;
	final_mark: number;
	project_id: number;
	created_at: string; // Date
	updated_at: string; // Date
	status: Status;
	terminating_at: null;
	users: User[];
	"locked?": boolean;
	"validated?": boolean;
	"closed?": boolean;
	repo_url: string;
	repo_uuid: string;
	locked_at: string; // Date
	closed_at: string; // Date
	project_session_id: number;
	project_gitlab_path: string;
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
	correcteds: Corrector[];
	corrector: Corrector;
	truant: Truant;
	filled_at: string; // Date
	questions_with_answers: any[];
	scale: Scale;
	team: TeamClass;
	feedbacks: Feedback[];
}

export interface Corrector {
	id: number;
	login: string;
	url: string;
}

export interface Feedback {
	id: number;
	user: Corrector;
	feedbackable_type: FeedbackableType;
	feedbackable_id: number;
	comment: string;
	rating: number;
	created_at: string; // Date
}

// TODO verify
export type FeedbackableType = "ScaleTeam";

export interface Flag {
	id: number;
	name: FlagName;
	positive: boolean;
	icon: Icon;
	created_at: string; // Date
	updated_at: string; // Date
}

export interface Scale {
	id: number;
	evaluation_id: number;
	name: string;
	is_primary: boolean;
	comment: string;
	introduction_md: string;
	disclaimer_md: string;
	guidelines_md: string;
	created_at: string; // Date
	correction_number: number;
	duration: number;
	manual_subscription: boolean;
	languages: Language[];
	flags: Flag[];
	free: boolean;
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

export interface Truant {}
