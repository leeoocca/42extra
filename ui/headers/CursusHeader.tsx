import { useRouter } from "next/router";

import { Box, Flex, Heading, Text } from "@theme-ui/components";

import useAPI from "lib/useAPI";
import HeaderNav from "./HeaderNav";
import { CursusNavLinks } from "lib/NavLinks";

export default function CursusHeader() {
	const router = useRouter();
	const { slug } = router.query;

	const { data: cursus } = useAPI(`/v2/cursus/${slug}`);

	document.documentElement.style.setProperty("--nav", "");

	return (
		<>
			<Box p={3}>
				<Heading>{cursus ? cursus.name : slug}</Heading>
				<Flex sx={{ gap: 3 }}>
					<Text sx={{ fontFamily: "monospace" }}>
						#{cursus && cursus.id}
					</Text>
				</Flex>
			</Box>
			<HeaderNav navLinks={CursusNavLinks()} />
		</>
	);
}
