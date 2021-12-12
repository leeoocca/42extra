import { useState } from "react";

import { useSession } from "next-auth/react";
import {
	Alert,
	Button,
	Flex,
	Input,
	Box,
	Grid,
	Text,
} from "@theme-ui/components";
import { Themed } from "@theme-ui/mdx";

export default function Query() {
	const { data: session } = useSession();

	const [query, setQuery] = useState("");
	const [data, setData] = useState(undefined);
	const [error, setError] = useState(null);

	async function handleSubmit(e) {
		e.preventDefault();
		if (query.length) {
			setData(null);
			setError(null);
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
				<Grid columns={[1, , "6fr 1fr"]}>
					<Flex sx={{ alignItems: "baseline" }}>
						<Text
							as="small"
							sx={{
								width: "auto",
								opacity: "75%",
							}}
						>
							https://api.intra.42.fr/v2/
						</Text>
						<Input
							name="query"
							type="text"
							value={query}
							placeholder="me"
							onChange={(e) => setQuery(e.target.value)}
							autoFocus
							sx={{
								width: "auto",
								flexGrow: 1,
								border: "none",
								borderBottom: "1px solid gray",
								borderRadius: 0,
							}}
						/>
					</Flex>
					<Button type="submit">Send</Button>
				</Grid>
			</Box>
			{error && (
				<Alert bg="purple">
					{error.status} - {error.statusText}
				</Alert>
			)}
			<Themed.pre>
				{data === undefined
					? "Try `me`"
					: !data
					? !error && "loading..."
					: JSON.stringify(data, null, "\t")}
			</Themed.pre>
		</>
	);
}
