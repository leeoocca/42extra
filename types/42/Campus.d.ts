import { Language } from ".";

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
