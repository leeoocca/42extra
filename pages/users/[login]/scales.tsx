import { Box } from "@theme-ui/components";
import { formatDate } from "lib/dateTime";
import useAPI from "lib/useAPI";
import { useRouter } from "next/router";
import { ScaleTeam } from "types/42/ScaleTeam";
import Card from "ui/cards/Card";
import ScalesGraph from "ui/graphs/ScalesGraph";
import CardGrid from "ui/grids/CardGrid";
import UserHeader from "ui/headers/UserHeader";
import Link from "ui/Link";
import Loading from "ui/Loading";

function getDuration(begin, end) {
	let time = new Date(new Date(end).getTime() - new Date(begin).getTime());
	let minutes = time.getUTCMinutes();
	let hours = time.getUTCHours();

	if (hours >= 1) return hours + "h " + minutes + "min";
	return minutes + "min";
}

function ScaleCard({ scale, login }: { scale: ScaleTeam; login: string }) {
	const project_name = scale.team.project_gitlab_path
		?.split("/")
		.pop()
		.replaceAll("-", " ");

	return (
		<Card key={scale.id}>
			<div className="w-full flex flex-col gap-2">
				<p>
					<Link
						href={`/users/${scale.correcteds[0].login}/${scale.team.project_id}`}
					>
						{project_name}
					</Link>{" "}
					{scale.team.name}
					{" ["}
					<span
						className={`${
							scale.team["validated?"]
								? "text-green-400"
								: "text-red-600"
						}`}
					>
						{scale.final_mark ?? "no grade"}
					</span>
					{"]"}
				</p>
				<p>
					Team:{" "}
					{scale.correcteds.map((user, index) => (
						<>
							{user.login !== login ? (
								<Link
									href={`/users/${user.login}`}
									sx={{
										color: "text",
									}}
								>
									{user.login}
								</Link>
							) : (
								<b
									style={{
										color: "var(--theme-ui-colors-primary)",
									}}
								>
									{user.login}
								</b>
							)}
							{index !== scale.correcteds.length - 1 && ", "}
						</>
					))}
				</p>
				<p className="text-xs">
					{scale.corrector.login !== login ? (
						<Link
							href={`/users/${scale.corrector.login}`}
							sx={{
								color: "text",
							}}
						>
							{scale.corrector.login}
						</Link>
					) : (
						<b
							style={{
								color: "var(--theme-ui-colors-primary)",
							}}
						>
							{scale.corrector.login}
						</b>
					)}
					<br />
					<span
						className="text-xs opacity-75"
						style={{ wordBreak: "break-word" }}
					>
						{scale.comment}
					</span>
				</p>
				<p className="text-xs">
					{scale.correcteds[0].login !== login ? (
						<Link
							href={`/users/${scale.correcteds[0].login}`}
							sx={{
								color: "text",
								fontWeight: "bold",
							}}
						>
							{scale.correcteds[0].login}
						</Link>
					) : (
						<b
							style={{
								color: "var(--theme-ui-colors-primary)",
							}}
						>
							{scale.correcteds[0].login}
						</b>
					)}
					<br />
					<span
						className="text-xs opacity-75"
						style={{ wordBreak: "break-word" }}
					>
						{scale.feedback}
					</span>
				</p>
				<Box as="details" mt={1}>
					<summary>Details</summary>
					<p className="text-xs">
						<span
							className={`${
								scale.team["validated?"]
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
		<div className="flex flex-col gap-2">
			{history && <ScalesGraph history={history} />}
			{(!history || !scales) && <Loading />}
			{scales && (
				<CardGrid>
					{scales.map((scale) => (
						<ScaleCard
							key={scale.id}
							scale={scale}
							login={login.toString()}
						/>
					))}
				</CardGrid>
			)}
		</div>
	);
}

UserScales.header = UserHeader;
