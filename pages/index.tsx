import {
	Box,
	Flex,
	Grid,
	Heading,
	Link as ThemeLink,
} from "@theme-ui/components";
import useAPI from "lib/useAPI";
import { useSession } from "next-auth/react";
import { Fragment } from "react";
import { Event, ScaleTeam } from "types/42";
import EventCard from "ui/EventCard";
import Link from "ui/Link";

function scaleDescription(scale_team: ScaleTeam, current_user: string) {
	const as_corrector = scale_team.corrector.login === current_user;

	const corrector = as_corrector ? (
		"You"
	) : (
		<Link href={`/users/${scale_team.corrector.login}`}>
			{scale_team.corrector.login}
		</Link>
	);

	if (as_corrector)
		return (
			<>
				You will evaluate{" "}
				{scale_team.correcteds.map((user, index) => (
					<Fragment key={user.id}>
						{index ? ", " : ""}
						<Link href={`/users/${user.login}`}>
							{/* <Flex
								sx={{
									display: "inline-flex",
									alignItems: "baseline",
									"& img": {
										borderRadius: "99%",
									},
								}}
							>
								<Image
									height={25}
									width={25}
									objectFit="cover"
									objectPosition="center"
									src={`https://cdn.intra.42.fr/users/${user.login}.jpg`}
								/>
								<p>{user.login}</p>
							</Flex> */}
							{user.login}
						</Link>
					</Fragment>
				))}
			</>
		);

	return <>{corrector} will be evaluated </>;
}

function groupSlots(slots) {
	let grouped_slots = [];
	let tmp_begin_at = null;
	let tmp_team_id = null;

	for (let i = 0; i < slots.length; ++i) {
		if (!tmp_begin_at) {
			tmp_begin_at = slots[i].begin_at;
			tmp_team_id = slots[i].scale_team?.id;
		} else if (slots[i].scale_team?.id !== tmp_team_id) {
			slots[i - 1].begin_at = tmp_begin_at;
			grouped_slots.push(slots[i - 1]);
			tmp_begin_at = slots[i].begin_at;
			tmp_team_id = slots[i].scale_team?.id;
		} else if (i === slots.length - 1) {
			slots[i].begin_at = tmp_begin_at;
			grouped_slots.push(slots[i]);
		}
	}
	return grouped_slots;
}

function removeTimeFromDate(date: Date) {
	return new Date(date.toDateString()).valueOf();
}

function isSameDate(begin_at: Date, end_at: Date) {
	return removeTimeFromDate(begin_at) === removeTimeFromDate(end_at);
}

export default function Home() {
	const { data: session } = useSession();

	const { data: myEvents } = useAPI<Event[]>(
		`/v2/users/${session.user.id}/events?page[size]=3&filter[future]=true`
	);
	const { data: campusEvents } = useAPI<Event[]>(
		`/v2/campus/${session.user.campus}/events?page[size]=3&sort=begin_at&filter[future]=true`
	);

	const { data: slots } = useAPI<any>(
		"/v2/me/slots?page[size]=100&sort=begin_at&filter[future]=true"
	);

	const dateOpts: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	};
	const timeOpts: Intl.DateTimeFormatOptions = {
		hour: "numeric",
		minute: "numeric",
		hour12: false,
	};

	return (
		<>
			<Heading sx={{ textAlign: "center", mb: 2, fontSize: "2rem" }}>
				Welcome {session?.user ? session.user.name : "user"}!
			</Heading>
			<Heading m={3}>Your agenda</Heading>
			{myEvents ? (
				myEvents.length ? (
					<Grid variant="cards">
						{myEvents.map((event) => (
							<EventCard key={event.id} event={event} />
						))}
					</Grid>
				) : (
					<Box as="p" mx="3">
						Not subscribed to any future event
					</Box>
				)
			) : (
				"Loading..."
			)}
			<Heading m={3}>Campus events</Heading>
			{campusEvents ? (
				<Grid variant="cards">
					{campusEvents.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
				</Grid>
			) : (
				"Loading..."
			)}
			<Flex m={3} sx={{ alignItems: "baseline" }}>
				<Heading>Slots</Heading>
				<ThemeLink
					href="https://profile.intra.42.fr/slots"
					target="_blank"
					rel="noreferrer noopener"
					mx={2}
				>
					<small>Manage</small>
				</ThemeLink>
			</Flex>
			<Box mx={3} marginTop={-3}>
				{slots ? (
					slots.length ? (
						<ul>
							{groupSlots(slots).map((slot) => {
								const begin_at = new Date(slot.begin_at);
								const end_at = new Date(slot.end_at);
								return (
									<Box as="li" key={slot.id} my={2}>
										<small>
											{begin_at
												.toISOString()
												.slice(0, 10)}{" "}
											{begin_at.toLocaleTimeString(
												"en",
												timeOpts
											)}{" "}
											-{" "}
											{!isSameDate(begin_at, end_at) &&
												end_at
													.toISOString()
													.slice(0, 10)}{" "}
											{end_at.toLocaleTimeString(
												"en",
												timeOpts
											)}
										</small>
										<br />
										{/* {JSON.stringify(slot.scale_team)} */}
										{slot.scale_team
											? scaleDescription(
													slot.scale_team,
													session.user.login
											  )
											: "Free slot"}
									</Box>
								);
							})}
						</ul>
					) : (
						<p>No slots scheduled</p>
					)
				) : (
					"Loading..."
				)}
			</Box>

			{/* try cmd + k */}
		</>
	);
}
