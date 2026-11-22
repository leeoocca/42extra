import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	BETTER_AUTH_42_SCHOOL_ID: { static: true },
	BETTER_AUTH_42_SCHOOL_SECRET: { static: true },
	PUBLIC_BETTER_AUTH_URL: { public: true, static: true }
});
