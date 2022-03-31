import { UserPreview } from ".";

export interface Location {
	end_at: string | null; // Date
	id: number;
	begin_at: string; // Date
	primary: boolean;
	host: string;
	campus_id: number;
	user: UserPreview;
}
