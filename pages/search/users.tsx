import { Box, Card, Grid, Input } from "@theme-ui/components";
import useAPI from "lib/useAPI";
import Link from "next/link";
import { memo, useState } from "react";
import { UserPreview } from "types/42";
import PageTitle from "ui/PageTitle";

const Results = memo(function Results({ query }: { query: string }) {
	const { data: first = [], isLoading } = useAPI<UserPreview[]>(
		`/v2/users?filter[first_name]=${query}`
	);
	const { data: last = [] } = useAPI<UserPreview[]>(
		`/v2/users?filter[last_name]=${query}`
	);
	const { data: login = [] } = useAPI<UserPreview[]>(
		`/v2/users?range[login]=${query},${query.padEnd(8, "z")}`
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
		setQuery(input.trim());
	}

	function handleChange(e) {
		setInput(e.target.value);
	}

	return (
		<>
			<PageTitle title={["search", "users"]} />
			<Box as="form" onSubmit={handleSubmit}>
				<Input value={input} onChange={handleChange} />
			</Box>
			{!!query.length && <Results query={query} />}
		</>
	);
}

// TODO
// on enter, push URI query
