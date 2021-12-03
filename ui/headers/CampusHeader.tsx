import { useRouter } from "next/router";

import { Box, Flex, Text } from "@theme-ui/components";

import useAPI from "lib/useAPI";
import HeaderNav from "./HeaderNav";
import { CampusNavLinks } from "lib/NavLinks";

export default function CampusHeader() {
	const router = useRouter();
	const { id } = router.query;

	const { data: c } = useAPI(`/v2/campus/${id}`);

	document.documentElement.style.setProperty("--nav", "");

	if (!c) return null;

	return (
		<>
			<Box p={3}>
				<h1 className="text-3xl font-bold leading-relaxed">{c.name}</h1>
				<Flex sx={{ gap: 3 }}>
					<Text sx={{ fontFamily: "monosFlexace" }}>#{c.id}</Text>
					<Text>
						{c.city}, {c.country}
					</Text>
				</Flex>
			</Box>
			<HeaderNav navLinks={CampusNavLinks()} />
		</>
	);
}
