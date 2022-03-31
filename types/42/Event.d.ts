import { UserPreview } from "./User";

export interface Event {
	id: number;
	name: string;
	description: string;
	location: string;
	kind: Kind;
	max_people: number | null;
	nbr_subscribers: number;
	begin_at: string; // Date
	end_at: string; // Date
	campus_ids: number[];
	cursus_ids: number[];
	created_at: string; // Date
	updated_at: string; // Date
	prohibition_of_cancellation: null;
	waitlist: Waitlist | null;
	themes: any[];
}

export enum Kind {
	Association = "association",
	Atelier = "atelier",
	Challenge = "challenge",
	Conference = "conference",
	Event = "event",
	Extern = "extern",
	Hackathon = "hackathon",
	MeetUp = "meet_up",
	Other = "other",
	Partnership = "partnership",
	SpeedWorking = "speed_working",
	Workshop = "workshop",
}

export interface Waitlist {
	id: number;
	waitlistable_id: number;
	waitlistable_type: string;
	created_at: string; // Date
	updated_at: string; // Date
}

export interface EventUser {
	id: number;
	event_id: number;
	user_id: number;
	user: UserPreview;
	event: Event;
}
