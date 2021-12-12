import Link from "next/link";
import { useRouter } from "next/router";

import { Box, Heading, Text } from "@theme-ui/components";
import prettyMilliseconds from "pretty-ms";

import { locale } from "lib/constants";
import groupBy from "lib/groupBy";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";
import UserHeader from "ui/headers/UserHeader";

const prettyOptions = { secondsDecimalDigits: 0 };

function getDayDuration(day) {
	let duration = 0;

	day.value.forEach((location) => {
		duration += rawDuration(location);
	});

	return prettyMilliseconds(duration, prettyOptions);
}

function rawDuration(location) {
	const start = new Date(location.begin_at).valueOf();
	const end = location.end_at
		? new Date(location.end_at).valueOf()
		: Date.now();
	return end - start;
}

export default function UserLocations() {
	const router = useRouter();
	const { login } = router.query;

	const { data: locations, isLoading } = useAPI(
		`/v2/users/${login}/locations`
	);

	if (isLoading) return <Loading />;
	if (!locations) return <>Error</>;

	if (!locations.length) return <>Never seen on any campus.</>;

	const byDay = groupBy(locations, (l) =>
		new Date(l.begin_at).toDateString()
	);

	return byDay.map((day) => (
		<Box key={day.name} as="section" my={2}>
			<Heading>{day.name} </Heading>
			<Text>
				{getDayDuration(day)}
				{day.value[0].end_at ? "" : " ++"}
			</Text>
			{day.value.map((location) => (
				<Box
					key={location.id}
					my={3}
					sx={{ fontFeatureSettings: "'tnum'" }}
				>
					<h4>
						<b>{location.host}</b>
						<Text opacity="50%">
							{" "}
							@{" "}
							<Link href={`/campus/${location.campus_id}`}>
								<a>{location.campus_id}</a>
							</Link>
						</Text>
					</h4>
					<small>
						<time dateTime={location.begin_at}>
							{new Date(location.begin_at).toLocaleTimeString(
								locale
							)}
						</time>{" "}
						–{" "}
						{location.end_at ? (
							<time dateTime={location.end_at}>
								{new Date(location.end_at).toLocaleTimeString(
									locale
								)}
							</time>
						) : (
							<Text color="#01FF70">active</Text>
						)}
					</small>
				</Box>
			))}
		</Box>
	));
}

UserLocations.header = UserHeader;
