import { SvelteKitAuth } from '@auth/sveltekit';
import FortyTwo from '@auth/sveltekit/providers/42-school';

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [FortyTwo]
});
