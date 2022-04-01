import { useRouter } from "next/router";

import { Box, Flex, Heading, Text } from "@theme-ui/components";

import { Cursus } from "types/42";
import { CursusNavLinks } from "lib/NavLinks";
import { setPrimaryColor } from "lib/color";
import HeaderNav from "./HeaderNav";
import useAPI from "lib/useAPI";

export default function CursusHeader() {
	const {
		query: { slug },
	} = useRouter();

	const { data: cursus } = useAPI<Cursus>(`/v2/cursus/${slug}`);

	setPrimaryColor();

	return (
		<>
			<Box p={3}>
				<Heading>{cursus ? cursus.name : slug}</Heading>
				<Flex sx={{ gap: 3 }}>
					<Text variant="mono">#{cursus && cursus.id}</Text>
				</Flex>
			</Box>
			<HeaderNav navLinks={CursusNavLinks()} />
		</>
	);
}
