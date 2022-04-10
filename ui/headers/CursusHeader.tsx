import { Box, Flex, Heading, Text } from "@theme-ui/components";
import isNumber from "lib/isNumber";
import { CursusNavLinks } from "lib/NavLinks";
import { useCursuses } from "lib/useAPI";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Cursus } from "types/42";
import PageTitle from "ui/PageTitle";
import HeaderNav from "./HeaderNav";

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

	const [title, setTitle] = useState<string | string[]>("");

	useEffect(() => {
		const routeArray = route.split("/");
		const page = routeArray[routeArray.length - 1];
		setTitle(
			page !== "[slug]"
				? [cursusName, page.replace(/^\w/, (c) => c.toUpperCase())]
				: cursusName
		);
	}, [route]);

	return (
		<>
			<PageTitle title={title} />
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
