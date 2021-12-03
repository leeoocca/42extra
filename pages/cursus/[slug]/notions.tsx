import { useRouter } from "next/router";

import CursusHeader from "ui/headers/CursusHeader";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";
import { Card, Grid } from "@theme-ui/components";

export default function CursusNotions() {
	const router = useRouter();
	const { slug } = router.query;

	const { data: notions } = useAPI(`/v2/cursus/${slug}/notions`);

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
