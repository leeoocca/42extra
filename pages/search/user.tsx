import { memo, useState } from "react";
import Link from "next/link";

import { Box, Card, Grid, Input } from "@theme-ui/components";

import { UserPreview } from "types/42";
import useAPI from "lib/useAPI";

const Results = memo(function Results({ query }: { query: string }) {
	const {
		data: first = [],
		isLoading: isLoading,
	}: { data: UserPreview[]; isLoading: boolean } = useAPI<UserPreview[]>(
		`/v2/users?filter[first_name]=${query}`
	);
	const { data: last = [] }: { data: UserPreview[] } = useAPI<UserPreview[]>(
		`/v2/users?filter[last_name]=${query}`
	);
	const { data: login = [] }: { data: UserPreview[] } = useAPI<UserPreview[]>(
		`/v2/users?filter[login]=${query}`
	);

	const data = [...first, ...last, ...login];

	if (isLoading) return <>Loading...</>;
	if (!data.length) return <>No results</>;

	return (
		<Grid variant="cards" mt={3}>
			{data.map((user) => (
				<Link key={user.login} href={`/users/${user.login}`} passHref>
					<Card bg="muted" p={2} as="a">
						{user.login} - {user.displayname}
					</Card>
				</Link>
			))}
		</Grid>
	);
});

export default function SearchUser() {
	const [input, setInput] = useState("");
	const [query, setQuery] = useState("");

	function handleSubmit(e) {
		e.preventDefault();
		setQuery(input);
	}

	function handleChange(e) {
		setInput(e.target.value);
	}

	return (
		<>
			<Box as="form" onSubmit={handleSubmit}>
				<Input value={input} onChange={handleChange} />
			</Box>
			{!!query.length && <Results query={query} />}
		</>
	);
}

// TODO
// on enter, push URI query
