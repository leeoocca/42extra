import { Box, Flex, Heading, Text } from "@theme-ui/components";
import { useRouter } from "next/router";

import SVG from "react-inlinesvg";

import hexToRGB from "lib/hexToRGB";
import useAPI from "lib/useAPI";

export default function CoalitionHeader() {
	const router = useRouter();
	const { slug } = router.query;

	const { data: coalition } = useAPI(`/v2/coalitions/${slug}`);

	if (!coalition) return null;

	document.documentElement.style.setProperty(
		"--nav",
		hexToRGB(coalition.color)
	);

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
