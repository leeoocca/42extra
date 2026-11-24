import { z } from 'zod';

export const FtImageVersionsSchema = z
	.object({
		large: z.string().nullable().optional(),
		medium: z.string().nullable().optional(),
		small: z.string().nullable().optional(),
		micro: z.string().nullable().optional()
	})
	.loose();

export const FtImageSchema = z
	.object({
		link: z.string().nullable().optional(),
		versions: FtImageVersionsSchema.optional()
	})
	.loose();

export const FtSkillSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		level: z.number()
	})
	.loose();

export const FtCursusSchema = z
	.object({
		id: z.number(),
		created_at: z.string().optional(),
		name: z.string(),
		slug: z.string(),
		kind: z.string().optional()
	})
	.loose();

export const FtCursusUserSchema = z
	.object({
		id: z.number(),
		begin_at: z.string().nullable().optional(),
		end_at: z.string().nullable().optional(),
		grade: z.string().nullable().optional(),
		level: z.number(),
		skills: z.array(FtSkillSchema).default([]),
		cursus_id: z.number(),
		has_coalition: z.boolean().optional(),
		cursus: FtCursusSchema
	})
	.loose();

export const FtProjectDetailsSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		slug: z.string(),
		parent_id: z.number().nullable().optional()
	})
	.loose();

export const FtProjectUserSchema = z
	.object({
		id: z.number(),
		occurrence: z.number().default(0),
		final_mark: z.number().nullable().optional(),
		status: z.string(),
		validated: z.boolean().nullable().optional(),
		'validated?': z.boolean().nullable().optional(),
		current_team_id: z.number().nullable().optional(),
		project: FtProjectDetailsSchema,
		cursus_ids: z.array(z.number()).default([]),
		marked_at: z.string().nullable().optional(),
		marked: z.boolean().default(false),
		retries: z.number().default(0),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		user: z
			.object({
				id: z.number(),
				login: z.string(),
				displayname: z.string().optional(),
				image: FtImageSchema.optional()
			})
			.loose()
			.optional()
	})
	.loose();

export const FtAchievementSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		description: z.string().optional(),
		tier: z.string().optional(),
		kind: z.string().optional(),
		visible: z.boolean().default(true),
		image: z.string().optional(),
		nbr_of_success: z.number().nullable().optional()
	})
	.loose();

export const FtCampusSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		time_zone: z.string().optional(),
		language: z.record(z.string(), z.unknown()).optional(),
		users_count: z.number().optional(),
		active: z.boolean().optional(),
		public: z.boolean().optional(),
		email_extension: z.string().optional(),
		country: z.string().optional(),
		city: z.string().optional(),
		website: z.string().nullable().optional(),
		address: z.string().nullable().optional(),
		zip: z.string().nullable().optional()
	})
	.loose();

export const FtCampusListSchema = z.array(FtCampusSchema);

export const FtCampusUserSchema = z
	.object({
		id: z.number(),
		user_id: z.number(),
		campus_id: z.number(),
		is_primary: z.boolean().default(false)
	})
	.loose();

export const FtTitleSchema = z
	.object({
		id: z.number(),
		name: z.string()
	})
	.loose();

export const FtTitleUserSchema = z
	.object({
		id: z.number(),
		user_id: z.number(),
		title_id: z.number(),
		selected: z.boolean().default(false)
	})
	.loose();

export const FtUserMeSchema = z
	.object({
		id: z.number(),
		email: z.string(),
		login: z.string(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		usual_full_name: z.string().optional(),
		usual_first_name: z.string().nullable().optional(),
		url: z.string().optional(),
		phone: z.string().nullable().optional(),
		displayname: z.string().optional(),
		kind: z.string().optional(),
		image: FtImageSchema.optional(),
		'staff?': z.boolean().optional(),
		correction_point: z.number().default(0),
		pool_month: z.string().nullable().optional(),
		pool_year: z.string().nullable().optional(),
		location: z.string().nullable().optional(),
		wallet: z.number().default(0),
		anonymize_date: z.string().nullable().optional(),
		data_erasure_date: z.string().nullable().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		alumnized_at: z.string().nullable().optional(),
		'alumni?': z.boolean().optional(),
		'active?': z.boolean().optional(),
		groups: z.array(z.record(z.string(), z.unknown())).default([]),
		cursus_users: z.array(FtCursusUserSchema).default([]),
		projects_users: z.array(FtProjectUserSchema).default([]),
		languages_users: z.array(z.record(z.string(), z.unknown())).default([]),
		achievements: z.array(FtAchievementSchema).default([]),
		titles: z.array(FtTitleSchema).default([]),
		titles_users: z.array(FtTitleUserSchema).default([]),
		campus: z.array(FtCampusSchema).default([]),
		campus_users: z.array(FtCampusUserSchema).default([])
	})
	.loose();

export const FtLocationSchema = z
	.object({
		id: z.number(),
		host: z.string(),
		begin_at: z.string(),
		end_at: z.string().nullable().optional(),
		primary: z.boolean().default(false),
		campus_id: z.number(),
		user: z
			.object({
				id: z.number(),
				login: z.string(),
				displayname: z.string().optional(),
				image: FtImageSchema.optional()
			})
			.loose()
			.optional()
	})
	.loose();

export const FtEventSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		description: z.string().optional(),
		location: z.string().nullable().optional(),
		kind: z.string(),
		max_people: z.number().nullable().optional(),
		nbr_subscribers: z.number().default(0),
		begin_at: z.string(),
		end_at: z.string(),
		campus_ids: z.array(z.number()).default([]),
		cursus_ids: z.array(z.number()).default([])
	})
	.loose();

