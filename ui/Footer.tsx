import Link from "next/link";

import { Box, Link as TLink } from "@theme-ui/components";
import { REPO } from "lib/constants";

export default function Footer() {
	return (
		<Box
			as="footer"
			my={3}
			sx={{
				textAlign: "center",
				fontWeight: 300,
				fontSize: 12,
				color: "gray",
			}}
		>
			<TLink href={REPO}>42extra</TLink> — a project by{" "}
			<Link href="/users/lrocca" passHref>
				<TLink>lrocca</TLink>
			</Link>
		</Box>
	);
}

// about the project
// source code
// open an issue
// star on gh
