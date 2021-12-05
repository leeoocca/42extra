export interface Event {
	id: number;
	name: string;
	description: string;
	location: string;
	kind: Kind;
	max_people: number | null;
	nbr_subscribers: number;
	begin_at: Date;
	end_at: Date;
	campus_ids: number[];
	cursus_ids: number[];
	created_at: Date;
	updated_at: Date;
	prohibition_of_cancellation: null;
	waitlist: Waitlist | null;
	themes: any[];
}

export enum Kind {
	"conference",
	"event",
	"hackathon",
	"meet_up",
	"workshop",
}

export interface Waitlist {
	id: number;
	waitlistable_id: number;
	waitlistable_type: string;
	created_at: Date;
	updated_at: Date;
}
