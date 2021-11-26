import { useEffect, useState } from "react";
import Link from "next/link";
import { Heading, Text, Flex, Link as TLink } from "@theme-ui/components";
import { AlertCircle, Frown, Home, Star } from "react-feather";
// try cmd + k
// open an issue if you think this is an error

export default function Custom404() {
	const [stars, setStars] = useState(null);

	useEffect(() => {
		fetch("https://api.github.com/repos/leeoocca/42extra")
			.then((r) => r.json())
			.then((r) => setStars(r.stargazers_count));
	}, []);

	return (
		<Flex
			sx={{
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				minHeight: "100vh",
			}}
		>
			<Frown size={42} />
			<Heading as="h1" my={3} sx={{ fontSize: 4 }}>
				Page Not Found
			</Heading>
			<Text sx={{ lineHeight: 2 }}>
				<code>if</code> you think this may be an error:
				<br />
				<TLink
					href="https://github.com/leeoocca/42extra/issues/new"
					target="_blank"
					rel="noopener noreferrer"
					sx={{
						color: "purple",
						display: "inline-flex",
						alignItems: "center",
						gap: 1,
						ml: 3,
					}}
				>
					<AlertCircle size={14} /> file an issue on GitHub
				</TLink>
				<br />
				<code>else</code>
				<br />
				<TLink
					href="https://github.com/leeoocca/42extra"
					target="_blank"
					rel="noopener noreferrer"
					sx={{
						color: "yellow",
						display: "inline-flex",
						alignItems: "center",
						gap: 1,
						ml: 3,
					}}
				>
					<Star size={14} />
					++ the {stars ? stars : "x"} stars on GitHub
				</TLink>
				<br />
				<Text as="code" ml={3}>
					OR
				</Text>{" "}
				<Link href="/">
					<TLink
						sx={{
							cursor: "pointer",
							display: "inline-flex",
							alignItems: "center",
							gap: 1,
						}}
					>
						<Home size={14} /> go home
					</TLink>
				</Link>
			</Text>
		</Flex>
	);
}

Custom404.shell = false;
