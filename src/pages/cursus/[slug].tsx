import useAPI from "@/lib/useAPI";
import { useRouter } from "next/router";

function Cursus() {
	const router = useRouter();
	const { slug } = router.query;

	const { data: cursus } = useAPI(`/v2/cursus/${slug}`);
	const { data: projects } = useAPI(`/v2/cursus/${slug}/projects`);
	const { data: skills } = useAPI(`/v2/cursus/${slug}/skills`);
	const { data: notions } = useAPI(`/v2/cursus/${slug}/notions`);
	const { data: events } = useAPI(`/v2/cursus/${slug}/events`);
	const { data: achievements } = useAPI(`/v2/cursus/${slug}/achievements`);

	if (!cursus) return <>Loading...</>;

	return (
		<>
			<h1 className="text-3xl font-bold leading-relaxed">
				{cursus.name}
			</h1>
			<details>
				<summary>Projects</summary>
				<pre className="text-xs">
					{projects && JSON.stringify(projects, null, 2)}
				</pre>
			</details>
			<details>
				<summary>Skills</summary>
				<pre className="text-xs">
					{skills && JSON.stringify(skills, null, 2)}
				</pre>
			</details>
			<details>
				<summary>Notions</summary>
				<pre className="text-xs">
					{notions && JSON.stringify(notions, null, 2)}
				</pre>
			</details>
			<details>
				<summary>Events</summary>
				<pre className="text-xs">
					{events && JSON.stringify(events, null, 2)}
				</pre>
			</details>
			<details>
				<summary>Achievements</summary>
				<pre className="text-xs">
					{achievements && JSON.stringify(achievements, null, 2)}
				</pre>
			</details>
		</>
	);
}

export default Cursus;
