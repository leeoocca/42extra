import { useRouter } from "next/router";

import { Box, Flex, Text } from "@theme-ui/components";

import { CampusNavLinks } from "lib/NavLinks";
import { setPrimaryColor } from "lib/color";
import { useCampuses } from "lib/useAPI";
import HeaderNav from "./HeaderNav";
import useAPI from "lib/useAPI";

export default function CampusHeader() {
	const {
		query: { id },
	} = useRouter();

	const { data: campuses } = useCampuses();

	const c = campuses
		? campuses.find((campus) => campus.id === parseInt(String(id)))
		: { name: "Loading...", city: null, country: null };

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
