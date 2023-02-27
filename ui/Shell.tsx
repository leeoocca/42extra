import { Alert, Box, Button, Container } from "@theme-ui/components";
import { Action, useKBar, useRegisterActions } from "kbar";
import { ICON_SIZE } from "lib/actions";
import { APIErrorOutlet, APIErrorProvider } from "lib/APIError";
import { ArrowRight, Search } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

export default function Shell({ children, headerContent, intraLink }) {
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
		setUser(queryValue.trim().toLowerCase());
	}, [queryValue]);

	const goToUser: Action = queryValue.length
		? {
				id: "goToUser",
				name: `Go to ${user}'s profile`,
				parent: "users",
				icon: <ArrowRight size={ICON_SIZE} />,
				perform: () => router.push(`/users/${user}`),
		  }
		: {
				id: "userSearch",
				name: "Start typing or open search page",
				parent: "users",
				icon: <Search size={ICON_SIZE} />,
				perform: () => router.push("/search/users"),
		  };

	useRegisterActions([goToUser], [user]);

	if (status === "loading") return <Loader />;

	return (
		<APIErrorProvider>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					minHeight: "100vh",
				}}
			>
				<CommandBar />
				<StatusBar />
				<Container
					pt={0}
					sx={{ display: "flex", flexDirection: "column", gap: 2 }}
				>
					{session.tokenExpires < Date.now() / 1000 && (
						<StaleSession />
					)}
					<APIErrorOutlet />
				</Container>
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
				<Footer intraLink={intraLink} />
			</Box>
		</APIErrorProvider>
	);
}
