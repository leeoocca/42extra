import Link from "next/link";
import { useRouter } from "next/router";

import {
	Badge,
	Box,
	Card,
	Flex,
	Grid,
	Heading,
	Progress,
	Text,
} from "@theme-ui/components";
import prettyMilliseconds from "pretty-ms";

import { locale } from "lib/constants";
import { User } from "types/42/User";
import getTimeAgo from "lib/getTimeAgo";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";
import UserHeader from "ui/headers/UserHeader";
import sortCursus from "lib/sortCursus";
import { ResponsiveRadar } from "@nivo/radar";
import nivoTheme from "lib/nivoTheme";
// import getCampusFromId from "lib/getCampusFromId";

function getCurrentLocation(locations: any): string {
	if (locations)
		// in ${getCampusFromId(locations[0].campus_id).name}
		return `${locations[0].host} for ~
		${prettyMilliseconds(Date.now() - Date.parse(locations[0].begin_at), {
			unitCount: 2,
		})}`;
	return null;
}

function getLastSeen(locations: any): string {
	if (locations) {
		if (locations.length)
			// in ${getCampusFromId(locations[0].campus_id).name}
			return `last seen ${getTimeAgo(locations[0].end_at)}`;
		else return "never seen on any campus";
	}
	return "...";
}

const None = () => <i className="opacity-75">none</i>;

const OverviewCard = ({ children, title, href = null, heigth = null }) => {
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
			<Box sx={{ height: heigth }}>{children}</Box>
		</Card>
	);
};

const MyResponsiveRadar = ({ data }) => (
	<ResponsiveRadar
		data={data}
		theme={nivoTheme}
		keys={["level"]}
		indexBy="name"
		valueFormat=">-.2f"
		margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
		maxValue={21}
		// borderColor="white"
		// gridLabelOffset={36}
		// dotSize={10}
		// dotColor="white"
		// dotBorderWidth={2}
		colors={{ scheme: "blues" }}
	/>
);

export default function UserOverview() {
	const router = useRouter();
	const { login } = router.query;

	const { data: user, isError }: { data: User; isError: any } = useAPI(
		`/v2/users/${login}`
	);
	const { data: locations } = useAPI(`/v2/users/${login}/locations`);
	const { data: coalitions } = useAPI(`/v2/users/${login}/coalitions`);
	const { data: coalitions_users } = useAPI(
		`/v2/users/${login}/coalitions_users`
	);

	if (isError) return <>Error</>;
	if (!user) return <Loading />;

	return (
		<>
			<Grid columns={[1, , 3]}>
				<OverviewCard title="Info">
					{[
						{ name: "Id", value: user.id },
						{ name: "Login", value: user.login },
						{
							name: "Email",
							value: (
								<a href={`mailto:${user.email}`}>
									{user.email}
								</a>
							),
						},
						{
							name: "Pool",
							value: user.pool_year
								? `${user.pool_month} ${user.pool_year}`
								: "none",
						},
						{
							name: "Alumni",
							value: user.alumni ? "true" : "false",
						},
						{
							name: "Launched",
							value: user["is_launched?"] ? "true" : "false",
						},
						{
							name: "Staff",
							value: user["staff?"] ? "true" : "false",
						},
					].map((e) => (
						<Flex key={e.name} as="dl" sx={{ gap: 2 }}>
							<Text as="dt" sx={{ opacity: "75%" }}>
								{e.name}
							</Text>
							<Text as="dd">{e.value}</Text>
						</Flex>
					))}
				</OverviewCard>
				<OverviewCard
					title="Location"
					href={`/users/${login}/locations`}
				>
					<Text sx={{ fontSize: 4 }}>
						{user.location
							? getCurrentLocation(locations) || user.location
							: getLastSeen(locations)}
					</Text>
				</OverviewCard>
				<OverviewCard title="Last seen online">
					<Text sx={{ fontSize: 4 }}>
						{new Date(
							new Date(user.anonymize_date).valueOf() -
								365 * 24 * 60 * 60 * 1000
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
					{coalitions && coalitions?.length ? (
						<ul>
							{coalitions.map((c) => {
								const c_u = coalitions_users?.find(
									(current) => current.coalition_id === c.id
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
													alignItems: "center",
												}}
											>
												<Text
													px={1}
													bg={c.color}
													as="b"
												>
													{c.name}
												</Text>
												{c_u && (
													<>
														{" "}
														- Rank: {c_u.rank} -
														Score: {c_u.score}
													</>
												)}
											</Flex>
										</a>
									</Link>
								);
							})}
						</ul>
					) : (
						"..."
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
				<OverviewCard title="Skills" heigth={300}>
					<MyResponsiveRadar data={user.cursus_users[0].skills} />
				</OverviewCard>
			</Grid>
		</>
	);
}

UserOverview.header = UserHeader;
