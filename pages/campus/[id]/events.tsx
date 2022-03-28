import { useRouter } from "next/router";

import { Grid } from "@theme-ui/components";

import { Event } from "types/42/Event";
import CampusHeader from "ui/headers/CampusHeader";
import EventCard from "ui/EventCard";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";

export default function CampusUsers() {
	const router = useRouter();
	const { id } = router.query;

	const { data: events, isLoading }: { data: Event[]; isLoading: boolean } =
		useAPI(`/v2/campus/${id}/events`);

	if (isLoading) return <Loading />;

	return (
		<Grid variant="cards">
			{events.map((event) => (
				<EventCard key={event.id} event={event} />
			))}
		</Grid>
	);
}

CampusUsers.header = CampusHeader;
