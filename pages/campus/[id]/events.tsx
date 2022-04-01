import { useRouter } from "next/router";

import { Grid, Heading } from "theme-ui";

import { Event } from "types/42";
import CampusHeader from "ui/headers/CampusHeader";
import EventCard from "ui/EventCard";
import isFuture from "lib/isFuture";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";

export default function CampusUsers() {
	const {
		query: { id },
	} = useRouter();

	const { data: events, isLoading } = useAPI<Event[]>(
		`/v2/campus/${id}/events`
	); // TODO sort by closest

	if (isLoading) return <Loading />;

	return (
		<>
			<Heading>Future</Heading>
			<Grid variant="cards">
				{events
					.filter((event) => isFuture(event.end_at))
					.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
			</Grid>
			<Heading>Past</Heading>
			<Grid variant="cards">
				{events
					.filter((event) => isFuture(event.end_at))
					.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
			</Grid>
		</>
	);
}

CampusUsers.header = CampusHeader;
