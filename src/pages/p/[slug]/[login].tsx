import UserCard from "@/components/UserCard";
import useAPI from "@/lib/useAPI";
import { useRouter } from "next/router";

function ProjectUser() {
	const router = useRouter();
	const { slug, login } = router.query;

	const { data: project } = useAPI(`/v2/projects/${slug}`);
	const { data: teams } = useAPI(`/v2/users/${login}/projects/${slug}/teams`);
	return (
		<>
			<h1>
				{login}'s {project ? project.name : slug}
			</h1>
			{teams && (
				<>
					{teams.reverse().map((team) => (
						<section key={team.id}>
							<h2>{team.name}</h2>
							<p>{team["closed?"] ? "closed" : "open"}</p>
							<p>{team.status}</p>
							<code>{team.repo_url}</code>
							<div>
								{team.users.map((user) => (
									<UserCard
										key={user.login}
										id={user.login}
									/>
								))}
							</div>
							<h3>Evaluations</h3>
							<ul>{team.scale}</ul>
							{team.team_uploads && (
								<>
									<h3>Moulinette</h3>
									<ul className="list-disc list-inside">
										{team.teams_uploads.map((upload) => (
											<li
												key={upload.id}
												className="flex justify-between"
											>
												<span>{upload.comment}</span>
												<span>{upload.final_mark}</span>
											</li>
										))}
									</ul>
								</>
							)}
						</section>
					))}
				</>
			)}
		</>
	);
}
export default ProjectUser;
