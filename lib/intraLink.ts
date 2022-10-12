const PROFILE_BASE = "https://profile.intra.42.fr";
const PROJECTS_BASE = "https://projects.intra.42.fr";

// USER

export function getUserLink(query) {
	return PROFILE_BASE + "/users/" + query.login;
}

export function getUserQuestsLink(query) {
	return PROFILE_BASE + "/users/" + query.login + "/quests";
}

export function getUserAchievementsLink(query) {
	return PROFILE_BASE + "/users/" + query.login + "/achievements";
}

// https://profile.intra.42.fr/users/lrocca/correction_point_historics

// https://projects.intra.42.fr/projects/graph?login=lrocca
// https://projects.intra.42.fr/users/lrocca/feedbacks

// https://profile.intra.42.fr/users/lrocca/experiences/cursus_id/21

// PROJECT

export function getProjectLink(query) {
	return PROJECTS_BASE + "/projects/" + query.slug;
}

// PROJECT USER

export function getUserProjectLink(query) {
	return PROJECTS_BASE + "/" + query.project + "/" + query.login;
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

export function getEventLink(query) {
	return PROFILE_BASE + "/events/" + query.id;
}

// https://profile.intra.42.fr/events/12228/feedbacks

// https://profile.intra.42.fr/events
// https://profile.intra.42.fr/events/marks

// APPLICATION

// https://profile.intra.42.fr/oauth/applications

export function getAppLink(query) {
	return PROFILE_BASE + "/oauth/applications/" + query.id;
}

// https://profile.intra.42.fr/oauth/applications/5406/edit
