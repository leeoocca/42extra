import {
	Avatar,
	Box,
	Flex,
	Input,
	Label,
	Select,
	Text,
} from "@theme-ui/components";
import { locale } from "lib/constants";
import groupBy from "lib/groupBy";
import { useCampuses } from "lib/useAPI";
import { useDebouncedValue } from "lib/useDebouncedValue";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { CursusUser } from "types/42";
import Link from "ui/Link";
import Loading from "ui/Loading";
import PageTitle from "ui/PageTitle";
import RelativeTime from "ui/RelativeTime";

function Results({ campus, past }: { campus: string; past: string }) {
	const [now] = useState(new Date());

	const { data } = useSWR<CursusUser[]>(
		() =>
			`/api/v2/cursus/21/cursus_users?` +
			new URLSearchParams({
				"filter[campus_id]": campus,
				"range[end_at]": [
					new Date(
						now.valueOf() - 1000 * 60 * 60 * 24 * +past
					).toISOString(),
					new Date(now).toISOString(),
				].join(","),
				sort: "end_at",
			})
	);

	if (!data) return <Text>Loading...</Text>;

	return (
		<Box as="table" sx={{ width: "100%" }}>
			<thead>
				<tr>
					<th align="left">User</th>
					<th>Level</th>
					<th>Kickoff</th>
					<th>Days</th>
				</tr>
			</thead>
			<tbody>
				{data.map((projectUser) => (
					<tr key={projectUser.id}>
						<Box as="td" paddingTop={2}>
							<Link
								href={`/users/${projectUser.user.login}`}
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 2,
								}}
							>
								<Avatar
									sx={{
										minWidth: "auto",
										width: 32,
										height: 32,
										objectFit: "cover",
										objectPosition: "center",
									}}
									src={projectUser.user.image.versions.small}
								/>
								{projectUser.user.login}
							</Link>
						</Box>
						<td align="center">
							{projectUser.level != 0 ? (
								projectUser.level.toPrecision(3)
							) : (
								<Text sx={{ opacity: 0.5 }}>0</Text>
							)}
						</td>
						<td align="center">
							{new Date(projectUser.begin_at)
								.toISOString()
								.slice(0, 7)}
						</td>
						<td align="center">
							<RelativeTime date={projectUser.end_at} bh />{" "}
						</td>
					</tr>
				))}
			</tbody>
		</Box>
	);
}

export default function BlackHoleByCampus() {
	const { data: session } = useSession();

	const [campus, setCampus] = useState<string>(
		String(session.user.campus) || "1"
	);
	const [past, setPast] = useState<string>("14");

	const [debouncedPast, setDebouncedPast] = useState<string>(past);

	const { data: campuses } = useCampuses();

	const dPast = useDebouncedValue(past, 1000);

	useEffect(() => setDebouncedPast(dPast), [dPast]);

	if (!campus || !campuses) return <Loading />;

	const campusesByCountry = groupBy(
		campuses.sort((a, b) => a.country.localeCompare(b.country, locale)),
		(campus) => campus.country
	);

	return (
		<>
			<PageTitle title="Black Hole" />
			<Box sx={{ width: ["100%", , "50%"], mx: "auto" }}>
				<Flex sx={{ gap: 2 }}>
					<Box>
						<Label htmlFor="campus">Campus</Label>
						<Select
							name="campus"
							value={campus}
							mb={3}
							onChange={(event) => setCampus(event.target.value)}
						>
							{campusesByCountry.map((country) => (
								<optgroup
									key={country.name}
									label={country.name}
								>
									{country.value.map((campus) => (
										<option
											key={campus.id}
											value={campus.id}
										>
											{campus.name}
										</option>
									))}
								</optgroup>
							))}
						</Select>
					</Box>
					<Box>
						<Label htmlFor="past">Days ago</Label>
						<Input
							name="past"
							type="number"
							value={past}
							min="0"
							max="90"
							onChange={(e) =>
								setPast(e.target.value.length && e.target.value)
							}
						/>
					</Box>
				</Flex>
				<Results campus={campus} past={debouncedPast} />
			</Box>
		</>
	);
}
