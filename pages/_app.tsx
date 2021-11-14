import "styles/globals.css";
import { CSSProperties, useMemo } from "react";
import Router from "next/router";

import {
	BaseAction,
	KBarAnimator,
	KBarPortal,
	KBarPositioner,
	KBarProvider,
	KBarResults,
	KBarSearch,
	useMatches,
} from "kbar";
import { NO_GROUP } from "kbar/lib/useMatches";
import { SWRConfig } from "swr";
import { ThemeProvider, Text, Flex } from "theme-ui";
import ProgressBar from "@badrap/bar-of-progress";
import { Provider as SessionProvider } from "next-auth/client";

import theme from "lib/theme";
import fetcher from "lib/fetcher";
import { getLayout as getSimpleLayout } from "ui/layouts/SimpleLayout";

const progress = new ProgressBar({
	size: 2,
	color: "var(--theme-ui-colors-primary)",
	className: "bar-of-progress",
	delay: 0,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", () => {
	progress.finish();
	window.scrollTo(0, 0);
});
Router.events.on("routeChangeError", progress.finish);

const searchStyle: CSSProperties = {
	padding: "12px 16px",
	fontSize: "16px",
	width: "100%",
	boxSizing: "border-box",
	outline: "none",
	border: "none",
	background: "var(--theme-ui-colors-background)",
	color: "var(--theme-ui-colors-text)",
};

const animatorStyle: CSSProperties = {
	maxWidth: "500px",
	width: "100%",
	background: "var(--theme-ui-colors-background)",
	color: "var(--theme-ui-colors-text)",
	borderRadius: "8px",
	overflow: "hidden",
	boxShadow: "var(--shadow)",
};

export default function MyApp({ Component, pageProps }) {
	const getLayout = Component.getLayout || getSimpleLayout;

	const actions: BaseAction[] = [
		{
			id: "home",
			name: "Home",
			shortcut: ["h"],
			keywords: "",
			section: "Navigation",
			perform: () => Router.push("/"),
		},
		{
			id: "users",
			name: "Users",
			shortcut: ["u"],
			keywords: "login",
			section: "Navigation",
			perform: () => Router.push("/users"),
		},
		{
			id: "campus",
			name: "Campuses",
			shortcut: [],
			keywords: "",
			section: "Navigation",
			perform: () => Router.push("/campus"),
		},
		{
			id: "coalitions",
			name: "Coalitions",
			shortcut: [],
			keywords: "",
			section: "Navigation",
			perform: () => Router.push("/coalitions"),
		},
		{
			id: "cursus",
			name: "Cursuses",
			shortcut: [],
			keywords: "",
			section: "Navigation",
			perform: () => Router.push("/cursus"),
		},
		{
			id: "apps",
			name: "Apps",
			shortcut: [],
			keywords: "",
			section: "Navigation",
			perform: () => Router.push("/apps"),
		},
		{
			id: "intra",
			name: "Intra",
			shortcut: [],
			keywords: "",
			section: "External",
			perform: () =>
				window.open(
					"https://intra.42.fr",
					"_blank noopener noreferrer"
				),
		},
		{
			id: "slack",
			name: "Slack",
			shortcut: [],
			keywords: "",
			section: "External",
			perform: () =>
				window.open(
					"https://42born2code.slack.com",
					"_blank noopener noreferrer"
				),
		},
		{
			id: "awesome",
			name: "Awesome 42",
			shortcut: ["a", "w"],
			keywords: "",
			section: "External",
			perform: () =>
				window.open(
					"https://github.com/leeoocca/awesome-42",
					"_blank noopener noreferrer"
				),
		},
		{
			id: "github",
			name: "GitHub",
			shortcut: ["g", "h"],
			keywords: "repository source code",
			section: "External",
			perform: () =>
				window.open(
					"https://github.com/leeoocca/42extra",
					"_blank noopener noreferrer"
				),
		},
		{
			id: "theme",
			name: "Theme customizer",
			shortcut: ["t"],
			keywords: "",
			section: "Preferences",
			perform: () => Router.push("/theme"),
		},
	];

	return (
		<SessionProvider
			session={pageProps.session}
			options={{
				clientMaxAge: 60 * 60,
			}}
		>
			<SWRConfig
				value={{
					fetcher: fetcher,
					onError: (err) => {
						console.error(err);
					},
					revalidateOnFocus: false,
					dedupingInterval: 60 * 1000,
					errorRetryInterval: 2000,
				}}
			>
				<ThemeProvider theme={theme}>
					<KBarProvider actions={actions}>
						<KBarPortal>
							<KBarPositioner>
								<KBarAnimator style={animatorStyle}>
									<KBarSearch style={searchStyle} />
									<RenderResults />
								</KBarAnimator>
							</KBarPositioner>
						</KBarPortal>
						{getLayout(<Component {...pageProps} />)}
					</KBarProvider>
				</ThemeProvider>
			</SWRConfig>
		</SessionProvider>
	);
}

function RenderResults() {
	const groups = useMatches();
	const flattened = useMemo(
		() =>
			groups.reduce((acc, curr) => {
				acc.push(curr.name);
				acc.push(...curr.actions);
				return acc;
			}, []),
		[groups]
	);

	return (
		<KBarResults
			items={flattened.filter((i) => i !== NO_GROUP)}
			onRender={({ item, active }) =>
				typeof item === "string" ? (
					<Text
						sx={{
							textTransform: "uppercase",
							padding: "8px 16px",
							fontSize: "10px",
							opacity: 0.5,
						}}
					>
						{item}
					</Text>
				) : (
					<Flex
						sx={{
							backgroundColor: active ? "muted" : "transparent",
							// maxHeight: 400,
							// overflow: "auto",
							justifyContent: "space-between",
							padding: "12px 16px",
							borderLeft: "2px solid",
							borderLeftColor: active ? "text" : "transparent",
							alignItems: "center",
							cursor: "pointer",
						}}
					>
						<Text>{item.name}</Text>
						{item.shortcut?.length ? (
							<div
								aria-hidden
								style={{
									display: "grid",
									gridAutoFlow: "column",
									gap: "4px",
								}}
							>
								{item.shortcut.map((sc) => (
									<Text
										key={sc}
										as="kbd"
										sx={{
											padding: "4px 6px",
											background:
												"rgba(255 255 255 / .1)",
											borderRadius: "4px",
											fontSize: 14,
										}}
									>
										{sc}
									</Text>
								))}
							</div>
						) : null}
					</Flex>
				)
			}
		/>
	);
}
