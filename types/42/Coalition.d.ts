export interface Coalition {
	id: number;
	name: string;
	slug: string;
	image_url: string;
	cover_url: string;
	color: string; // hex
	score: number;
	user_id: number; // master
}

export interface CoalitionUser {
	id: number;
	coalition_id: number;
	user_id: number;
	score: number;
	rank: number;
	created_at: Date;
	updated_at: Date;
}
