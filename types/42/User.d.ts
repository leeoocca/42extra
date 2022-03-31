import { AchievementPreview, Campus, Cursus } from ".";
import { Status } from "./Team";

export interface User {
	id: number;
	email: string;
	login: string;
	first_name: string;
	last_name: string;
	usual_full_name: string;
	usual_first_name: null;
	url: string;
	phone: string;
	displayname: string;
	image_url: string;
	"staff?": boolean;
	correction_point: number;
	pool_month: string;
	pool_year: string;
	location: null;
	wallet: number;
	anonymize_date: Date;
	created_at: Date;
	updated_at: Date;
	alumni: boolean;
	"is_launched?": boolean;
	groups: Group[];
	cursus_users: CursusUser[];
	projects_users: ProjectsUser[];
	languages_users: LanguagesUser[];
	achievements: AchievementPreview[];
	titles: Title[];
	titles_users: TitlesUser[];
	partnerships: Partnership[];
	patroned: Patron[];
	patroning: Patron[];
	expertises_users: ExpertisesUser[];
	roles: any[];
	campus: Campus[];
	campus_users: CampusUser[];
}

export interface Group {
	id: number;
	name: string;
}

export interface Title {
	id: number;
	name: string;
}

export interface TitlesUser {
	id: number;
	user_id: number;
	title_id: number;
	selected: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface Partnership {
	id: number;
	name: string;
	slug: string;
	difficulty: number;
	url: string;
	partnerships_users_url: string;
	partnerships_skills: PartnershipsSkill[];
}

export interface PartnershipsSkill {
	id: number;
	partnership_id: number;
	skill_id: number;
	value: number;
	created_at: Date;
	updated_at: Date;
}

export interface Patron {
	id: number;
	user_id: number;
	godfather_id: number;
	ongoing: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface UserPreview {
	id: number;
	email: string;
	login: string;
	first_name: string;
	last_name: string;
	usual_full_name: string | null;
	usual_first_name: string | null;
	url: string;
	phone: string;
	displayname: string;
	image_url: string;
	new_image_url: string;
	"staff?": boolean;
	correction_point: number;
	pool_month: string;
	pool_year: string;
	location: string | null;
	wallet: number;
	anonymize_date: Date;
	created_at: Date;
	updated_at: Date;
	alumni: boolean;
	"is_launched?": boolean;
}

export interface CampusUser {
	id: number;
	user_id: number;
	campus_id: number;
	is_primary: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface CursusUser {
	grade: null | string;
	level: number;
	skills: Skill[];
	blackholed_at: Date | null;
	id: number;
	begin_at: Date;
	end_at: Date | null;
	cursus_id: number;
	has_coalition: boolean;
	created_at: Date;
	updated_at: Date;
	user: User;
	cursus: Cursus;
}

export interface Skill {
	id: number;
	name: string;
	level: number;
}

export interface ExpertisesUser {
	id: number;
	expertise_id: number;
	interested: boolean;
	value: number;
	contact_me: boolean;
	created_at: Date;
	user_id: number;
}

export interface LanguagesUser {
	id: number;
	language_id: number;
	user_id: number;
	position: number;
	created_at: Date;
}

export interface ProjectsUser {
	id: number;
	occurrence: number;
	final_mark: number | null;
	status: Status;
	"validated?": boolean | null;
	current_team_id: number;
	project: ProjectPreview;
	cursus_ids: number[];
	marked_at: Date | null;
	marked: boolean;
	retriable_at: Date | null;
	created_at: Date;
	updated_at: Date;
}

export interface ProjectPreview {
	id: number;
	name: string;
	slug: string;
	parent_id: number | null;
}
