import { Box, Heading, Text } from "@theme-ui/components";
import { formatDate, formatTime } from "lib/dateTime";
import groupBy from "lib/groupBy";
import nivoTheme from "lib/nivoTheme";
import useAPI, { useCampuses } from "lib/useAPI";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import prettyMilliseconds from "pretty-ms";
import { useMemo } from "react";
import { Location } from "types/42";
import UserHeader from "ui/headers/UserHeader";
import Link from "ui/Link";
import Loading from "ui/Loading";

const ResponsiveCalendar = dynamic(
	() => import("@nivo/calendar").then((m) => m.ResponsiveCalendar),
	{ ssr: false }
);

const prettyOptions = { secondsDecimalDigits: 0, millisecondsDecimalDigits: 0 };

function getRawDuration(day) {
	let duration = 0;

	day.value.forEach((location) => {
		duration += rawDuration(location);
	});

	return duration;
}

function rawDuration(location) {
	const start = Date.parse(location.begin_at);
	const end = location.end_at ? Date.parse(location.end_at) : Date.now();
	return end - start;
}

const prettyDuration = (value) => prettyMilliseconds(value, prettyOptions);

function prepareDays(locations) {
	if (!locations) return [];
	locations.forEach((location) => {
		delete location.user;
	});
	const daysGouped = groupBy(locations, (l: Location) =>
		formatDate(l.begin_at)
	);
	let days = [];
	daysGouped.forEach((day) => {
		const duration = getRawDuration(day);
		let tmp = {
			day: day.name,
			locations: day.value,
			value: duration / 1000 / 60,
			prettyDuration: prettyDuration(duration),
		};
		days.push(tmp);
	});
	return days;
}

const MyResponsiveCalendar = ({ data }) => {
	const router = useRouter();
	if (!data) return;
	const from = data[0].day;
	const to = data[data.length - 1].day;

	return (
		<div style={{ height: 300, overflow: "hidden" }}>
			<ResponsiveCalendar
				data={data}
				from={from}
				to={to}
				emptyColor="rgba(255 255 255 / .1)"
				colors={["var(--theme-ui-colors-primary)"]}
				margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
				yearSpacing={10}
				monthBorderColor="transparent"
				dayBorderWidth={1}
				dayBorderColor="var(--theme-ui-colors-background)"
				theme={nivoTheme}
				valueFormat={prettyDuration}
				onClick={(day, event) => router.push(`#${day.day}`)}
			/>
		</div>
	);
};

export default function UserLocations() {
	const {
		query: { login },
	} = useRouter();

	const { data: locations, isLoading } = useAPI<Location[]>(
		`/v2/users/${login}/locations`
	);

	const { data: campuses } = useCampuses();
	const byDay = useMemo(() => prepareDays(locations), [locations]);

	if (isLoading) return <Loading />;
	if (!locations) return <>Error</>;

	if (!locations.length) return <>Never seen in any campus.</>;

	return (
		<>
			<MyResponsiveCalendar data={byDay} />
			{byDay.map((day) => (
				<Box key={day.day} id={day.day} as="section" my={2}>
					<Heading>{day.day}</Heading>
					<Text>
						{day.prettyDuration}
						{day.locations[0].end_at ? "" : " ++"}
					</Text>
					{day.locations.map((location) => (
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
									<Link
										href={`/campus/${location.campus_id}`}
									>
										{campuses
											? campuses.find(
													(campus) =>
														campus.id ===
														location.campus_id
											  ).name
											: location.campus_id}
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
			))}
		</>
	);
}

UserLocations.header = UserHeader;
