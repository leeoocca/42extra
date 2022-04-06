import { useRouter } from "next/router";
import Link from "next/link";

import { Button, Grid, Text, Link as ThemeLink } from "@theme-ui/components";
import { signIn, useSession } from "next-auth/react";

import Logo from "ui/Logo";
import PageTitle from "ui/PageTitle";

export default function SignIn() {
	const { status } = useSession();

	const {
		query: { callbackUrl },
		back,
	} = useRouter();

	if (status === "loading") return null;

	return (
		<>
			<PageTitle title="Sign in" />
			<Grid sx={{ placeItems: "center", minHeight: "100vh" }}>
				{status === "authenticated" ? (
					<Text sx={{ textAlign: "center", lineHeight: 2 }}>
						Already signed in.
						{callbackUrl && callbackUrl !== "/" && (
							<>
								<br />
								<Link href={String(callbackUrl)} passHref>
									<ThemeLink
										as="a"
										onClick={(e) => {
											// TODO check if it's actually better
											if (window.length > 2) {
												e.preventDefault();
												back();
											}
										}}
									>
										Go {window.length > 2 ? "back" : ""} to{" "}
										{callbackUrl}
									</ThemeLink>
								</Link>
							</>
						)}
						<br />
						<Link href="/" passHref>
							<ThemeLink as="a">Go home</ThemeLink>
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
		</>
	);
}

SignIn.shell = false;
