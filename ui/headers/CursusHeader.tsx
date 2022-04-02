import { useEffect } from "react";
import { useRouter } from "next/router";

import { Box, Flex, Heading, Text } from "@theme-ui/components";

import { CursusNavLinks } from "lib/NavLinks";
import { setPrimaryColor } from "lib/color";
import { useCursuses } from "lib/useAPI";
import HeaderNav from "./HeaderNav";
import PageTitle from "ui/PageTitle";

export default function CursusHeader() {
	const {
		query: { slug },
		route,
	} = useRouter();

	const { data: cursuses } = useCursuses();

	const cursus = cursuses.find((cursus) => cursus.slug === slug) || null;

	setPrimaryColor();

	let pageTitle: string | string[] = [];

	useEffect(() => {
		const routeArray = route.split("/");
		const pageName = routeArray[routeArray.length - 1];
		pageTitle =
			pageName !== "[slug]" ? [cursus.name, pageName] : cursus.name;
	}, []);

	return (
		<>
			<PageTitle title={pageTitle} />
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
