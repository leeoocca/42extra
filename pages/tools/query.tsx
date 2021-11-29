import { useState } from "react";

import { useSession } from "next-auth/react";
import {
	Alert,
	Button,
	Flex,
	Input,
	Box,
	Label,
	Grid,
	Text,
} from "@theme-ui/components";
import { AlertOctagon } from "react-feather";

export default function Query() {
	const { data: session } = useSession();

	const [query, setQuery] = useState("");
	const [data, setData] = useState(undefined);
	const [error, setError] = useState(null);

	async function handleSubmit(e) {
		e.preventDefault();
		setData(null);
		setError(null);
		if (query.length) {
			const res = await fetch(`/api/v2/${query}`, {
				headers: { Authorization: `Bearer ${session.accessToken}` },
			});

			if (!res.ok) setError(res);
			else res.json().then((json) => setData(json));
		}
	}

	return (
		<>
			<Box as="form" onSubmit={handleSubmit} mb={3}>
				<Flex sx={{ alignItems: "baseline" }}>
					<Text sx={{ width: "auto", opacity: "75%" }}>
						https://api.intra.42.fr/v2/
					</Text>
					<Input
						name="query"
						type="text"
						value={query}
						placeholder="me"
						onChange={(e) => setQuery(e.target.value)}
						sx={{
							width: "auto",
							flexGrow: 1,
							border: "none",
							borderBottom: "1px solid gray",
							borderRadius: 0,
						}}
					/>
					<Button type="submit">Send</Button>
				</Flex>
			</Box>
			{error && (
				<Alert bg="purple">
					{error.status} - {error.statusText}
				</Alert>
			)}
			<Box as="pre" sx={{ overflow: "auto" }}>
				{data === undefined
					? "Try `me`"
					: !data
					? !error && "loading..."
					: JSON.stringify(data, null, "\t")}
			</Box>
		</>
	);
}
