import { Box, Container, Flex, IconButton, Text } from "@theme-ui/components";
import { useKBar } from "kbar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Avatar from "./Avatar";
import Logo from "./Logo";

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
				"& div": {
					flexGrow: 1,
					flexBasis: 0,
				},
			}}
		>
			<Box>
				<Link href="/" passHref>
					<IconButton
						sx={{
							"& > svg": {
								width: "2rem",
								mr: "auto",
								fill:
									process.env.NEXT_PUBLIC_DEV === "true"
										? "primary"
										: "currentColor",
							},
						}}
					>
						<Logo />
					</IconButton>
				</Link>
			</Box>
			<Text
				as="kbd"
				variant="kbd"
				sx={{
					opacity: "75%",
					cursor: "pointer",
					display: "flex",
					"& kbd": {
						display: "flex",
					},
				}}
				onClick={query.toggle}
			>
				<kbd>{mac ? "⌘" : "Ctrl"}</kbd>
				<kbd>K</kbd>
			</Text>
			<Flex
				sx={{
					gap: 2,
					alignItems: "center",
					justifyContent: "end",
				}}
			>
				<Link href={`/users/${session.user.login}`} passHref>
					<Avatar url={session.user.image} size={25} />
				</Link>
			</Flex>
		</Container>
	);
}
