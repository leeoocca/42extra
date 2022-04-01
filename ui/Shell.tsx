import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Action, useKBar, useRegisterActions } from "kbar";
import { Alert, Box, Button, Container } from "@theme-ui/components";
import { ArrowRight, Search } from "lucide-react";
import { signIn, useSession } from "next-auth/react";

import { ICON_SIZE } from "lib/actions";
import CommandBar from "./CommandBar";
import Footer from "./Footer";
import Header from "./headers/Header";
import Loader from "./Loader";
import StatusBar from "./StatusBar";

const StaleSession = () => (
	<Alert sx={{ display: "flex", justifyContent: "space-between" }}>
		<span>Stale session</span>
		<Button
			bg="transparent"
			sx={{
				textTransform: "uppercase",
				fontSize: 1,
				fontWeight: "heading",
			}}
			onClick={() => signIn("42")}
		>
			Sign back in
		</Button>
	</Alert>
);

export default function Shell({ children, headerContent }) {
	const { status, data: session } = useSession({
		required: true,
		onUnauthenticated() {
			router.push({
				pathname: "/auth/signin",
				query: {
					callbackUrl: `${router.asPath}`,
				},
			});
		},
	});

	const router = useRouter();

	const { queryValue } = useKBar((state) => ({
		queryValue: state.searchQuery,
	}));
	const [user, setUser] = useState("");

	useEffect(() => {
		setUser(queryValue);
	}, [queryValue]);

	const goToUser: Action = queryValue.length
		? {
				id: "goToUser",
				name: `Go to ${queryValue}'s profile`,
				parent: "users",
				icon: <ArrowRight size={ICON_SIZE} />,
				perform: () => router.push(`/users/${queryValue}`),
		  }
		: {
				id: "userSearch",
				name: "Start typing or open search page",
				parent: "users",
				icon: <Search size={ICON_SIZE} />,
				perform: () => router.push("/search/user"),
		  };

	useRegisterActions([goToUser], [user]);

	if (status === "loading") return <Loader />;

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
			}}
		>
			<CommandBar />
			<StatusBar />
			{session.tokenExpires < Date.now() / 1000 && <StaleSession />}
			<Header>{headerContent}</Header>
			<Container
				as="main"
				sx={{
					flex: "1 1 auto",
					display: "flex",
					flexDirection: "column",
				}}
			>
				{children}
			</Container>
			<Footer />
		</Box>
	);
}
