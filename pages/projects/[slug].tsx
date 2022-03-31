import { useRouter } from "next/router";
import Link from "next/link";

import { useSession } from "next-auth/react";

import { Project } from "types/42";
import Loading from "ui/Loading";
import PageTitle from "ui/PageTitle";
import ProjectHeader from "ui/headers/ProjectHeader";
import useAPI from "lib/useAPI";

export default function ProjectIndex() {
	const { data: session } = useSession();
	const router = useRouter();
	const { slug } = router.query;

	const {
		data: project,
		isLoading,
		isError,
	} = useAPI<Project>(`/v2/projects/${slug}`);

	if (isLoading) return <Loading />;
	if (isError) return <>Error</>;

	return (
		<>
			<PageTitle title={project.name} />
			<article className="leading-relaxed">
				<section className="mt-2">
					<h2 className="text-xl font-bold">Cursuses</h2>
					<p>
						<code>{project.name}</code> is available in these
						cursuses:
					</p>
					<ul className="list-disc list-inside">
						{project.cursus.map((cursus) => (
							<li key={cursus.id}>
								<Link href={`/cursus/${cursus.id}`}>
									<a>{cursus.name}</a>
								</Link>
							</li>
						))}
					</ul>
				</section>
				<Link href={`/users/${session.user.login}/${project.slug}`}>
					<a>
						{session.user.login}&apos;s{" "}
						<span className="font-mono">{project.name}</span>
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
		</>
	);
}

ProjectIndex.header = ProjectHeader;
