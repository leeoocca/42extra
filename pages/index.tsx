import { Alert, Button, Grid, Heading } from "theme-ui";
import { signIn, useSession } from "next-auth/react";

import useAPI from "lib/useAPI";
import EventCard from "ui/EventCard";

export default function Home() {
	const { data: session } = useSession();

	const { data: myEvents } = useAPI(
		`/v2/users/${session.user.id}/events?page[size]=3`
	);
	const { data: campusEvents } = useAPI(
		`/v2/campus/${session.user.campus}/events?page[size]=3`
	);

	// const { data } = useAPI("/v2/me/slots?page[size]=100");

	// const opts: Intl.DateTimeFormatOptions = {
	// 	year: "numeric",
	// 	month: "2-digit",
	// 	day: "2-digit",
	// 	hour: "numeric",
	// 	minute: "numeric",
	// 	hour12: false,
	// };

	return (
		<>
			{session.tokenExpires < Date.now() / 1000 && (
				<Alert
					sx={{ display: "flex", justifyContent: "space-between" }}
				>
					<span>Stale session</span>
					<Button
						bg="transparent"
						sx={{
							textTransform: "uppercase",
							fontSize: 1,
							fontWeight: "heading",
						}}
						onClick={() => signIn("42")}
					>
						Sign back in
					</Button>
				</Alert>
			)}
			<Heading sx={{ textAlign: "center", mb: 2, fontSize: "2rem" }}>
				Welcome {session?.user ? session.user.name : "user"}!
			</Heading>
			<Heading>Your events</Heading>
			{myEvents && (
				<Grid variant="cards">
					{myEvents.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
				</Grid>
			)}
			<Heading>Campus events</Heading>
			{campusEvents && (
				<Grid variant="cards">
					{campusEvents.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
				</Grid>
			)}
			<ul style={{ textAlign: "left" }}>
				{/* {data
					?.filter(
						(slot) => new Date(slot.begin_at).valueOf() > Date.now()
					)
					.map((slot) => (
						<li>
							<small>
								{new Date(slot.begin_at).toLocaleString(
									"en",
									opts
								)}
							</small>
							<small>
								{new Date(slot.end_at).toLocaleString(
									"en",
									opts
								)}
							</small>
							{slot.scale_team && slot.scale_team}
						</li>
					))} */}
			</ul>
			{/* try cmd + k */}
		</>
	);
}
