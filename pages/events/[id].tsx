import {
	Box,
	Button,
	Flex,
	Grid,
	Heading,
	Link as TLink,
	Spinner,
	Text,
} from "@theme-ui/components";
import { CalendarOptions, GoogleCalendar, ICalendar } from "datebook";
import { setPrimaryColor } from "lib/color";
import fetcher from "lib/fetcher";
import getPrettyDuration from "lib/getPrettyDuration";
import { getEventLink } from "lib/intraLink";
import isFuture from "lib/isFuture";
import isUrl from "lib/isUrl";
import useAPI, { useCampuses, useCursuses } from "lib/useAPI";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Event, EventUser } from "types/42";
import UILink from "ui/Link";
import Loading from "ui/Loading";
import PageTitle from "ui/PageTitle";
import RelativeTime from "ui/RelativeTime";

const width = ["100%", , "75%"];

const colors = {
	meet_up: "#932526",
	event: "#9a72c6",
	workshop: "#87b121",
	conference: "#1c455f",
};

const CalendarButton = (props) => <Button sx={{ width: "100%" }} {...props} />;

function EventHeader() {
	const {
		query: { id },
	} = useRouter();

	const { data } = useAPI<Event>(`/v2/events/${id}`);
	const { data: campuses } = useCampuses();

	const event = data || { name: "Loading...", kind: "...", location: "..." };

	const campus = data
		? campuses?.find((campus) => data.campus_ids.includes(campus.id))
		: null;

	useEffect(() => {
		setPrimaryColor(data ? colors[event.kind] : "" || "");
		return () => setPrimaryColor();
	}, [event]);

	const locatonIsUrl = isUrl(event.location);

	return (
		<Box sx={{ m: 3 }}>
			<Box sx={{ width: width, mx: "auto" }}>
				<Text variant="mono">{event.kind}</Text>
				<Heading as="h1" my={1}>
					{event.name}
				</Heading>
				<Box>
					{!data || (
						<Text>
							{campus?.name}
							{data?.campus_ids.length > 1
								? ` + ${data.campus_ids.length - 1} other`
								: ""}
						</Text>
					)}
					{data && event.location && " – "}
					{locatonIsUrl ? (
						<TLink
							href={event.location}
							sx={{
								textOverflow: "ellipsis",
								overflow: "hidden",
								display: "block",
								whiteSpace: "nowrap",
								color: "text",
							}}
							target="_blank"
							rel="noopener noreferrer"
						>
							{event.location}
						</TLink>
					) : (
						event.location
					)}
				</Box>
			</Box>
		</Box>
	);
}

export default function EventDetails() {
	const { data: session } = useSession();

	const {
		query: { id },
	} = useRouter();

	const [loading, setLoading] = useState<boolean | null>(true); // null = error
	const [status, setStatus] = useState<boolean | null>(null);
	const { data: campuses } = useCampuses();
	const { data: cursuses } = useCursuses();

	const { data: event } = useAPI<Event>(`/v2/events/${id}`);

	const { data: eventUser } = useAPI<EventUser[]>(
		`/v2/events_users?filter[event_id]=${id}&filter[user_id]=${session.user.id}`
	);

	useEffect(() => {
		if (eventUser) {
			setStatus(!!eventUser.length);
			setLoading(false);
		}
	}, [eventUser]);

	function subscribe() {
		fetcher(
			`/api/v2/events_users?events_user[event_id]=${id}&events_user[user_id]=${session.user.id}`,
			"POST"
		).then((res) => {
			if (res.status === 201) {
				setStatus(true);
			} else {
				throw Error();
			}
		});
	}

	function unsubscribe() {
		fetcher(`/api/v2/events_users/${eventUser[0].id}`, "DELETE")
			.then((res) => {
				if (res.status === 204) {
					setStatus(false);
				} else {
					throw Error();
				}
			})
			.catch();
	}

	function handleSubscription() {
		setLoading(true);

		try {
			if (status) {
				unsubscribe();
			} else {
				subscribe();
			}
		} catch (Error) {
			setLoading(null);
			return;
		}
		setLoading(false);
	}

	if (!event) return <Loading />;

	const isDisabled = loading || !isFuture(event.begin_at);

	const config: CalendarOptions = {
		title: event.name,
		location: event.location,
		description: event.description.replace("\r", ""), // TODO check if it's working
		// description: ReactDOMServer.renderToStaticMarkup(
		// 	<ReactMarkdown remarkPlugins={[remarkGfm]}>
		// 		{event.description}
		// 	</ReactMarkdown>
		// ),
		start: new Date(event.begin_at),
		end: new Date(event.end_at),
	};

	const icalendar = new ICalendar(config);
	const googleCalendar = new GoogleCalendar(config);

	return (
		<>
			<PageTitle title={event.name} />
			<Flex
				as="article"
				sx={{
					flexDirection: "column",
					width: width,
					mx: "auto",
					gap: 3,
				}}
			>
				<Flex sx={{ flexDirection: "column" }}>
					<time>
						<RelativeTime date={event.begin_at} /> for{" "}
						{getPrettyDuration(event.begin_at, event.end_at)}
					</time>
					<time></time>
					<time>{event.begin_at}</time>
					<time>{event.end_at}</time>
				</Flex>
				<Box>
					<Button
						onClick={() => handleSubscription()}
						mr={2}
						disabled={isDisabled}
						sx={{
							bg: isDisabled
								? "muted"
								: loading === null
								? "red"
								: "",
						}}
					>
						{loading && (
							<Spinner
								sx={{
									color: "white",
									display: "inline",
									mr: 1,
								}}
								size={20}
							/>
						)}
						{status ? "Unsubscribe" : "Subscribe"}
					</Button>
					{event.nbr_subscribers}{" "}
					{event.max_people && <>/ {event.max_people}</>}
				</Box>
				<Box sx={{}}>
					<ReactMarkdown
						components={{
							a: ({ ...props }) => <TLink {...props} />,
						}}
						remarkPlugins={[remarkGfm]}
					>
						{event.description}
					</ReactMarkdown>
				</Box>
				<Grid columns={2}>
					<CalendarButton onClick={() => icalendar.download()}>
						Download .ics
					</CalendarButton>
					<CalendarButton
						as="a"
						href={googleCalendar.render()}
						target="_blank"
						rel="noopener noreferrer"
					>
						Add to Google Calendar
					</CalendarButton>
				</Grid>
				<Grid columns={2} mt={3}>
					<Box>
						<Heading>Campuses</Heading>
						<Text as="ul" pl={3}>
							{event.campus_ids.map((campus_id) => (
								<Text key={campus_id} as="li">
									<UILink
										href={`/campus/${campus_id}`}
										passHref
									>
										{campuses?.find(
											(campus) => campus.id === campus_id
										).name || campus_id}
									</UILink>
								</Text>
							))}
						</Text>
					</Box>
					<Box>
						<Heading>Cursuses</Heading>
						<Text as="ul" pl={3}>
							{event.cursus_ids.map((cursus_id) => (
								<Text key={cursus_id} as="li">
									<UILink href={`/cursus/${cursus_id}`}>
										{cursuses?.find(
											(campus) => campus.id === cursus_id
										).name || cursus_id}
									</UILink>
								</Text>
							))}
						</Text>
					</Box>
				</Grid>
			</Flex>
		</>
	);
}

EventDetails.header = EventHeader;
EventDetails.getIntraLink = getEventLink;
