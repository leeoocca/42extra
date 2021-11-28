import { Button, Grid } from "@theme-ui/components";
import { signIn } from "next-auth/react";

export default function SignIn() {
	return (
		<Grid sx={{ placeItems: "center", height: "calc(100vh - 2rem)" }}>
			<Button
				onClick={() => signIn("42")}
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
