import { Fragment } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import {
	Badge,
	Box,
	Card,
	Flex,
	Grid,
	Heading,
	Link as ThemeLink,
	Progress,
	Text,
} from "@theme-ui/components";
import { Check, Hash, Mail, User as UserIcon, X } from "lucide-react";

import { Coalition, CoalitionUser, Location, User } from "types/42";
import { ICON_SIZE } from "lib/actions";
import { locale } from "lib/constants";
import getTimeAgo from "lib/getTimeAgo";
import Loading from "ui/Loading";
import sortCursus from "lib/sortCursus";
import useAPI from "lib/useAPI";
import UserHeader from "ui/headers/UserHeader";
import getPrettyDuration from "lib/getPrettyDuration";
import { mendColor } from "lib/color";
// import getCampusFromId from "lib/getCampusFromId";

function getLastSeen(locations: any): string {
	if (locations.length)
		// in ${getCampusFromId(locations[0].campus_id).name}
		return " " + getTimeAgo(locations[0].end_at);
	else return " never";
}

const None = () => <i className="opacity-75">none</i>;

const OverviewCard = ({ children, title, href = null }) => {
	const link = href
		? (el) => (
				<Link href={href} passHref>
					{el}
				</Link>
		  )
		: (el) => el;

	return link(
		<Card bg="muted" p={3} as={href ? "a" : null} sx={{ borderRadius: 5 }}>
			<Heading mb={2}>{title}</Heading>
			<Box>{children}</Box>
		</Card>
	);
};

function checkOrX(bool: boolean) {
	return bool ? <Check size={ICON_SIZE - 4} /> : <X size={ICON_SIZE - 4} />;
}

