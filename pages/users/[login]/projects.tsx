import { useRouter } from "next/router";
import Link from "next/link";

import {
	Asterisk,
	Skull,
	Smile,
	Award,
	Meh,
	Check,
	X,
	Frown,
} from "lucide-react";
import {
	Box,
	Card,
	Flex,
	Grid,
	Heading,
	IconButton,
	Progress,
	Text,
} from "@theme-ui/components";

import { ICON_SIZE } from "lib/actions";
import { locale } from "lib/constants";
import { User } from "types/42";
import getTimeAgo from "lib/getTimeAgo";
import isFuture from "lib/isFuture";
import Loading from "ui/Loading";
import ProjectCard from "ui/ProjectCard";
import sortCursus from "lib/sortCursus";
import useAPI from "lib/useAPI";
import UserHeader from "ui/headers/UserHeader";

function CursusDetails({ cursus }) {
	const Detail = ({ children }) => (
		<Flex sx={{ gap: 1, alignItems: "center" }}>{children}</Flex>
	);
	const blackholeDays: number = Math.floor(
		(new Date(cursus.blackholed_at).valueOf() - Date.now()) /
			1000 /
			60 /
			60 /
			24
	);

	return (
		<Box as="header" mb={3}>
			<Flex
				sx={{
					alignItems: "end",
					justifyContent: "space-between",
				}}
			>
				<Box>
					<Link href={`/cursus/${cursus.cursus_id}`}>
						<a>
							<Heading sx={{ fontSize: 3, lineHeight: 1.5 }}>
								{cursus.cursus.name}
							</Heading>
						</a>
					</Link>
					<Flex
						sx={{
							gap: [1, , 3],
							flexDirection: ["column", , "row"],
						}}
					>
						{cursus.grade && (
							<Detail>
								<Award size={ICON_SIZE} />
								{cursus.grade}
							</Detail>
						)}
						<Detail>
							<Asterisk size={ICON_SIZE} />
							{isFuture(cursus.begin_at)
								? "will start "
								: "started "}
							<time
								dateTime={cursus.begin_at.toLocaleString(
									locale
								)}
								title={cursus.begin_at.toLocaleString(locale)}
							>
								{getTimeAgo(cursus.begin_at)}
							</time>
						</Detail>
						{cursus.end_at && (
							<Detail>
								<Skull size={ICON_SIZE} />
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
							</Detail>
						)}

						<Detail>
							{isFuture(cursus.blackholed_at) ? (
								<>
									{blackholeDays > 30 ? (
										<Smile size={ICON_SIZE} />
									) : (
										<Meh size={ICON_SIZE} />
									)}
									BlackHole in{" "}
									<time
										dateTime={cursus.blackholed_at.toLocaleString(
											locale
										)}
										title={cursus.blackholed_at.toLocaleString(
											locale
										)}
									>
										{blackholeDays} days
									</time>
								</>
							) : (
								!cursus.end_at && (
									<>
										<Frown size={ICON_SIZE} />
										Absorbed by the Black Hole{" "}
										{getTimeAgo(cursus.blackholed_at)}
									</>
								)
							)}
						</Detail>
					</Flex>
				</Box>
				<Text sx={{ fontFamily: "monospace", fontSize: 1 }}>
					{cursus.level.toFixed(2)}
				</Text>
			</Flex>
			<Progress my={2} max={21} value={cursus.level} />
		</Box>
	);
}

function ProjectCard({ project, login }) {
	return (
		<Link href={`/users/${login}/${project.project.slug}`} passHref>
			<Card as="a" bg="muted" p={2}>
				<div className="flex items-end justify-between w-full h-24">
					<div>
						<h2 className="text-lg">{project.project.name}</h2>
						<p className="text-sm">
							<span
								className={`${
									project.status === "in_progress" &&
									"text-yellow-400"
								}`}
							>
								{project.status.replace(/_/g, " ")}
							</span>
							{project.marked_at && (
								<time
									title={project.marked_at.toString()}
									className="ml-1 opacity-75"
								>
									{getTimeAgo(project.marked_at)}
								</time>
							)}
						</p>
					</div>
					<Flex
						className={`${
							project["validated?"]
								? "text-green-400"
								: "text-red-600"
						}`}
						sx={{ alignItems: "center", gap: 1 }}
					>
						{project["validated?"] ? (
							<Check size={ICON_SIZE} />
						) : (
							project.marked_at && <X size={ICON_SIZE} />
						)}
						{project.final_mark}
					</Flex>
				</div>
			</Card>
		</Link>
	);
}

export default function UserProjects() {
	const { query } = useRouter();
	const { login } = query;

	const { data: user, isLoading } = useAPI<User>(`/v2/users/${login}`);

	if (isLoading) return <Loading />;
	if (!user) return <>Error</>;

	return user.cursus_users.sort(sortCursus).map((cursus) => (
		<Box
			key={cursus.cursus_id}
			id={cursus.cursus.slug}
			my={3}
			sx={{ scrollMargin: 3 }}
			as="article"
		>
			<CursusDetails cursus={cursus} />
			<Grid as="main" variant="cards" sx={{ alignItems: "start" }}>
				{!user.projects_users.length ? (
					<>Not started any project yet.</>
				) : (
					user.projects_users
						.filter((p) => p.cursus_ids.includes(cursus.cursus_id))
						.filter((p) => !p.project.parent_id)
						.map((project) => {
							const children = user.projects_users.filter(
								(p) =>
									p.project.parent_id === project.project.id
							);

							return (
								<Grid key={project.id}>
									<ProjectCard
										project={project}
										login={login}
									/>
									{children.length > 0 && (
										<Box as="details" mt={-2}>
											<summary>Child projects</summary>
											<Grid gap={2}>
												{children.map((p) => (
													<ProjectCard
														key={p.id}
														project={p}
														login={login}
													/>
												))}
											</Grid>
										</Box>
									)}
								</Grid>
							);
						})
				)}
			</Grid>
		</Box>
	));
}

UserProjects.header = UserHeader;
