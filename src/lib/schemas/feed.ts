import { z } from 'zod';
import { FtImageSchema } from './42.js';

export const FeedActorSchema = z
	.object({
		id: z.number().optional(),
		login: z.string(),
		displayname: z.string().optional(),
		image: FtImageSchema.optional()
	})
	.loose();

export const FeedItemKindSchema = z.enum([
	'project_user',
	'location',
	'event',
	'quest_user',
	'achievement_user'
]);

export const FeedItemSchema = z
	.object({
		id: z.string(),
		kind: FeedItemKindSchema,
		timestamp: z.string(),
		actor: FeedActorSchema.optional(),
		title: z.string(),
		subtitle: z.string().optional(),
		status: z.string().optional(),
		mark: z.number().nullable().optional(),
		isValidated: z.boolean().optional(),
		link: z.string().optional(),
		metadata: z.record(z.string(), z.unknown()).optional()
	})
	.loose();

export const FeedResponseSchema = z
	.object({
		items: z.array(FeedItemSchema),
		from: z.string(),
		to: z.string(),
		nextFrom: z.string(),
		nextTo: z.string(),
		hasMore: z.boolean()
	})
	.loose();

export type FeedActor = z.infer<typeof FeedActorSchema>;
export type FeedItemKind = z.infer<typeof FeedItemKindSchema>;
export type FeedItem = z.infer<typeof FeedItemSchema>;
export type FeedResponse = z.infer<typeof FeedResponseSchema>;
