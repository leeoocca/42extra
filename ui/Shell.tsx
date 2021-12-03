import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { ArrowRight } from "react-feather";
import { BaseAction, useKBar, useRegisterActions } from "kbar";
import { Box, Container } from "@theme-ui/components";
import { signIn, useSession } from "next-auth/react";

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

	const { queryValue, query } = useKBar((state) => ({
		queryValue: state.searchQuery,
	}));
	const [user, setUser] = useState("");

	useEffect(() => {
		setUser(queryValue);
	}, [queryValue]);

	const userSearch: BaseAction[] = [
		{
			id: "userSearch",
			name: queryValue.length
				? `Go to ${queryValue}'s profile`
				: "Start typing an user's login",
			parent: "users",
			icon: <ArrowRight size={ICON_SIZE} />,
			perform: () =>
				queryValue.length && router.push(`/users/${queryValue}`),
		},
	];

	useRegisterActions(userSearch, [user]);

	if (status === "loading") return <Loader />;

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
			}}
			onTouchStart={(e) => {
				if (e.touches.length == 2) query.toggle();
			}}
		>
			<CommandBar />
			<StatusBar />
			<Header>{headerContent}</Header>
			<Container
				sx={{
					flex: "1 1 auto",
				}}
			>
				{children}
			</Container>
			<Footer />
		</Box>
	);
}
