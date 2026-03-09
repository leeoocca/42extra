import { FORTY_TWO_SCHOOL_CLIENT_ID, FORTY_TWO_SCHOOL_CLIENT_SECRET } from '$env/static/private';
import { SvelteKitAuth } from '@auth/sveltekit';
import FortyTwo from '@auth/sveltekit/providers/42-school';

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [
		FortyTwo({
			clientId: FORTY_TWO_SCHOOL_CLIENT_ID,
			clientSecret: FORTY_TWO_SCHOOL_CLIENT_SECRET
		})
	]
});
