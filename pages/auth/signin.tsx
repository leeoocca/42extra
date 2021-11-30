import { Button, Grid } from "@theme-ui/components";
import { signIn } from "next-auth/react";
import Logo from "ui/Logo";

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
						display: "flex",
						gap: 1,
						"&:hover": {
							bg: "#fff2",
						},
					}}
				>
					Sign in with <Logo width={24} />
				</Button>
		</Grid>
	);
}

SignIn.shell = false;
