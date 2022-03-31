import { UserPreview } from ".";

export interface Location {
	end_at: Date | null;
	id: number;
	begin_at: Date;
	primary: boolean;
	host: string;
	campus_id: number;
	user: UserPreview;
}
