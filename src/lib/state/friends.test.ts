import { describe, it, expect, beforeEach, vi } from 'vitest';
import { friendsStore } from './friends.svelte.js';

describe('friendsStore', () => {
	beforeEach(() => {
		// Mock localStorage
		const store: Record<string, string> = {};
		vi.stubGlobal('localStorage', {
			getItem: (key: string) => store[key] || null,
			setItem: (key: string, val: string) => {
				store[key] = val;
			},
			removeItem: (key: string) => {
				delete store[key];
			},
			clear: () => {
				for (const k of Object.keys(store)) delete store[k];
			}
		});
		friendsStore.clear();
	});

	it('adds, checks, and removes friends by ID', () => {
		expect(friendsStore.isFriend(42)).toBe(false);
		friendsStore.addFriend(42);
		expect(friendsStore.isFriend(42)).toBe(true);
		expect(friendsStore.ids).toEqual([42]);

		friendsStore.toggleFriend(42);
		expect(friendsStore.isFriend(42)).toBe(false);
		expect(friendsStore.ids).toEqual([]);
	});

	it('exports friends to a simple JSON array of IDs', () => {
		friendsStore.addFriend(100);
		friendsStore.addFriend(200);
		const json = friendsStore.exportJson();
		const parsed = JSON.parse(json);
		expect(parsed).toEqual([100, 200]);
	});

	it('imports friends from simple JSON array', () => {
		friendsStore.addFriend(1);
		const importRes = friendsStore.importJson(JSON.stringify([2, 3, 4]));
		expect(importRes.success).toBe(true);
		expect(importRes.count).toBe(3);
		expect(friendsStore.ids).toEqual([1, 2, 3, 4]);

		// Overwrite import
		const overwriteRes = friendsStore.importJson(JSON.stringify([10, 20]), true);
		expect(overwriteRes.success).toBe(true);
		expect(friendsStore.ids).toEqual([10, 20]);
	});

	it('handles invalid JSON or non-array gracefully', () => {
		const res1 = friendsStore.importJson('invalid-json');
		expect(res1.success).toBe(false);

		const res2 = friendsStore.importJson('"just a string"');
		expect(res2.success).toBe(false);
	});
});
