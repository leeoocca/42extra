import { useEffect } from "react";
import { useRouter } from "next/router";

import { Box, Flex, Text } from "@theme-ui/components";

import { CampusNavLinks } from "lib/NavLinks";
import { setPrimaryColor } from "lib/color";
import { useCampuses } from "lib/useAPI";
import HeaderNav from "./HeaderNav";
import getPrettyCountry from "lib/getPrettyCountry";
import PageTitle from "ui/PageTitle";

export default function CampusHeader() {
	const {
		query: { id },
		route,
	} = useRouter();

	const { data: campuses } = useCampuses();

	const campus = campuses
		? campuses.find((campus) => campus.id === parseInt(String(id)))
		: { name: "Loading...", city: null, country: null };

	setPrimaryColor();

	let pageTitle: string | string[] = [];

	useEffect(() => {
		const routeArray = route.split("/");
		const pageName = routeArray[routeArray.length - 1];
		pageTitle = pageName !== "[id]" ? [campus.name, pageName] : campus.name;
		return () => setPrimaryColor();
	}, []);

	return (
		<>
			<PageTitle title={pageTitle} />
			<Box p={3}>
				<h1 className="text-3xl font-bold leading-relaxed">
					{campus.name}
				</h1>
				<Flex sx={{ gap: 3 }}>
					<Text>
						<Text variant="mono">#{id}</Text>
					</Text>
					{campus.city && (
						<Text>
							{campus.city}, {getPrettyCountry(campus.country)}
						</Text>
					)}
				</Flex>
			</Box>
			<HeaderNav navLinks={CampusNavLinks()} />
		</>
	);
}
