import { useRouter } from "next/router";

import { Project } from "types/42";
import { setPrimaryColor } from "lib/color";
import useAPI from "lib/useAPI";

export default function ProjectHeader() {
	const {
		query: { slug },
	} = useRouter();

	// const navLinks = getProjectNavLinks();
	setPrimaryColor();

	const { data: project } = useAPI<Project>(`/v2/projects/${slug}`);

	return (
		<div className="px-4 py-6">
			<h1 className="mb-4 text-4xl font-bold">
				{project ? project.name : slug}
			</h1>
			{project && (
				<section className="flex items-baseline ml-1 space-x-4 text-sm font-semibold uppercase">
					<span className="font-mono">#{project.id}</span>
					<span>{project.exam ? "exam" : "project"}</span>
					{/* <span
						className={`mx-2 ${
							(project.recommendation === "forbidden" &&
							"text-red-600") || (project.recommendation === "forbidden" &&
							"text-red-600")
						}`}
					>
						{project.recommendation}
					</span> */}
				</section>
			)}
		</div>
	);
}
