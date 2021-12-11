import { useRouter } from "next/router";

import { Box, Flex, Text } from "@theme-ui/components";

import { CampusNavLinks } from "lib/NavLinks";
import HeaderNav from "./HeaderNav";
import setPrimaryColor from "lib/setPrimaryColor";
import useAPI from "lib/useAPI";

export default function CampusHeader() {
	const {
		query: { id },
	} = useRouter();

	const { data: c = { name: "Loading...", city: null, country: null } } =
		useAPI(`/v2/campus/${id}`);

	setPrimaryColor();

	return (
		<>
			<Box p={3}>
				<h1 className="text-3xl font-bold leading-relaxed">{c.name}</h1>
				<Flex sx={{ gap: 3 }}>
					<Text sx={{ fontFamily: "monosFlexace" }}>#{id}</Text>
					{c.city && (
						<Text>
							{c.city}, {c.country}
						</Text>
					)}
				</Flex>
			</Box>
			<HeaderNav navLinks={CampusNavLinks()} />
		</>
	);
}
