import {
	Alert,
	Button,
	Flex,
	Grid,
	Link as ThemeLink,
	Text,
} from "@theme-ui/components";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "ui/Logo";
import PageTitle from "ui/PageTitle";

function Authenticated() {
	const {
		query: { callbackUrl },
		back,
	} = useRouter();

	return (
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
	);
}

function SignInButton() {
	/* const {
		query: { callbackUrl },
	} = useRouter(); */

	return (
		<Button
			onClick={() =>
				signIn("42" /* , { callbackUrl: `${callbackUrl}` } */)
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
	);
}

export default function SignIn() {
	const { status } = useSession();

	const {
		query: { error },
	} = useRouter();

	if (status === "loading") return null;

	return (
		<>
			<PageTitle title="Sign in" />
			<Grid
				sx={{
					placeItems: "center",
					minHeight: "100vh",
				}}
			>
				<Flex sx={{ flexDirection: "column", alignItems: "center" }}>
					{!!error && (
						<Alert bg="red" mb="3">
							Error: {error}
						</Alert>
					)}
					{status === "authenticated" ? (
						<Authenticated />
					) : (
						<SignInButton />
					)}
				</Flex>
			</Grid>
		</>
	);
}

SignIn.shell = false;
