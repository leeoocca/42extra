import type { FtLocation, FtCluster } from '#lib/schemas/42.js';
import campusClustersData from './campus-clusters.json';

export interface CampusClusterMapping {
	campusId?: number;
	campusName?: string;
	prefixLength?: number;
	clusters: Array<{
		id?: number;
		prefix: string;
		name: string;
		description?: string;
	}>;
}

export interface CampusClustersConfigFile {
	campuses: Record<string, CampusClusterMapping>;
}

export interface ResolvedClusterGroup {
	clusterId?: number;
	clusterName: string;
	prefix: string;
	locations: FtLocation[];
}

/**
 * Returns the campus cluster configuration for a given campus ID or campus name.
 */
export function getCampusClusterConfig(campusId?: number | null, campusName?: string | null): CampusClusterMapping | null {
	const config = campusClustersData as unknown as CampusClustersConfigFile;
	if (!config || !config.campuses) return null;

	const normalizedName = campusName?.trim().toLowerCase();

	for (const [key, campusConfig] of Object.entries(config.campuses)) {
		if (campusId && campusConfig.campusId === campusId) {
			return campusConfig;
		}
		if (normalizedName && (key.toLowerCase() === normalizedName || campusConfig.campusName?.toLowerCase() === normalizedName)) {
			return campusConfig;
		}
	}

	return null;
}

/**
 * Groups active workstation locations by cluster, using campus prefix configuration if available,
 * and falling back to host naming patterns or /v2/clusters info.
 * Sorts clusters by prefix if available, then by name.
 */
export function groupLocationsByCluster(
	locations: FtLocation[],
	campusConfig?: CampusClusterMapping | null,
	apiClusters?: FtCluster[]
): ResolvedClusterGroup[] {
	// Build lookup maps from configured clusters
	const prefixToConfigMap = new Map<string, { id?: number; name: string; prefix: string }>();
	const configuredPrefixes: string[] = [];

	if (campusConfig?.clusters) {
		for (const cl of campusConfig.clusters) {
			const cleanPrefix = cl.prefix.trim().toLowerCase();
			prefixToConfigMap.set(cleanPrefix, {
				id: cl.id,
				name: cl.name,
				prefix: cleanPrefix
			});
			configuredPrefixes.push(cleanPrefix);
		}
		// Sort configured prefixes by descending length so longer prefixes match first (e.g. c4c before c4)
		configuredPrefixes.sort((a, b) => b.length - a.length);
	}

	// Also build lookup from API clusters if name or description matches or contains prefixes
	const apiClusterByName = new Map<string, FtCluster>();
	if (apiClusters) {
		for (const cl of apiClusters) {
			apiClusterByName.set(cl.name.toLowerCase(), cl);
		}
	}

	const groupsMap = new Map<string, {
		clusterId?: number;
		clusterName: string;
		prefix: string;
		locations: FtLocation[];
	}>();

	for (const loc of locations) {
		const host = (loc.host || 'unknown').trim().toLowerCase();
		let matchedPrefix = '';
		let clusterName = '';
		let clusterId: number | undefined;

		// 1. Try to match configured prefix
		for (const pref of configuredPrefixes) {
			if (host.startsWith(pref)) {
				matchedPrefix = pref;
				const conf = prefixToConfigMap.get(pref)!;
				clusterName = conf.name;
				clusterId = conf.id;
				break;
			}
		}

		// 2. Fallback: if not matched in configured prefixes, infer prefix using campus prefixLength or standard pattern
		if (!matchedPrefix) {
			if (campusConfig?.prefixLength && host.length >= campusConfig.prefixLength) {
				matchedPrefix = host.slice(0, campusConfig.prefixLength);
			} else {
				// Standard 42 host pattern: characters before 'r' row number (e.g. f1r2s3 -> f1, c1b5c2 -> c1b if letter follows, or up to digits)
				const match = host.match(/^([a-z0-9]+?)(?:r\d+|$)/i);
				matchedPrefix = match ? match[1] : host.slice(0, 2);
			}

			// Check if matchedPrefix corresponds to an API cluster name directly (e.g. Berlin clusters named c4c, c4b, etc.)
			const apiCluster = apiClusterByName.get(matchedPrefix);
			if (apiCluster) {
				clusterName = apiCluster.name;
				clusterId = apiCluster.id;
			} else {
				clusterName = matchedPrefix.toUpperCase();
			}
		}

		const groupKey = matchedPrefix || 'other';

		if (!groupsMap.has(groupKey)) {
			groupsMap.set(groupKey, {
				clusterId,
				clusterName: clusterName || groupKey.toUpperCase(),
				prefix: matchedPrefix,
				locations: []
			});
		}

		groupsMap.get(groupKey)!.locations.push(loc);
	}

	// Convert to array and sort: clusters sorted by prefix if available, then by name
	const result = Array.from(groupsMap.values());

	result.sort((a, b) => {
		if (a.prefix && b.prefix) {
			const prefixCompare = a.prefix.localeCompare(b.prefix, undefined, { numeric: true });
			if (prefixCompare !== 0) return prefixCompare;
		} else if (a.prefix && !b.prefix) {
			return -1;
		} else if (!a.prefix && b.prefix) {
			return 1;
		}
		return a.clusterName.localeCompare(b.clusterName, undefined, { numeric: true });
	});

	// Sort locations within each cluster by host
	for (const group of result) {
		group.locations.sort((a, b) => (a.host || '').localeCompare(b.host || '', undefined, { numeric: true }));
	}

	return result;
}
