import { Box } from "@theme-ui/components";
import { BaseAction, useKBar, useRegisterActions } from "kbar";
import { ICON_SIZE } from "lib/actions";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArrowRight } from "react-feather";
import CommandBar from "./CommandBar";
import Footer from "./Footer";
import Loader from "./Loader";
import StatusBar from "./StatusBar";

export default function Shell({ children }) {
	const { status } = useSession({
		required: true,
		onUnauthenticated() {
			signIn();
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
			<Box
				sx={{
					width: "100%",
					flex: "1 1 auto",
				}}
			>
				{children}
			</Box>
			<Footer />
		</Box>
	);
}
