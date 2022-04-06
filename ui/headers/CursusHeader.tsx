import { useEffect } from "react";
import { useRouter } from "next/router";

import { Box, Flex, Heading, Text } from "@theme-ui/components";

import { Cursus } from "types/42";
import { CursusNavLinks } from "lib/NavLinks";
import { useCursuses } from "lib/useAPI";
import HeaderNav from "./HeaderNav";
import isNumber from "lib/isNumber";
import PageTitle from "ui/PageTitle";

export function findCursus(id: string) {
	return (cursus: Cursus) =>
		isNumber(id) ? String(cursus.id) === id : cursus.slug === id;
}

export default function CursusHeader() {
	const {
		query: { slug },
		route,
	} = useRouter();

	const { data: cursuses } = useCursuses();

	const cursus = cursuses?.find(findCursus(String(slug)));

	const cursusName = cursus?.name || String(slug);


	setPrimaryColor();

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
				<Heading>{cursusName}</Heading>
				<Flex sx={{ gap: 3 }}>
					<Text variant="mono">#{cursus && cursus.id}</Text>
				</Flex>
			</Box>
			<HeaderNav navLinks={CursusNavLinks()} />
		</>
	);
}
