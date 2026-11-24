const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const STORAGE_KEY = '42extra_friend_ids';

class FriendsStore {
	ids = $state<number[]>([]);
	private initialized = false;

	constructor() {
		if (isBrowser) {
			this.load();
		}
	}

	load() {
		if (!isBrowser) return;
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) {
					// Ensure array of positive integers, deduplicated
					const validIds = Array.from(
						new Set(
							parsed
								.map((x) => (typeof x === 'number' ? x : parseInt(String(x), 10)))
								.filter((n) => !isNaN(n) && Number.isInteger(n) && n > 0)
						)
					);
					this.ids = validIds;
				} else {
					this.ids = [];
				}
			} else {
				this.ids = [];
			}
		} catch (e) {
			console.error('Failed to load friends from localStorage:', e);
			this.ids = [];
		}
		this.initialized = true;
	}

	private save() {
		if (!isBrowser) return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(this.ids));
		} catch (e) {
			console.error('Failed to save friends to localStorage:', e);
		}
	}

	isFriend(id: number): boolean {
		return this.ids.includes(id);
	}

	addFriend(id: number) {
		if (typeof id !== 'number' || isNaN(id) || id <= 0) return;
		if (!this.ids.includes(id)) {
			this.ids = [...this.ids, id];
			this.save();
		}
	}

	removeFriend(id: number) {
		this.ids = this.ids.filter((x) => x !== id);
		this.save();
	}

	toggleFriend(id: number) {
		if (this.isFriend(id)) {
			this.removeFriend(id);
		} else {
			this.addFriend(id);
		}
	}

	/**
	 * Export current friend IDs as a JSON string or trigger file download in browser
	 */
	exportJson(): string {
		return JSON.stringify(this.ids, null, 2);
	}

	downloadJson(filename = '42extra-friends.json') {
		if (!isBrowser) return;
		const jsonStr = this.exportJson();
		const blob = new Blob([jsonStr], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	/**
	 * Imports an array of IDs from JSON string or parsed object
	 * Merges or replaces depending on overwrite flag (default: merge)
	 */
	importJson(jsonContent: string, overwrite = false): { success: boolean; count: number; error?: string } {
		try {
			const parsed = JSON.parse(jsonContent);
			let incomingIds: number[] = [];

			if (Array.isArray(parsed)) {
				incomingIds = parsed
					.map((x) => (typeof x === 'number' ? x : parseInt(String(x), 10)))
					.filter((n) => !isNaN(n) && Number.isInteger(n) && n > 0);
			} else if (parsed && typeof parsed === 'object' && Array.isArray((parsed as any).friends)) {
				// Also handle { "friends": [1, 2, 3] } convenience format
				incomingIds = (parsed as any).friends
					.map((x: unknown) => (typeof x === 'number' ? x : parseInt(String(x), 10)))
					.filter((n: number) => !isNaN(n) && Number.isInteger(n) && n > 0);
			} else {
				return { success: false, count: 0, error: 'JSON must be a simple array of user IDs' };
			}

			const newSet = overwrite
				? new Set(incomingIds)
				: new Set([...this.ids, ...incomingIds]);

			this.ids = Array.from(newSet);
			this.save();

			return { success: true, count: incomingIds.length };
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : 'Invalid JSON file';
			return { success: false, count: 0, error: msg };
		}
	}

	clear() {
		this.ids = [];
		this.save();
	}
}

export const friendsStore = new FriendsStore();
