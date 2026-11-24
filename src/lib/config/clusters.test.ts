import { describe, it, expect } from 'vitest';
import { groupLocationsByCluster, getCampusClusterConfig } from './clusters.js';
import type { FtLocation } from '#lib/schemas/42.js';

describe('Campus Clusters grouping and sorting', () => {
	it('loads campus configuration by campusId and name', () => {
		const berlinById = getCampusClusterConfig(51);
		expect(berlinById).not.toBeNull();
		expect(berlinById?.campusName).toBe('Berlin');
		expect(berlinById?.prefixLength).toBe(3);

		const berlinByName = getCampusClusterConfig(null, 'Berlin');
		expect(berlinByName).not.toBeNull();
		expect(berlinByName?.campusId).toBe(51);

		const romeById = getCampusClusterConfig(30);
		expect(romeById).not.toBeNull();
		expect(romeById?.campusName).toBe('Rome');
		expect(romeById?.prefixLength).toBe(2);
	});

	it('groups Berlin workstations by 3-character prefix and matches cluster names', () => {
		const berlinConfig = getCampusClusterConfig(51);
		const locations = [
			{ id: 1, host: 'c4c1r2', begin_at: '2026-11-24T00:00:00Z', user: { login: 'student1' } },
			{ id: 2, host: 'c1b5c2', begin_at: '2026-11-24T01:00:00Z', user: { login: 'student2' } },
			{ id: 3, host: 'c4b2r1', begin_at: '2026-11-24T02:00:00Z', user: { login: 'student3' } },
			{ id: 4, host: 'c0c1r1', begin_at: '2026-11-24T03:00:00Z', user: { login: 'student4' } }
		] as FtLocation[];

		const groups = groupLocationsByCluster(locations, berlinConfig);

		// Sorted by prefix if available, then name
		expect(groups.map((g) => g.prefix)).toEqual(['c0c', 'c1b', 'c4b', 'c4c']);
		expect(groups.map((g) => g.clusterName)).toEqual(['c0c', 'c1b', 'c4b', 'c4c']);
		expect(groups[0].locations[0].host).toBe('c0c1r1');
		expect(groups[1].locations[0].host).toBe('c1b5c2');
	});

	it('groups Rome workstations by custom cluster names (Bunker, C4, Piccionaia) and sorts by prefix (c1, c2, c3)', () => {
		const romeConfig = getCampusClusterConfig(30);
		const locations = [
			{ id: 10, host: 'c3r1p5', begin_at: '2026-11-24T00:00:00Z', user: { login: 'rome_user1' } },
			{ id: 11, host: 'c1r2p3', begin_at: '2026-11-24T01:00:00Z', user: { login: 'rome_user2' } },
			{ id: 12, host: 'c2r1p1', begin_at: '2026-11-24T02:00:00Z', user: { login: 'rome_user3' } }
		] as FtLocation[];

		const groups = groupLocationsByCluster(locations, romeConfig);

		expect(groups.map((g) => g.prefix)).toEqual(['c1', 'c2', 'c3']);
		expect(groups.map((g) => g.clusterName)).toEqual([
			'Bunker',
			'C4, pronto a esplodere',
			'Piccionaia'
		]);
		expect(groups.map((g) => g.clusterId)).toEqual([74, 75, 342]);
	});

	it('handles unknown campuses with standard prefix fallback and sorting', () => {
		const locations = [
			{ id: 20, host: 'f2r3s4', begin_at: '2026-11-24T00:00:00Z' },
			{ id: 21, host: 'f1r1s1', begin_at: '2026-11-24T00:00:00Z' }
		] as FtLocation[];

		const groups = groupLocationsByCluster(locations, null);
		expect(groups.map((g) => g.prefix)).toEqual(['f1', 'f2']);
		expect(groups.map((g) => g.clusterName)).toEqual(['F1', 'F2']);
	});
});
