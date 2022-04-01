import { useRouter } from "next/router";

import { Box, Flex, Heading, Text } from "@theme-ui/components";

import { CampusNavLinks } from "lib/NavLinks";
import { setPrimaryColor } from "lib/color";
import { useCampuses } from "lib/useAPI";
import HeaderNav from "./HeaderNav";
import getPrettyCountry from "lib/getPrettyCountry";

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
				<Heading as="h1">{c.name}</Heading>
				<Flex sx={{ gap: 3 }}>
					<Text>
						#<Text as="pre">{id}</Text>
					</Text>
					{c.city && (
						<Text>
							{c.city}, {getPrettyCountry(c.country)}
						</Text>
					)}
				</Flex>
			</Box>
			<HeaderNav navLinks={CampusNavLinks()} />
		</>
	);
}
