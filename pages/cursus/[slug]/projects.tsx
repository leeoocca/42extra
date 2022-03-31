import { useRouter } from "next/router";
import Link from "next/link";

import { Card, Grid } from "@theme-ui/components";

import CursusHeader from "ui/headers/CursusHeader";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";

export default function CursusProjects() {
	const router = useRouter();
	const { slug } = router.query;

	const { data: projects } = useAPI(`/v2/cursus/${slug}/projects`);

	if (!projects) return <Loading />;

	console.log(projects);

	return (
		<Grid variant="cards">
			{projects.map((project) => (
				<Link
					key={project.id}
					href={`/projects/${project.slug}`}
					passHref
				>
					<Card bg="muted" p={2} sx={{ cursor: "pointer" }}>
						{project.name}
					</Card>
				</Link>
			))}
		</Grid>
	);
}

CursusProjects.header = CursusHeader;
