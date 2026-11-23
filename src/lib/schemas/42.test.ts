import { describe, it, expect } from 'vitest';
import {
	FtUserMeSchema,
	FtCampusSchema,
	FtCampusListSchema,
	FtImageSchema,
	FtImageVersionsSchema,
	FtCursusUserSchema,
	FtProjectUserSchema,
	FtAchievementSchema
} from './42.js';

describe('42 API Zod Schemas', () => {
	describe('FtImageSchema', () => {
		it('parses valid image with versions', () => {
			const payload = {
				link: 'https://cdn.intra.42.fr/users/8372bca/norminet.jpg',
				versions: {
					large: 'https://cdn.intra.42.fr/users/large_norminet.jpg',
					medium: 'https://cdn.intra.42.fr/users/medium_norminet.jpg',
					small: 'https://cdn.intra.42.fr/users/small_norminet.jpg',
					micro: 'https://cdn.intra.42.fr/users/micro_norminet.jpg'
				}
			};

			const result = FtImageSchema.safeParse(payload);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.link).toBe(payload.link);
				expect(result.data.versions?.medium).toBe(payload.versions.medium);
			}
		});

		it('parses null link with nullable versions gracefully', () => {
			const payload = {
				link: null,
				versions: {
					large: null,
					medium: null,
					small: null,
					micro: null
				}
			};

			const result = FtImageSchema.safeParse(payload);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.link).toBeNull();
			}
		});

		it('preserves unknown fields with .loose()', () => {
			const payload = {
				link: 'https://cdn.intra.42.fr/users/norminet.jpg',
				extra_cdn_metadata: { hash: 'abc123' }
			};

			const result = FtImageSchema.safeParse(payload);
			expect(result.success).toBe(true);
			if (result.success) {
				expect((result.data as any).extra_cdn_metadata?.hash).toBe('abc123');
			}
		});
	});

	describe('FtCampusSchema & FtCampusListSchema', () => {
		const sampleCampus = {
			id: 1,
			name: 'Paris',
			time_zone: 'Europe/Paris',
			language: { id: 1, name: 'Français', identifier: 'fr' },
			users_count: 3200,
			active: true,
			public: true,
			email_extension: '42.fr',
			country: 'France',
			city: 'Paris',
			website: 'https://42.fr',
			address: '96 Boulevard Bessières',
			zip: '75017'
		};

		it('parses complete campus payload', () => {
			const result = FtCampusSchema.safeParse(sampleCampus);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe('Paris');
				expect(result.data.city).toBe('Paris');
			}
		});

		it('handles missing optional fields (nullable website and address)', () => {
			const minimalCampus = {
				id: 42,
				name: '42 Remote',
				website: null,
				address: null,
				zip: null
			};

			const result = FtCampusSchema.safeParse(minimalCampus);
			expect(result.success).toBe(true);
		});

		it('parses campus list array', () => {
			const campusList = [sampleCampus, { id: 2, name: '42 Berlin', city: 'Berlin' }];
			const result = FtCampusListSchema.safeParse(campusList);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toHaveLength(2);
			}
		});
	});

	describe('FtUserMeSchema', () => {
		const validUserMe = {
			id: 4242,
			email: 'norminet@student.42.fr',
			login: 'norminet',
			first_name: 'Norminette',
			last_name: 'Cat',
			usual_full_name: 'Norminet',
			usual_first_name: null,
			url: 'https://api.intra.42.fr/v2/users/norminet',
			phone: null,
			displayname: 'Norminet Cat',
			kind: 'student',
			image: {
				link: 'https://cdn.intra.42.fr/users/norminet.jpg',
				versions: {
					large: 'https://cdn.intra.42.fr/users/large_norminet.jpg',
					medium: 'https://cdn.intra.42.fr/users/medium_norminet.jpg',
					small: 'https://cdn.intra.42.fr/users/small_norminet.jpg',
					micro: 'https://cdn.intra.42.fr/users/micro_norminet.jpg'
				}
			},
			'staff?': false,
			correction_point: 5,
			pool_month: 'november',
			pool_year: '2023',
			location: 'e1r1p1',
			wallet: 150,
			anonymize_date: null,
			data_erasure_date: null,
			created_at: '2023-11-01T10:00:00.000Z',
			updated_at: '2026-11-20T12:00:00.000Z',
			alumnized_at: null,
			'alumni?': false,
			'active?': true,
			groups: [],
			cursus_users: [
				{
					id: 101,
					begin_at: '2023-11-01T10:00:00.000Z',
					end_at: null,
					grade: 'Learner',
					level: 8.42,
					skills: [
						{ id: 1, name: 'Algorithms & AI', level: 6.2 },
						{ id: 2, name: 'Imperative programming', level: 9.8 }
					],
					cursus_id: 21,
					has_coalition: true,
					cursus: {
						id: 21,
						name: '42cursus',
						slug: '42cursus'
					}
				}
			],
			projects_users: [
				{
					id: 201,
					occurrence: 0,
					final_mark: 125,
					status: 'finished',
					validated: true,
					current_team_id: 301,
					project: {
						id: 1337,
						name: 'ft_transcendence',
						slug: 'ft_transcendence',
						parent_id: null
					},
					cursus_ids: [21],
					marked_at: '2024-05-10T14:30:00.000Z',
					marked: true,
					retries: 0
				}
			],
			achievements: [
				{
					id: 42,
					name: 'Welcome, Learner!',
					description: 'Passed the Piscine',
					tier: 'easy',
					kind: 'scolartity',
					visible: true,
					image: '/images/achievements/piscine.svg',
					nbr_of_success: 1
				}
			],
			titles: [{ id: 1, name: 'The Mascot %login' }],
			titles_users: [{ id: 1, user_id: 4242, title_id: 1, selected: true }],
			campus: [{ id: 1, name: 'Paris' }],
			campus_users: [{ id: 1, user_id: 4242, campus_id: 1, is_primary: true }]
		};

		it('parses realistic 42 /v2/me payload', () => {
			const result = FtUserMeSchema.safeParse(validUserMe);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.login).toBe('norminet');
				expect(result.data.correction_point).toBe(5);
				expect(result.data.cursus_users).toHaveLength(1);
				expect(result.data.cursus_users[0].skills).toHaveLength(2);
				expect(result.data.projects_users[0].final_mark).toBe(125);
			}
		});

		it('preserves unknown upstream fields with .loose()', () => {
			const userWithNewFields = {
				...validUserMe,
				future_42_feature_badge: 'ai_pioneer',
				internal_school_id: 9999
			};

			const result = FtUserMeSchema.safeParse(userWithNewFields);
			expect(result.success).toBe(true);
			if (result.success) {
				expect((result.data as any).future_42_feature_badge).toBe('ai_pioneer');
				expect((result.data as any).internal_school_id).toBe(9999);
			}
		});

		it('fails when required identification fields are missing or invalid', () => {
			const invalidUser = {
				...validUserMe,
				id: 'not-a-number' as any
			};

			const result = FtUserMeSchema.safeParse(invalidUser);
			expect(result.success).toBe(false);
		});

		it('fails when email is missing', () => {
			const { email, ...missingEmailUser } = validUserMe;
			const result = FtUserMeSchema.safeParse(missingEmailUser);
			expect(result.success).toBe(false);
		});
	});
});
