export interface FortyTwoUser {
	id: number;
	login: string;
	email: string;
	usual_first_name: string;
	image: {
		link: string;
		versions: {
			large: string;
			medium: string;
			small: string;
			micro: string;
		};
	};
	correction_point: number;
	pool_month: string;
	pool_year: string;
	location: string | null;
	wallet: number;
	cursus_users: CursusUser[];
	campus_users: CampusUser[];
}

export interface CursusUser {
	grade: string | null;
	level: number;
	blackhole: string | null;
	cursus: {
		name: string;
	};
}

export interface CampusUser {}
