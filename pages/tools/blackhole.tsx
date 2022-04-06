import { ChangeEvent, Fragment } from "react";
import {
	Box,
	Flex,
	Select,
	Text,
	Link as TLink,
	Avatar,
	Divider,
	Label,
	Input,
} from "@theme-ui/components";
import { CursusUser } from "types/42";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import groupBy from "lib/groupBy";
import Loading from "ui/Loading";
import PageTitle from "ui/PageTitle";
import RelativeTime from "ui/RelativeTime";
import useAPI, { useCampuses } from "lib/useAPI";
import useSWR from "swr";
import Link from "next/link";
import isFuture from "lib/isFuture";
import { locale } from "lib/constants";
import { useDebouncedValue } from "lib/useDebouncedValue";

function Results({
	campus,
	past,
	future,
}: {
	campus: string;
	past: string;
	future: string;
}) {
	const [now] = useState(new Date());

	const { data } = useSWR<CursusUser[]>(
		() =>
			`/api/v2/cursus/21/cursus_users?` +
			new URLSearchParams({
				"filter[campus_id]": campus,
				"range[blackholed_at]": [
					new Date(
						now.valueOf() - 1000 * 60 * 60 * 24 * +past
					).toISOString(),
					new Date(
						now.valueOf() + 1000 * 60 * 60 * 24 * +future
					).toISOString(),
				].join(","),
				sort: "blackholed_at",
			})
	);

	if (!data) return <Text>Loading...</Text>;

	let firstFuture = true;

	return (
		<Flex as="ul" sx={{ flexDirection: "column", gap: 3 }}>
			{data.map((projectUser) => (
				<Fragment key={projectUser.id}>
					{isFuture(projectUser.blackholed_at) &&
						firstFuture &&
						!(firstFuture = !firstFuture) && <Divider />}
					<Flex as="li" sx={{ justifyContent: "space-between" }}>
						<Link
							href={`/users/${projectUser.user.login}`}
							passHref
						>
							<TLink
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
									src={projectUser.user.image_url}
								/>
								{projectUser.user.login}
							</TLink>
						</Link>
						<RelativeTime date={projectUser.blackholed_at} bh />
					</Flex>
				</Fragment>
			))}
		</Flex>
	);
}

export default function BlackHoleByCampus() {
	const { data: session } = useSession();

	const [campus, setCampus] = useState<string>(
		String(session.user.campus) || "1"
	);
	const [past, setPast] = useState<string>("7");
	const [future, setFuture] = useState<string>("30");

	const [debouncedPast, setDebouncedPast] = useState<string>(past);
	const [debouncedFuture, setDebouncedFuture] = useState<string>(future);

	const { data: campuses } = useCampuses();

	const dPast = useDebouncedValue(past, 1000);
	const dFuture = useDebouncedValue(future, 1000);

	useEffect(() => setDebouncedPast(dPast), [dPast]);
	useEffect(() => setDebouncedFuture(dFuture), [dFuture]);

	if (!campus || !campuses) return <Loading />;

	const campusesByCountry = groupBy(
		campuses.sort((a, b) => a.country.localeCompare(b.country, locale)),
		(campus) => campus.country
	);

	return (
		<>
			<PageTitle title="BlackHole" />
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
					<Box>
						<Label htmlFor="future">Days in the future</Label>
						<Input
							name="future"
							type="number"
							value={future}
							min="0"
							max="90"
							onChange={(e) =>
								setFuture(
									e.target.value.length && e.target.value
								)
							}
						/>
					</Box>
				</Flex>
				<Results
					campus={campus}
					past={debouncedPast}
					future={debouncedFuture}
				/>
			</Box>
		</>
	);
}
