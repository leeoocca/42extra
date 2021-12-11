import { useRouter } from "next/router";

import { Heading, Card, Text, Grid } from "@theme-ui/components";
import { useSession } from "next-auth/react";

import { locale } from "lib/constants";
import CursusHeader from "ui/headers/CursusHeader";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";

function EventCard({ event }) {
	return (
		<Card bg="muted" px={3} py={2}>
			<b>{event.name}</b>
			<Text as="p" sx={{ fontFamily: "monospace" }}>
				{event.kind}
			</Text>
			<p>
				{event.nbr_subscribers}
				{event.max_people && ` / ${event.max_people}`}
			</p>
			<p>{event.location}</p>
			<p>{new Date(event.begin_at).toLocaleString(locale)}</p>
		</Card>
	);
}

export default function CursusEvents() {
	const router = useRouter();
	const { slug } = router.query;

	const { data: session } = useSession();

	const { data: events } = useAPI(`/v2/cursus/${slug}/events`);

	if (!events) return <Loading />;

	return (
		<>
			<Heading>Your campus</Heading>
			<Grid variant="cards">
				{events
					.filter((event) =>
						event.campus_ids.includes(session.user.campus)
					)
					.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
			</Grid>
			<Heading>Other campuses</Heading>
			<Grid variant="cards">
				{events
					.filter(
						(event) =>
							!event.campus_ids.includes(session.user.campus)
					)
					.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
			</Grid>
		</>
	);
}

CursusEvents.header = CursusHeader;
