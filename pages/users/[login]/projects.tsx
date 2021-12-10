import Link from "next/link";
import { useRouter } from "next/router";

import { Box } from "@theme-ui/components";

import { locale } from "lib/constants";
import { User } from "types/42/User";
import Card from "ui/Card";
import CardGrid from "ui/CardGrid";
import getTimeAgo from "lib/getTimeAgo";
import isFuture from "lib/isFuture";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";
import UserHeader from "ui/headers/UserHeader";

export default function UserProjects() {
	const { query } = useRouter();
	const { login } = query;

	const { data: user, isLoading }: { data: User; isLoading: boolean } =
		useAPI(`/v2/users/${login}`);

	if (isLoading) return <Loading />;
	if (!user) return <>Error</>;

	if (!user.projects_users.length)
		return (
			<>
				No projects for <b>{login}</b>.
			</>
		);

	return user.cursus_users
		.sort(
			(a, b) =>
				new Date(b.begin_at).valueOf() - new Date(a.begin_at).valueOf()
		)
		.map((cursus) => (
			<Box
				key={cursus.cursus_id}
				id={cursus.cursus.slug}
				m={3}
				sx={{ scrollMargin: 3 }}
				as="article"
			>
				<Box as="header" mb={3}>
					<div className="flex items-baseline space-x-2">
						<h2 className="text-2xl font-bold tracking-tight">
							<Link href={`/cursus/${cursus.cursus_id}`}>
								<a>{cursus.cursus.name}</a>
							</Link>
						</h2>
						<span className="flex space-x-2 text-sm">
							<abbr title="level" className="tabular-nums">
								{cursus.level.toFixed(2)}
							</abbr>
							{cursus.grade && (
								<span className="font-semibold uppercase opacity-75">
									{cursus.grade}
								</span>
							)}
						</span>
					</div>
					<div className="text-sm leading-6">
						{isFuture(cursus.begin_at) ? "will start " : "started "}
						<time
							dateTime={cursus.begin_at.toLocaleString(locale)}
							title={cursus.begin_at.toLocaleString(locale)}
						>
							{getTimeAgo(cursus.begin_at)}
						</time>
						{cursus.end_at && (
							<>
								{" · "}
								{isFuture(cursus.end_at)
									? "will end "
									: "ended "}
								<time
									dateTime={cursus.end_at.toLocaleString(
										locale
									)}
									title={cursus.end_at.toLocaleString(locale)}
								>
									{getTimeAgo(cursus.end_at)}
								</time>
							</>
						)}
						{cursus.blackholed_at && (
							<>
								{" · "}
								<abbr title="Black Hole">BH</abbr> in{" "}
								<time
									dateTime={cursus.blackholed_at.toLocaleString(
										locale
									)}
									title={cursus.blackholed_at.toLocaleString(
										locale
									)}
								>
									{(
										(new Date(
											cursus.blackholed_at
										).valueOf() -
											new Date().valueOf()) /
										1000 /
										60 /
										60 /
										24
									).toFixed(0)}{" "}
									days
								</time>
							</>
						)}
					</div>
				</Box>
				<main>
					<CardGrid>
						{user.projects_users.map((project) => {
							if (!project.cursus_ids.includes(cursus.cursus_id))
								return;
							const options: Intl.DateTimeFormatOptions = {
								year: "numeric",
								month: "2-digit",
								day: "2-digit",
								hour: "numeric",
								minute: "numeric",
								hour12: false,
								// dateStyle: "medium",
								// timeStyle: "short",
							};
							let date = null;
							let timeAgo = null;
							if (project.marked_at) {
								const locale = navigator.language || "en";
								date = new Date(
									project.marked_at
								).toLocaleString(locale, options);
								timeAgo = getTimeAgo(project.marked_at);
							}
							return (
								<Link
									key={project.id}
									href={`/users/${login}/${project.project.slug}`}
								>
									<a>
										<Card key={project.id}>
											<div className="flex items-end justify-between w-full h-24">
												<div>
													<h2 className="text-lg">
														{project.project.name}
													</h2>
													<p className="text-sm">
														<span
															className={`${
																project.status ===
																	"in_progress" &&
																"text-yellow-400"
															}`}
														>
															{project.status.replace(
																/_/g,
																" "
															)}
														</span>
														{date && (
															<time
																title={date}
																className="ml-1 opacity-75"
															>
																{timeAgo}
															</time>
														)}
													</p>
												</div>
												<span
													className={`${
														project["validated?"]
															? "text-green-400"
															: "text-red-600"
													}`}
												>
													{project.final_mark}
												</span>
											</div>
										</Card>
									</a>
								</Link>
							);
						})}
					</CardGrid>
				</main>
			</Box>
		));
}

UserProjects.header = UserHeader;
