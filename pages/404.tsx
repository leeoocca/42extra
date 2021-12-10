import { SVGProps, useEffect, useState } from "react";
import Link from "next/link";

import { Heading, Text, Flex, Link as ThemeLink } from "@theme-ui/components";

const SadMac = (props: SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" {...props}>
		<path
			d="M2 .5V1H1v1H0v26h1v4h22v-4h1V2h-1V1h-1V0H2v.5m20 1V2h1v26H1V2h1V1h20v.5m-18 2V4H3v14h1v1h16v-1h1V4h-1V3H4v.5M20 11v7H4V4h16v7M6 7.5V8h1v1H6v1h1V9h1v1h1V9H8V8h1V7H8v1H7V7H6v.5m8 0V8h1v1h-1v1h1V9h1v1h1V9h-1V8h1V7h-1v1h-1V7h-1v.5m-5 4v.5h1v1h2v-1h1v-1h-1v1h-2v-1H9v.5m0 3v.5H8v1h1v-1h5v1h2v1h1v-1h-1v-1h-2v-1H9v.5m5 9v.5h6v-1h-6v.5m-11 1v.5h2v-1H3v.5M22 30v1H2v-2h20v1"
			fillRule="evenodd"
		/>
	</svg>
);

export default function Custom404() {
	return (
		<Flex
			sx={{
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				flex: "1 1 auto",
				lineHeight: 1.5,
			}}
		>
			<SadMac
				fill="currentColor"
				height={100}
				style={{ marginBottom: "1rem" }}
			/>
			<Heading as="h1" sx={{ fontSize: 4, lineHeight: 1.5 }}>
				404
			</Heading>
			<Text>Not found.</Text>
			<Link href="/" passHref>
				<ThemeLink as="a">Go home</ThemeLink>
			</Link>
		</Flex>
	);
}

// TODO
// try cmd + k
// open an issue if you think this is an error
// GH repo stars
