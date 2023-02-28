import { Box, Flex, Text } from "@theme-ui/components";
import getPrettyCountry from "lib/getPrettyCountry";
import { CampusNavLinks } from "lib/NavLinks";
import { useCampuses } from "lib/useAPI";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PageTitle from "ui/PageTitle";
import HeaderNav from "./HeaderNav";

export default function CampusHeader() {
	const {
		query: { id },
		route,
	} = useRouter();

	const { data: campuses } = useCampuses();
	const [title, setTitle] = useState<string | string[]>("");
	const [campus, setCampus] = useState({
		name: "Loading...",
		city: null,
		country: null,
	});

	useEffect(() => {
		if (campuses)
			setCampus(
				campuses.find((campus) => campus.id === parseInt(String(id)))
			);
	}, [campuses]);

	useEffect(() => {
		const routeArray = route.split("/");
		const page = routeArray[routeArray.length - 1];

		setTitle(
			page !== "[id]"
				? [campus.name, page.replace(/^\w/, (c) => c.toUpperCase())]
				: campus.name
		);
	}, [route, campus]);

	return (
		<>
			<PageTitle title={title} />
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
