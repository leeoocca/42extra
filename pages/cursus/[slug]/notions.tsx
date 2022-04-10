import { Card, Grid } from "@theme-ui/components";
import useAPI from "lib/useAPI";
import { useRouter } from "next/router";
import CursusHeader from "ui/headers/CursusHeader";
import Loading from "ui/Loading";

export default function CursusNotions() {
	const {
		query: { slug },
	} = useRouter();

	const { data: notions } = useAPI<any>(`/v2/cursus/${slug}/notions`); // TODO notion interface

	if (!notions) return <Loading />;

	return (
		<Grid variant="cards">
			{notions.map((notion) => (
				<Card key={notion.id}>{notion.name}</Card>
			))}
		</Grid>
	);
}

CursusNotions.header = CursusHeader;
