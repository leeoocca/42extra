import { useRouter } from "next/router";
import Link from "next/link";

import { Button, Grid, Text, Link as ThemeLink } from "@theme-ui/components";
import { signIn, useSession } from "next-auth/react";

import Logo from "ui/Logo";

export default function SignIn() {
	const { status } = useSession();

	const router = useRouter();
	const { callbackUrl } = router.query;

	if (status === "loading") return null;

	return (
		<Grid sx={{ placeItems: "center", minHeight: "100vh" }}>
			{status === "authenticated" ? (
				<Text sx={{ textAlign: "center", lineHeight: 2 }}>
					Already signed in.
					<br />
					<Link href="/" passHref>
						<ThemeLink sx={{ cursor: "pointer" }}>
							Go home
						</ThemeLink>
					</Link>
				</Text>
			) : (
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
			)}
		</Grid>
	);
}

SignIn.shell = false;
