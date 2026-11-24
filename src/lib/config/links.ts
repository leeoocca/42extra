import campusLinksData from './campus-links.json';

export interface CampusLink {
	id: string;
	title: string;
	url: string;
	description?: string;
	category?: string;
	campus_ids: number[];
}

export interface CampusLinksConfigFile {
	links: CampusLink[];
}

/**
 * Returns all links applicable to a given campus ID (or all global links if campusId is null/undefined).
 * Empty campus_ids array indicates a link global to all campuses.
 */
export function getCampusLinks(campusId?: number | null): CampusLink[] {
	const config = campusLinksData as unknown as CampusLinksConfigFile;
	if (!config || !Array.isArray(config.links)) return [];

	if (!campusId) {
		return config.links;
	}

	return config.links.filter(
		(link) => !link.campus_ids || link.campus_ids.length === 0 || link.campus_ids.includes(campusId)
	);
}
