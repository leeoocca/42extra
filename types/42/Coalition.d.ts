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
