import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { ArrowRight, Search } from "lucide-react";
import { Action, useKBar, useRegisterActions } from "kbar";
import { Box, Container } from "@theme-ui/components";
import { useSession } from "next-auth/react";

import { ICON_SIZE } from "lib/actions";
import CommandBar from "./CommandBar";
import Footer from "./Footer";
import Header from "./headers/Header";
import Loader from "./Loader";
import StatusBar from "./StatusBar";

export default function Shell({ children, headerContent }) {
	const { status } = useSession({
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
