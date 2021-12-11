import { useRouter } from "next/router";

import { Box, Flex, Heading, Text } from "@theme-ui/components";

import { CursusNavLinks } from "lib/NavLinks";
import HeaderNav from "./HeaderNav";
import setPrimaryColor from "lib/setPrimaryColor";
import useAPI from "lib/useAPI";

export default function CursusHeader() {
	const router = useRouter();
	const { slug } = router.query;

	const { data: cursus } = useAPI(`/v2/cursus/${slug}`);

	setPrimaryColor();

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
