import { useRouter } from "next/router";
import useAPI from "@/lib/useAPI";
import { getLayout } from "@/layouts/UserLayout";
import Link from "next/link";
import Card from "@/components/Card";
import { ProjectsUser } from "@/types/User";
import getTimeAgo from "@/lib/getTimeAgo";
import CardGrid from "@/components/CardGrid";

function UserProjects() {
	const router = useRouter();
	const { login } = router.query;

	const { data: user, isLoading, isError } = useAPI(`/v2/users/${login}`);

	if (isLoading || isError) return <>Loading or error</>;

	return (
		<>
			<CardGrid>
				{user.projects_users.map((project: ProjectsUser) => {
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
						date = new Date(project.marked_at).toLocaleString(
							locale,
							options
						);
						timeAgo = getTimeAgo(project.marked_at);
					}
					return (
						<Link href={`/p/${project.project.slug}/${login}`}>
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
														"_",
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
		</>
	);
}

UserProjects.getLayout = getLayout;

export default UserProjects;
