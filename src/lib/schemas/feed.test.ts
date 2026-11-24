import { describe, it, expect } from 'vitest';
import { FeedItemSchema, FeedResponseSchema } from './feed.js';
import { formatRelativeTime, formatActualDate } from '#lib/utils.js';

describe('Feed Schemas & Utilities', () => {
	it('validates a normalized project_user feed item', () => {
		const rawItem = {
			id: 'project_user-1234',
			kind: 'project_user',
			timestamp: new Date().toISOString(),
			actor: {
				id: 42,
				login: 'norminet',
				displayname: 'Norminette'
			},
			title: 'Passed ft_printf',
			mark: 100,
			isValidated: true,
			status: 'finished',
			link: '/projects/42cursus-ft_printf'
		};

		const parsed = FeedItemSchema.safeParse(rawItem);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.id).toBe('project_user-1234');
			expect(parsed.data.kind).toBe('project_user');
			expect(parsed.data.mark).toBe(100);
			expect(parsed.data.isValidated).toBe(true);
		}
	});

	it('validates a normalized location feed item', () => {
		const rawItem = {
			id: 'location-5678',
			kind: 'location',
			timestamp: new Date().toISOString(),
			actor: {
				login: 'student1'
			},
			title: 'Logged in at e1r2p3',
			status: 'active',
			metadata: {
				host: 'e1r2p3',
				primary: true
			}
		};

		const parsed = FeedItemSchema.safeParse(rawItem);
		expect(parsed.success).toBe(true);
	});

	it('validates a FeedResponse payload', () => {
		const rawResponse = {
			items: [
				{
					id: 'event-10',
					kind: 'event',
					timestamp: new Date().toISOString(),
					title: 'Workshop: Docker',
					subtitle: 'Amphi • 20 registered'
				}
			],
			from: '2026-11-23T12:00:00.000Z',
			to: '2026-11-24T12:00:00.000Z',
			nextFrom: '2026-11-22T12:00:00.000Z',
			nextTo: '2026-11-23T12:00:00.000Z',
			hasMore: true
		};

		const parsed = FeedResponseSchema.safeParse(rawResponse);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.items).toHaveLength(1);
			expect(parsed.data.hasMore).toBe(true);
		}
	});

	it('correctly formats relative timestamps', () => {
		const now = Date.now();
		expect(formatRelativeTime(new Date(now - 10 * 1000))).toBe('just now');
		expect(formatRelativeTime(new Date(now - 5 * 60 * 1000))).toBe('5m ago');
		expect(formatRelativeTime(new Date(now - 3 * 3600 * 1000))).toBe('3h ago');
		expect(formatRelativeTime(new Date(now - 2 * 24 * 3600 * 1000))).toBe('2d ago');
		expect(formatRelativeTime(undefined)).toBe('');
		expect(formatRelativeTime('invalid-date')).toBe('');
	});

	it('correctly formats actual date and time', () => {
		const d = new Date('2026-11-24T15:46:00.000Z');
		const formatted = formatActualDate(d);
		expect(formatted).toBeTruthy();
		expect(formatActualDate(undefined)).toBe('');
		expect(formatActualDate('invalid-date')).toBe('');
	});
});
