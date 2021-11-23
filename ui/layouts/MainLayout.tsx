import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";

import { Box } from "@theme-ui/components";
import { BaseAction, useKBar, useRegisterActions } from "kbar";

import Footer from "ui/Footer";
import Loader from "ui/Loader";
import StatusBar from "ui/StatusBar";
import { ArrowRight } from "react-feather";
import { ICON_SIZE } from "lib/actions";

interface Props {
	children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
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

	var content = (
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

	return (
		<>
			<Head>
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				<link rel="manifest" href="/site.webmanifest" />

				<meta name="theme-color" content="#000000" />
				<meta
					name="apple-mobile-web-app-status-bar-style"
					content="black-translucent"
				/>
				<link
					rel="mask-icon"
					href="/safari-pinned-tab.svg"
					color="#01babc"
				/>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
			</Head>
			{status === "loading" ? <Loader /> : content}
		</>
	);
}

export const getLayout = (page: React.ReactNode) => (
	<MainLayout>{page}</MainLayout>
);
