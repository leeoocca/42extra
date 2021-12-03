import Link from "next/link";

import { IconButton, Container, Text, Flex } from "@theme-ui/components";
import { useKBar } from "kbar";
import { useSession } from "next-auth/react";

import Logo from "./Logo";
import Avatar from "./Avatar";
import { Disc } from "react-feather";

export default function StatusBar() {
	const { query } = useKBar();
	const { data: session } = useSession();

	const mac =
		typeof window !== "undefined" &&
		/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

	return (
		<Container
			as="nav"
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				"& button, a": {
					flexGrow: 1,
					flexBasis: 0,
				},
			}}
		>
			<Link href="/" passHref>
				<IconButton
					sx={{
						"& > svg": { width: "2rem", mr: "auto" },
					}}
				>
					<Logo />
				</IconButton>
			</Link>
			<Text
				as="kbd"
				variant="kbd"
				sx={{
					opacity: "50%",
					display: ["none", , "block"],
				}}
				onClick={query.toggle}
			>
				<kbd>{mac ? "⌘" : "Ctrl"}</kbd>
				<kbd>K</kbd>
			</Text>
			<Text
				as="small"
				sx={{
					opacity: "50%",
					display: ["flex", , "none"],
					alignItems: "center",
					gap: 1,
					fontSize: "0.7rem",
				}}
				onClick={query.toggle}
			>
				<Disc size={14} />
				Tap with two fingers
			</Text>
			<Link href={`/users/${session.user.login}`} passHref>
				<Flex
					as="a"
					sx={{ gap: 2, alignItems: "center", justifyContent: "end" }}
				>
					<Avatar url={session.user.image} size={20} />
					<p>{session.user.login}</p>
				</Flex>
			</Link>
		</Container>
	);
}
