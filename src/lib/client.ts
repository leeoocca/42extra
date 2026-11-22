import { createAuthClient } from 'better-auth/svelte';
import { PUBLIC_BETTER_AUTH_URL } from '$app/env/public';

export const authClient = createAuthClient({
	baseURL: PUBLIC_BETTER_AUTH_URL
});

export const { signIn, signUp, signOut, useSession } = authClient;
