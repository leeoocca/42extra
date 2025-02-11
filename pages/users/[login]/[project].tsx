import { Heading, Text } from "@theme-ui/components";
import { getUserProjectLink } from "lib/intraLink";
import useAPI from "lib/useAPI";
import { useRouter } from "next/router";
import { Team } from "types/42";
import Card from "ui/cards/Card";
import UserCard from "ui/cards/UserCard";
import UserGrid from "ui/grids/UserGrid";
import ProjectUserHeader from "ui/headers/ProjectUserHeader";
import Link from "ui/Link";
import Loading from "ui/Loading";

export default function ProjectUser() {
	const {
		query: { login, project },
	} = useRouter();

	const { data: teams, error } = useAPI<Team[]>( // TODO which is it?
		`/v2/users/${login}/projects/${project}/teams`
	);

	if (!teams) return <Loading />;

	if (!Object.keys(teams).length) return <Text>No teams for {login}</Text>;

	return teams.map((team, i) => (
		<section key={team.id} className="mb-8">
			<div className="flex flex-col w-full space-y-2">
				<span className="flex items-baseline justify-between">
					<h2 className="text-lg font-medium">{team.name}</h2>
					<p>
						<span
							className={`${
								team.status === "in_progress" &&
								"text-yellow-400"
							}`}
						>
							{team.status.replace(/_/g, " ")}
						</span>
						{team.final_mark !== null && (
							<>
								{" "}
								–{" "}
								<span
									className={`${
										team["validated?"]
											? "text-green-400"
											: "text-red-600"
									}`}
								>
									{team.final_mark}
								</span>
							</>
						)}
					</p>
				</span>
				<UserGrid>
					{team.users.map((user) => (
						<UserCard key={user.login} id={user.login} />
					))}
				</UserGrid>
				<code className="overflow-hidden text-sm select-all">
					{team.repo_url}
				</code>
				{team.scale_teams.length > 0 && (
					<>
						<Heading as="h3">Evaluations</Heading>
						<ul className="flex flex-col gap-2">
							{team.scale_teams.map((scale) => (
								<li key={scale.id}>
									<Card>
										<div className="flex flex-col gap-2 p-2">
											<p>
												<span
													className={`${
														scale.flag.positive
															? "text-green-400"
															: "text-red-600"
													}`}
												>
													{scale.final_mark}
												</span>{" "}
												– {scale.flag.name}
											</p>
											<p>
												<Link
													href={`/users/${scale.corrector.login}`}
												>
													{scale.corrector.login}
												</Link>
												<br />
												{scale.comment}
											</p>
											<p>
												<Link
													href={`/users/${scale.correcteds[0].login}`}
												>
													{scale.correcteds[0].login}
												</Link>
												<br />
												{scale.feedback}
											</p>
										</div>
									</Card>
								</li>
							))}
						</ul>
					</>
				)}
				{team.teams_uploads.length > 0 && (
					<>
						<h3>Moulinette</h3>
						<ul className="list-disc list-inside">
							{team.teams_uploads.map((upload) => (
								<li
									key={upload.id}
									className="flex flex-wrap-reverse justify-between"
								>
									<span className="font-mono">
										{upload.comment}
									</span>
									<span className="font-bold">
										{upload.final_mark}
									</span>
								</li>
							))}
						</ul>
					</>
				)}
			</div>
			{i !== teams.length - 1 && <hr className="mt-8 opacity-50" />}
		</section>
	));
}

ProjectUser.header = ProjectUserHeader;
ProjectUser.getIntraLink = getUserProjectLink;
