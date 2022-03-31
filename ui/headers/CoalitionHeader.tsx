import { useRouter } from "next/router";

import { Box, Flex, Heading, Text } from "@theme-ui/components";
import SVG from "react-inlinesvg";

import { Coalition } from "types/42";
import setPrimaryColor from "lib/setPrimaryColor";
import useAPI from "lib/useAPI";

export default function CoalitionHeader() {
	const router = useRouter();
	const { slug } = router.query;

	const { data } = useAPI<Coalition>(`/v2/coalitions/${slug}`);

	const coalition = data || {
		name: "Loading...",
		score: null,
		id: null,
		color: null,
		image_url: null,
	};

	setPrimaryColor(coalition.color);

	return (
		<Box p={3}>
			<SVG
				src={coalition.image_url}
				fill="white"
				width="4rem"
				height="4rem"
				className="object-contain w-16 h-16"
			/>
			<Heading>{coalition.name}</Heading>
			<Flex sx={{ gap: 3 }}>
				<Text sx={{ fontFamily: "monospace" }}>#{coalition.id}</Text>
				<Text>Score {coalition.score}</Text>
			</Flex>
		</Box>
	);
}
