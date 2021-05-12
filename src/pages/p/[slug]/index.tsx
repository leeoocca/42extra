import useAPI from "@/lib/useAPI";
import { Project } from "@/types/Project";
import { useSession } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";

function ProjectIndex() {
	const [session] = useSession();
	const router = useRouter();
	const { slug } = router.query;

	const {
		data: project,
		isLoading,
		isError,
	}: {
		data: Project;
		isLoading: boolean;
		isError: any;
	} = useAPI(`/v2/projects/${slug}`);
	return (
		<>
			{project && (
				<article className="leading-relaxed">
					<h1 className="text-4xl font-bold leading-relaxed">
						{project.name}
					</h1>
					<section className="flex space-x-2 text-sm font-semibold uppercase">
						<span className="mx-2 font-mono">#{project.id}</span>
						<span className="mx-2">
							{project.exam ? "exam" : "project"}
						</span>
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
					<section className="mt-2">
						<h2 className="text-xl font-bold">Cursus</h2>
						<p>
							<code>{project.name}</code> is available in these
							cursuses:
						</p>
						<ul className="list-disc list-inside">
							{project.cursus.map((cursus) => (
								<li key={cursus.id}>{cursus.name}</li>
							))}
						</ul>
					</section>
					<Link href={`/p/${project.slug}/${session.user.login}`}>
						<a>
							My <span className="font-mono">{project.name}</span>
						</a>
					</Link>
					{/* <section className="mt-2">
						<h2 className="text-xl font-bold">Sessions</h2>
						<p>
							Sessions available for <code>{project.name}</code>:
						</p>
						<ul className="list-disc list-inside">
							{project.project_sessions.map((session) => (
								<li>
									{session.is_subscriptable
										? "subscriptable"
										: "not subscriptable"}
								</li>
							))}
						</ul>
					</section> */}
				</article>
			)}
			{isError && JSON.stringify(isError)}
		</>
	);
}

export default ProjectIndex;
