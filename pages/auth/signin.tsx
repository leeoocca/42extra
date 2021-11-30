import { Button, Grid } from "@theme-ui/components";
import { signIn } from "next-auth/react";

export default function SignIn() {
	const router = useRouter();
	const { callbackUrl } = router.query;

	return (
		<Grid sx={{ placeItems: "center", minHeight: "calc(100vh - 2rem)" }}>
				<Button
					onClick={() =>
						signIn("42", { callbackUrl: String(callbackUrl) })
					}
					sx={{
						bg: "transparent",
						border: "1px solid gray",
					}}
				>
				Sign in with 42
			</Button>
		</Grid>
	);
}

SignIn.shell = false;
