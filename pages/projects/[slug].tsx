import useAPI from "lib/useAPI";
import { Project } from "types/Project";
import { useSession } from "next-auth/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { getLayout } from "ui/layouts/ProjectLayout";

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

	if (isLoading) return <>Loading...</>;
	if (isError) return <>Error</>;

	return (
		<>
			<Head>
				<title>{project.name} – 42extra</title>
			</Head>
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

ProjectIndex.getLayout = getLayout;

export default ProjectIndex;
