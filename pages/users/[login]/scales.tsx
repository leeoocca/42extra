import { Box } from "@theme-ui/components";
import { formatDate } from "lib/dateTime";
import useAPI from "lib/useAPI";
import { useRouter } from "next/router";
import Card from "ui/cards/Card";
import ScalesGraph from "ui/graphs/ScalesGraph";
import CardGrid from "ui/grids/CardGrid";
import UserHeader from "ui/headers/UserHeader";
import Loading from "ui/Loading";

function getDuration(begin, end) {
	let time = new Date(new Date(end).getTime() - new Date(begin).getTime());
	let minutes = time.getUTCMinutes();
	let hours = time.getUTCHours();

	if (hours >= 1) return hours + "h " + minutes + "min";
	return minutes + "min";
}

function ScaleCard({ scale, login }) {
	const project_name = scale.team.project_gitlab_path
		?.split("/")
		.pop()
		.replaceAll("-", " ");

	return (
		<Card key={scale.id}>
			<div className="w-full">
				{/* <Link
					href={`/users/${scale.correcteds[0].login}/${project_name}`}
				> */}
				{scale.correcteds.map((user) => user.login).join(", ")}&apos;s{" "}
				<b style={{ fontSize: 15 }}>
					{project_name}
					{" ["}
					<span
						className={`${scale.team["validated?"]
							? "text-green-400"
							: "text-red-600"
							}`}
					>
						{scale.final_mark}
					</span>
					{"]"}
				</b>
				{/* </Link> */}
				<p className="text-xs">
					{scale.corrector.login == login ? (
						<b>{scale.corrector.login}: </b>
					) : (
						scale.corrector.login + ": "
					)}
					<span
						className="text-xs opacity-75"
						style={{ wordBreak: "break-word" }}
					>
						{scale.comment}
					</span>
				</p>
				<hr className="my-1 opacity-50" />
				<p className="text-xs">
					{scale.correcteds[0].login == login ? (
						<b>{scale.correcteds[0].login}: </b>
					) : (
						scale.correcteds[0].login + ": "
					)}
					<span
						className="text-xs opacity-75"
						style={{ wordBreak: "break-word" }}
					>
						{scale.feedback}
					</span>
				</p>
				<hr className="my-1 opacity-50" style={{ height: 20 }} />
				<Box as="details" mt={-2}>
					<summary>Details</summary>
					<hr className="my-1 opacity-50" />
					<p className="text-xs">
						<span
							className={`${scale.team["validated?"]
								? "text-green-400"
								: "text-red-600"
								}`}
						>
							{scale.final_mark}
						</span>
						{" - "}
						{scale.flag.name}
						<br />
						Role:{" "}
						<b>
							{" "}
							{scale.corrector.login == login
								? "corrector"
								: "corrected"}{" "}
						</b>
						<br />
						Date: <b>{formatDate(scale.begin_at)}</b>
						<br />
						ID: <b>{scale.scale_id}</b>
						<br />
						Duration:{" "}
						<b>{getDuration(scale.begin_at, scale.filled_at)}</b>
						<br />
						Expected duration:{" "}
						<b> {scale.scale.duration / 60} minutes</b>
						<br />
						Occurrence:{" "}
						<b>
							{scale.team.users[0].occurrence + 1}{" "}
							{scale.team.users[0].occurrence + 1 > 1
								? "times"
								: "time"}
						</b>
						<br />
						<b>
							{" "}
							{scale.correcteds.length > 1
								? "Team name: " + scale.team.name
								: ""}
						</b>
					</p>
				</Box>
			</div>
		</Card>
	);
}

export default function UserScales() {
	const {
		query: { login },
	} = useRouter();

	const { data: scales, isLoading } = useAPI<any>(
		`/v2/users/${login}/scale_teams`
	); // TODO add scales interface

	const { data: history } = useAPI<any>(
		`/v2/users/${login}/correction_point_historics?sort=created_at`
	); // TODO add historics interface

	// useEffect(() => {
	// 	if (!history) return;
	// }, [history]);

	if (!isLoading && !scales) return <>Error</>;

	if (scales && !scales.length)
		return (
			<>
				No scales for <b>{login}</b>
			</>
		);

	return (
		<>
			{history && <ScalesGraph history={history} />}
			{(!history || !scales) && <Loading />}
			{scales && (
				<CardGrid>
					{scales.map((scale) => (
						<ScaleCard key={scale.id} scale={scale} login={login} />
					))}
				</CardGrid>
			)}
		</>
	);
}

UserScales.header = UserHeader;
