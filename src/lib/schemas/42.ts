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
		current_team_id: z.number().nullable().optional(),
		project: FtProjectDetailsSchema,
		cursus_ids: z.array(z.number()).default([]),
		marked_at: z.string().nullable().optional(),
		marked: z.boolean().default(false),
		retries: z.number().default(0),
		created_at: z.string().optional(),
		updated_at: z.string().optional()
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
