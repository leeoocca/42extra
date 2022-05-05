import { Container, Link as TLink, Text } from "@theme-ui/components";
import { REPO } from "lib/constants";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Footer() {
	const { pathname } = useRouter();
	return (
		<Container
			as="footer"
			my={3}
			sx={{
				display: "flex",
				justifyContent: "space-between",
				fontWeight: 300,
				fontSize: 12,
				color: "gray",
			}}
		>
			<Text>
				<TLink href={REPO}>42extra</TLink> — a project by{" "}
				<Link href="/users/lrocca" passHref>
					<TLink>lrocca</TLink>
				</Link>
			</Text>
			<TLink
				href={`${REPO}/blob/main/pages${
					pathname === "/" ? "/index" : pathname
				}.tsx`}
			>
				Edit this page on GitHub
			</TLink>
		</Container>
	);
}

// about the project
// source code
// open an issue
// star on gh
