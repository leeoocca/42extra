import { Box, Heading, Text } from "@theme-ui/components";
import { formatDate, formatTime } from "lib/dateTime";
import groupBy from "lib/groupBy";
import useAPI, { useCampuses } from "lib/useAPI";
import Link from "next/link";
import { useRouter } from "next/router";
import prettyMilliseconds from "pretty-ms";
import { Location } from "types/42";
import UserHeader from "ui/headers/UserHeader";
import Loading from "ui/Loading";

const prettyOptions = { secondsDecimalDigits: 0, millisecondsDecimalDigits: 0 };

function getDayDuration(day) {
	let duration = 0;

	day.value.forEach((location) => {
		duration += rawDuration(location);
	});

	return prettyMilliseconds(duration, prettyOptions);
}

function rawDuration(location) {
	const start = Date.parse(location.begin_at);
	const end = location.end_at ? Date.parse(location.end_at) : Date.now();
	return end - start;
}

export default function UserLocations() {
	const {
		query: { login },
	} = useRouter();

	const { data: locations, isLoading } = useAPI<Location[]>(
		`/v2/users/${login}/locations`
	);

	const { data: campuses } = useCampuses();

	if (isLoading) return <Loading />;
	if (!locations) return <>Error</>;

	if (!locations.length) return <>Never seen on any campus.</>;

	const byDay = groupBy(locations, (l) => formatDate(l.begin_at));

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
								<a>
									{campuses
										? campuses.find(
												(campus) =>
													campus.id ===
													location.campus_id
										  ).name
										: location.campus_id}
								</a>
							</Link>
						</Text>
					</h4>
					<small>
						<time dateTime={location.begin_at}>
							{formatTime(location.begin_at)}
						</time>{" "}
						–{" "}
						{location.end_at ? (
							<time dateTime={location.end_at}>
								{formatTime(location.end_at)}
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
