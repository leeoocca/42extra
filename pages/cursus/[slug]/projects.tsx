import { Card, Grid } from "@theme-ui/components";
import useAPI from "lib/useAPI";
import Link from "next/link";
import { useRouter } from "next/router";
import { Project } from "types/42";
import CursusHeader from "ui/headers/CursusHeader";
import Loading from "ui/Loading";

export default function CursusProjects() {
	const {
		query: { slug },
	} = useRouter();

	const { data: projects } = useAPI<Project[]>(`/v2/cursus/${slug}/projects`);

	if (!projects) return <Loading />;

	return (
		<Grid variant="cards">
			{projects.map((project) => (
				<Link
					key={project.id}
					href={`/projects/${project.slug}`}
					passHref
				>
					<Card bg="muted" p={2}>
						{project.name}
					</Card>
				</Link>
			))}
		</Grid>
	);
}

CursusProjects.header = CursusHeader;