export const FtProductSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		description: z.string().optional(),
		price: z.number(),
		quantity: z.number().nullable().optional(),
		kind: z.string().optional(),
		slug: z.string().optional(),
		image: z
			.object({
				url: z.string()
			})
			.loose()
			.nullable()
			.optional()
	})
	.loose();

export const FtCoalitionSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		slug: z.string(),
		image_url: z.string().nullable().optional(),
		cover_url: z.string().nullable().optional(),
		color: z.string().default('#4180DB'),
		score: z.number().default(0),
		user_id: z.number().nullable().optional()
	})
	.loose();

export const FtBlocSchema = z
	.object({
		id: z.number(),
		campus_id: z.number(),
		cursus_id: z.number(),
		squad_size: z.number().nullable().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		coalitions: z.array(FtCoalitionSchema).default([])
	})
	.loose();

export const FtClusterSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		description: z.string().nullable().optional(),
		campus_id: z.number().optional(),
		position: z.number().optional(),
		image: z.string().nullable().optional()
	})
	.loose();

export const FtScaleTeamSchema = z
	.object({
		id: z.number(),
		scale_id: z.number().optional(),
		comment: z.string().nullable().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		feedback: z.string().nullable().optional(),
		final_mark: z.number().nullable().optional(),
		flag: z
			.object({
				id: z.number(),
				name: z.string(),
				positive: z.boolean().optional(),
				icon: z.string().optional()
			})
			.loose()
			.nullable()
			.optional(),
		begin_at: z.string().nullable().optional(),
		filled_at: z.string().nullable().optional(),
		corrector: z
			.object({
				id: z.number(),
				login: z.string(),
				url: z.string().optional()
			})
			.loose()
			.nullable()
			.optional(),
		correcteds: z
			.array(
				z
					.object({
						id: z.number(),
						login: z.string(),
						url: z.string().optional()
					})
					.loose()
			)
			.default([]),
		questions_with_answers: z.array(z.unknown()).default([])
	})
	.loose();

export const FtTeamSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		url: z.string().optional(),
		final_mark: z.number().nullable().optional(),
		project_id: z.number().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		status: z.string().optional(),
		terminating_at: z.string().nullable().optional(),
		users: z
			.array(
				z
					.object({
						id: z.number(),
						login: z.string(),
						leader: z.boolean().optional(),
						occurrence: z.number().optional(),
						validated: z.boolean().optional(),
						projects_user_id: z.number().optional()
					})
					.loose()
			)
			.default([]),
		'locked?': z.boolean().optional(),
		'validated?': z.boolean().optional(),
		'closed?': z.boolean().optional(),
		repo_url: z.string().nullable().optional(),
		repo_uuid: z.string().nullable().optional(),
		locked_at: z.string().nullable().optional(),
		closed_at: z.string().nullable().optional(),
		project_session_id: z.number().nullable().optional(),
		scale_teams: z.array(FtScaleTeamSchema).default([])
	})
	.loose();

export type FtImageVersions = z.infer<typeof FtImageVersionsSchema>;
export type FtImage = z.infer<typeof FtImageSchema>;
export type FtSkill = z.infer<typeof FtSkillSchema>;
export type FtCursus = z.infer<typeof FtCursusSchema>;
export type FtCursusUser = z.infer<typeof FtCursusUserSchema>;
export type FtProjectDetails = z.infer<typeof FtProjectDetailsSchema>;
export type FtProjectUser = z.infer<typeof FtProjectUserSchema>;
export type FtAchievement = z.infer<typeof FtAchievementSchema>;
export type FtCampus = z.infer<typeof FtCampusSchema>;
export type FtCampusList = z.infer<typeof FtCampusListSchema>;
export type FtCampusUser = z.infer<typeof FtCampusUserSchema>;
export type FtTitle = z.infer<typeof FtTitleSchema>;
export type FtTitleUser = z.infer<typeof FtTitleUserSchema>;
export type FtUserMe = z.infer<typeof FtUserMeSchema>;
export type FtLocation = z.infer<typeof FtLocationSchema>;
export type FtEvent = z.infer<typeof FtEventSchema>;
export type FtProduct = z.infer<typeof FtProductSchema>;
export type FtCoalition = z.infer<typeof FtCoalitionSchema>;
export type FtBloc = z.infer<typeof FtBlocSchema>;
export type FtCluster = z.infer<typeof FtClusterSchema>;
export type FtScaleTeam = z.infer<typeof FtScaleTeamSchema>;
export type FtTeam = z.infer<typeof FtTeamSchema>;
