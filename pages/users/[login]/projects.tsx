import { Box, Flex, Grid, Heading, Progress, Text } from "@theme-ui/components";
import { ICON_SIZE } from "lib/actions";
import { FTCURSUS_ID } from "lib/constants";
import groupBy from "lib/groupBy";
import isFuture from "lib/isFuture";
import sortCursus from "lib/sortCursus";
import useAPI from "lib/useAPI";
import { Asterisk, Award, Frown, Meh, Skull, Smile } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ProjectsUser, User } from "types/42";
import ProjectCard from "ui/cards/ProjectCard";
import UserHeader from "ui/headers/UserHeader";
import Loading from "ui/Loading";
import RelativeTime from "ui/RelativeTime";

function CursusEnd({ cursus }) {
	const blackholeDays: number = Math.floor(
		(Date.parse(cursus.end_at) - Date.now()) / // milliseconds
			1000 / // seconds
			60 / // minutes
			60 / // hours
			24 // days
	);

	if (!cursus.end_at) return;
	if (cursus.cursus.id !== FTCURSUS_ID)
		return (
			<>
				<Skull size={ICON_SIZE} />
				{isFuture(cursus.end_at) ? "will end " : "ended "}
				<RelativeTime date={cursus.end_at} />
			</>
		);
	if (cursus.cursus.id === FTCURSUS_ID)
		if (isFuture(cursus.end_at))
			return (
				<>
					{blackholeDays > 30 ? (
						<Smile size={ICON_SIZE} />
					) : (
						<Meh size={ICON_SIZE} />
					)}
					Black Hole absorption <RelativeTime date={cursus.end_at} />{" "}
					or{" "}
					<time dateTime={cursus.end_at}>
						in {blackholeDays} days
					</time>
				</>
			);

	return (
		<>
			<Frown size={ICON_SIZE} />
			Absorbed by the Black Hole <RelativeTime date={cursus.end_at} />
		</>
	);
}

function CursusDetails({ cursus }) {
	const Detail = ({ children }) => (
		<Flex sx={{ gap: 1, alignItems: "center" }}>{children}</Flex>
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
					<Link href={`/cursus/${cursus.cursus.slug}`}>
						<Heading sx={{ fontSize: 3, lineHeight: 1.5 }}>
							{cursus.cursus.name}
						</Heading>
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
							<RelativeTime date={cursus.begin_at} />
						</Detail>
						<Detail>
							<CursusEnd cursus={cursus} />
						</Detail>
					</Flex>
				</Box>
				<Text variant="mono">{cursus.level.toFixed(2)}</Text>
			</Flex>
			<Progress my={2} max={21} value={cursus.level} />
		</Box>
	);
}

interface ProjectsGridProps {
	projects_users: ProjectsUser[];
	login: string;
}

function ProjectsGrid({ projects_users, login }: ProjectsGridProps) {
	if (!projects_users?.length) return <p>Not started any project yet.</p>;

	const projectsByType = groupBy(projects_users, (pu) =>
		pu.project.name.includes("Exam") ? "exam" : "project"
	);

	return (
		<>
			{projectsByType
				.sort((a, b) => (a.name === "exam" ? -1 : 1))
				.map((value) => {
					return (
						<Grid
							key={value.name}
							as="main"
							variant="cards"
							sx={{ alignItems: "start" }}
							mb={2}
						>
							{value.value
								.filter((p) => !p.project.parent_id)
								.sort(
									(a, b) =>
										new Date(b.updated_at).valueOf() -
										new Date(a.updated_at).valueOf()
								)
								.map((project) => {
									const children = projects_users.filter(
										(p) =>
											p.project.parent_id ===
											project.project.id
									);
									return (
										<Grid key={project.id}>
											<ProjectCard
												project={project}
												login={login}
											/>
											{children.length > 0 && (
												<Box as="details" mt={-2}>
													<summary>
														Child projects
													</summary>
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
								})}
							<br />
						</Grid>
					);
				})}
		</>
	);
}

interface ProjectsUsersGroup {
	name: number;
	value: ProjectsUser[];
}

export default function UserProjects() {
	const { query } = useRouter();
	const { login } = query;
	const [projectsUsers, setProjectsUsers] = useState<ProjectsUsersGroup[]>(
		[]
	);

	const { data: user, isLoading } = useAPI<User>(`/v2/users/${login}`);

	// TODO useEffect really necessary?
	useEffect(() => {
		if (!user || !user.projects_users) return;
		setProjectsUsers(groupBy(user.projects_users, (pu) => pu.cursus_ids));
	}, [user?.projects_users]);

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
			<ProjectsGrid
				projects_users={
					projectsUsers.find((pu) => pu.name === cursus.cursus_id)
						?.value
				}
				login={`${login}`}
			/>
		</Box>
	));
}

UserProjects.header = UserHeader;
