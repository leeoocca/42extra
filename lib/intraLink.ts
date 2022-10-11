import { useRouter } from "next/router";

const PROFILE_BASE = "https://profile.intra.42.fr";
const PROJECTS_BASE = "https://projects.intra.42.fr";

// USER

export function GetUserLink() {
	const {
		query: { login },
	} = useRouter();
	return PROFILE_BASE + "/users/" + login;
}

export function GetUserQuestsLink() {
	const {
		query: { login },
	} = useRouter();
	return PROFILE_BASE + "/users/" + login + "/quests";
}

export function GetUserAchievementsLink() {
	const {
		query: { login },
	} = useRouter();
	return PROFILE_BASE + "/users/" + login + "/achievements";
}

// https://profile.intra.42.fr/users/lrocca/correction_point_historics

// https://projects.intra.42.fr/projects/graph?login=lrocca
// https://projects.intra.42.fr/users/lrocca/feedbacks

// https://profile.intra.42.fr/users/lrocca/experiences/cursus_id/21

// PROJECT

export function GetProjectLink() {
	const {
		query: { slug },
	} = useRouter();
	return PROJECTS_BASE + "/projects/" + slug;
}

// PROJECT USER

export function GetUserProjectLink() {
	const {
		query: { project, login },
	} = useRouter();
	return PROJECTS_BASE + "/" + project + "/" + login;
}

// COALITIONS

// https://profile.intra.42.fr/blocs/35/coalitions/126

// https://profile.intra.42.fr/blocs/35/coalitions
// https://profile.intra.42.fr/blocs/35/scores

// https://profile.intra.42.fr/blocs/35/coalitions/void/scores

// SETTINGS

// https://profile.intra.42.fr/users/lrocca/edit

// https://profile.intra.42.fr/gitlab_users
// https://profile.intra.42.fr/languages
// https://profile.intra.42.fr/mails
// https://profile.intra.42.fr/securities
// https://profile.intra.42.fr/expertises_users
// https://profile.intra.42.fr/anti_grav_units_users/new

// EVENTS

export function GetEventLink() {
	const {
		query: { id },
	} = useRouter();
	return PROFILE_BASE + "/events/" + id;
}

// https://profile.intra.42.fr/events/12228/feedbacks

// https://profile.intra.42.fr/events
// https://profile.intra.42.fr/events/marks

// APPLICATION

// https://profile.intra.42.fr/oauth/applications

export function GetAppLink() {
	const {
		query: { id },
	} = useRouter();
	return PROFILE_BASE + "/oauth/applications/" + id;
}

// https://profile.intra.42.fr/oauth/applications/5406/edit