export default function UserOverview() {
	const {
		query: { login },
	} = useRouter();

	const { data: user, isError } = useAPI<User>(`/v2/users/${login}`);
	const { data: locations } = useAPI<Location[]>(
		`/v2/users/${login}/locations`
	);
	const { data: coalitions } = useAPI<Coalition[]>(
		`/v2/users/${login}/coalitions`
	);
	const { data: coalitions_users } = useAPI<CoalitionUser[]>(
		`/v2/users/${login}/coalitions_users`
	);

	if (isError) return <>Error</>;
	if (!user) return <Loading />;

	const location = user.location
		? `${user.location} for ${
				locations ? getPrettyDuration(locations[0].begin_at) : "..."
		  }`
		: `last seen${locations ? getLastSeen(locations) : "..."}`;

	return (
		<>
			<Grid columns={[1, , 3]}>
				<OverviewCard title="Info">
					<Grid
						columns={`${ICON_SIZE - 4}px 1fr`}
						sx={{ gap: 2, alignItems: "center" }}
					>
						{[
							{
								icon: <Hash size={ICON_SIZE - 4} />,
								value: <Text as="code">{user.id}</Text>,
							},
							{
								icon: <UserIcon size={ICON_SIZE - 4} />,
								value: user.login,
							},
							{
								icon: <Mail size={ICON_SIZE - 4} />,
								value: (
									<ThemeLink href={`mailto:${user.email}`}>
										{user.email}
									</ThemeLink>
								),
							},
							{
								icon: (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										version="1.0"
										viewBox="0 0 256 256"
										width={ICON_SIZE}
										fill="currentColor"
									>
										<path d="M87.5 73.6C56 89.5 37 100.2 34 103.7c-5.4 6.1-3.3 11.3 4.5 11.3 3.1 0 12.6-3.1 32.6-10.6 28.1-10.5 28.2-10.6 30.7-8.7 2.2 1.7 13.2 23.9 13.2 26.8 0 1-33.9 22.2-54.5 34.1l-5 2.9 3 .6c2.8.6 2.8.7.5.8l-2.5.2 3 1.7c2.4 1.3 5.3 1.7 14 1.6 9.7-.1 13.1-.6 29-4.8 37.6-9.9 45.1-11.7 52.2-12.3l7.3-.6v-3.2c0-2.3-2.3-6.9-8.2-16.1-4.4-7.1-13.5-21.5-20-31.9-16.4-26.1-17.9-28.2-20.6-29.4-4.8-2.2-8.6-1.1-25.7 7.5zm99.1 8.8c-6 2.2-10.8 6.7-14.1 13.1-2.5 5-3 6.9-2.9 12.9.1 8.5 1.8 12.9 7.4 19 9.8 10.7 27.1 11.4 38.2 1.6 14.5-12.7 11.4-37.1-5.8-45.5-5.1-2.5-17.4-3.1-22.8-1.1z" />
										<path d="M1.3 163.3c1.5 4 8.9 13.6 14.9 19.3 19.1 18.3 41.6 25 76.2 22.5 20.5-1.5 31.3-3.6 52.3-10.4 25-8.1 35-9.3 64.8-7.8 11 .6 25.3 1.8 31.9 2.7 6.5.8 12.1 1.3 12.3 1 .8-.8-16.1-11.5-24.1-15.1-13.3-6.2-23.6-8.7-38.3-9.2-16.6-.7-23.9.3-53.8 7.7-38.8 9.5-38.5 9.5-61 9.5-21.5 0-29-1.1-44.5-6.2-7.6-2.6-21.6-9.3-27.9-13.5-2.9-1.9-3.4-2-2.8-.5z" />
									</svg>
								),

								value: user.pool_year
									? `${user.pool_month} ${user.pool_year}`
									: "none",
							},
							{
								name: "Alumni",
								icon: checkOrX(user.alumni),
							},
							{
								name: "Launched",
								icon: checkOrX(user["is_launched?"]),
							},
							{
								name: "Staff",
								icon: checkOrX(user["staff?"]),
							},
						].map((e, index) => (
							<Fragment key={index}>
								{e.icon}
								{e.name && (
									<Text
										sx={{
											opacity: !e.value ? null : "75%",
										}}
									>
										{e.name}
									</Text>
								)}
								{typeof e.value === "string" ? (
									<Text>{e.value}</Text>
								) : (
									e.value
								)}
							</Fragment>
						))}
					</Grid>
				</OverviewCard>
				<OverviewCard
					title="Location"
					href={`/users/${login}/locations`}
				>
					<Text sx={{ fontSize: 4 }}>{location}</Text>
				</OverviewCard>
				<OverviewCard title="Last seen online">
					<Text sx={{ fontSize: 4 }}>
						{new Date(
							Date.parse(user.anonymize_date) -
								365 * 24 * 60 * 60 * 1000 // 1 year
						).toLocaleDateString(locale)}
					</Text>
				</OverviewCard>
				<Grid columns={2}>
					<OverviewCard
						title="Correction points"
						href={`/users/${login}/scales`}
					>
						<Text sx={{ fontSize: 4 }}>
							{user.correction_point}
						</Text>
					</OverviewCard>
					<OverviewCard
						title="Achievements"
						href={`/users/${login}/achievements`}
					>
						<Text sx={{ fontSize: 4 }}>
							{user.achievements.length}
						</Text>
					</OverviewCard>
					<OverviewCard title="Wallet">
						<Text sx={{ fontSize: 4 }}>{user.wallet} ₳</Text>
					</OverviewCard>
				</Grid>
				<OverviewCard title="Cursus">
					{user.cursus_users?.length ? (
						<ul>
							{user.cursus_users
								.sort(sortCursus)
								.map((cursus) => (
									<Box key={cursus.cursus_id} as="li" my={3}>
										<Link
											href={`/users/${login}/projects#${cursus.cursus.slug}`}
											passHref
										>
											<Flex
												as="a"
												sx={{
													justifyContent:
														"space-between",
												}}
											>
												<Text>
													{cursus.cursus.name}
												</Text>
												<Text sx={{ opacity: "75%" }}>
													{cursus.level}
												</Text>
											</Flex>
										</Link>
										<Progress
											value={cursus.level}
											max={21}
											// sx={{ borderRadius: 0 }}
										/>
									</Box>
								))}
						</ul>
					) : (
						<None />
					)}
				</OverviewCard>

				<OverviewCard title="Campus">
					{user.campus_users?.length ? (
						<ul>
							{user.campus.map((campus) => (
								<Link
									key={campus.id}
									href={`/campus/${campus.id}`}
								>
									<a>
										<Flex
											as="li"
											sx={{
												gap: 2,
												alignItems: "baseline",
											}}
										>
											{campus.name}
											{user.campus_users.find(
												(c) => c.campus_id === campus.id
											).is_primary && (
												<Badge>Primary</Badge>
											)}
										</Flex>
									</a>
								</Link>
							))}
						</ul>
					) : (
						<None />
					)}
				</OverviewCard>
				<OverviewCard title="Coalition">
					{coalitions ? (
						coalitions.length ? (
							<ul>
								{coalitions
									.slice(0)
									.reverse()
									.map((c) => {
										const c_u = coalitions_users?.find(
											(current) =>
												current.coalition_id === c.id
										);
										return (
											<Link
												key={c.slug}
												href={`/coalitions/${c.slug}`}
											>
												<a>
													<Flex
														as="li"
														sx={{
															gap: 2,
															alignItems:
																"center",
														}}
													>
														<Text
															px={1}
															bg={mendColor(
																c.color
															)}
															as="b"
														>
															{c.name}
														</Text>
														{c_u && (
															<>
																{" "}
																- Rank:{" "}
																{c_u.rank} -
																Score:{" "}
																{c_u.score}
															</>
														)}
													</Flex>
												</a>
											</Link>
										);
									})}
							</ul>
						) : (
							<None />
						)
					) : (
						"Loading"
					)}
				</OverviewCard>
				<OverviewCard title="Languages">
					{user.languages_users?.length ? (
						<ol>
							{user.languages_users
								.sort((a, b) => a.position - b.position)
								.map((language) => (
									<Text key={language.id.toString()} as="li">
										{language.language_id}
									</Text>
								))}
						</ol>
					) : (
						<None />
					)}
				</OverviewCard>
				<OverviewCard title="Titles">
					{user.titles.length ? (
						<ul>
							{user.titles.map((title) => (
								<Flex
									key={title.id.toString()}
									as="li"
									sx={{ gap: 2, alignItems: "baseline" }}
								>
									{title.name.replace("%login", user.login)}
									{user.titles_users.find(
										(t) =>
											t.title_id === title.id &&
											t.selected
									) && <Badge>selected</Badge>}
								</Flex>
							))}
						</ul>
					) : (
						<None />
					)}
				</OverviewCard>
			</Grid>
		</>
	);
}

UserOverview.header = UserHeader;
