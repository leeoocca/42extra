export interface Group {
	id: number;
	name: string;
}

export interface Skill {
	id: number;
	name: string;
	level: number;
}

export interface UserNode {
	id: number;
	login: string;
	url: string;
}

export interface Cursus {
	id: number;
	created_at: Date;
	name: string;
	slug: string;
}

export interface CursusUser {
	grade: string;
	level: number;
	skills: Skill[];
	blackholed_at: Date | null;
	id: number;
	begin_at: Date;
	end_at: Date | null;
	cursus_id: number;
	has_coalition: boolean;
	user: UserNode;
	cursus: Cursus;
}

export interface Project {
	id: number;
	name: string;
	slug: string;
	parent_id: number | null;
}

export interface ProjectsUser {
	id: number;
	occurrence: number;
	final_mark: number | null;
	status: string;
	"validated?": boolean;
	current_team_id: number | null;
	project: Project;
	cursus_ids: number[];
	marked_at: Date | null;
	marked: boolean;
	retriable_at: Date | null;
}

export interface LanguagesUser {
	id: number;
	language_id: number;
	user_id: number;
	position: number;
	created_at: Date;
}

export interface Achievement {
	id: number;
	name: string;
	description: string;
	tier: string;
	kind: string;
	visible: boolean;
	image: string;
	nbr_of_success: number | null;
	users_url: string;
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
}

export interface PartnershipsSkill {
	id: number;
	partnership_id: number;
	skill_id: number;
	value: number;
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

export interface Patron {
	id: number;
	user_id: number;
	godfather_id: number;
	ongoing: boolean;
	created_at: Date;
	updated_at: Date;
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
	vogsphere_id: number;
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

export interface CampusUser {
	id: number;
	user_id: number;
	campus_id: number;
	is_primary: boolean;
}

export interface User {
	id: number;
	email: string;
	login: string;
	first_name: string;
	last_name: string;
	usual_first_name: string | null;
	url: string;
	phone: string;
	displayname: string;
	usual_full_name: string;
	image_url: string;
	"staff?": boolean;
	correction_point: number;
	pool_month: string;
	pool_year: string;
	location: string | null;
	wallet: number;
	anonymize_date: Date;
	groups: Group[];
	cursus_users: CursusUser[];
	projects_users: ProjectsUser[];
	languages_users: LanguagesUser[];
	achievements: Achievement[];
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
