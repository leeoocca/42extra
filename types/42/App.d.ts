export interface App {
	id: number;
	name: string;
	description: string;
	image: string;
	website: string;
	public: boolean;
	scopes: any[];
	created_at: Date;
	updated_at: Date;
	owner: Owner;
	rate_limit: number;
	roles: Role[];
}

export interface Owner {
	id: number;
	login: string;
	url: string;
}

export interface Role {
	id: number;
	name: string;
	description: string;
}
