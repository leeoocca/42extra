import { ResponsiveLine } from "@nivo/line";
import { Box } from "@theme-ui/components";
import { formatDate } from "lib/dateTime";
import useAPI from "lib/useAPI";
import { useRouter } from "next/router";
import Card from "ui/cards/Card";
import CardGrid from "ui/grids/CardGrid";
import UserHeader from "ui/headers/UserHeader";
import Loading from "ui/Loading";

function fillDatas(history, id, pointDatas) {
	let data: Array<{
		x: string;
		y: number;
	}> = [];

	history.map((m) => {
		data.push({
			x: new Date(m.created_at).toLocaleString(),
			y: parseInt(m.total + m.sum),
		});
	});

	pointDatas.push({
		id: String(id),
		data: data.reverse(),
	});
}

function getDuration(begin, end) {
	let time = new Date(new Date(end).getTime() - new Date(begin).getTime());
	let minutes = time.getUTCMinutes();
	let hours = time.getUTCHours();

	if (hours >= 1) return hours + "h " + minutes + "min";
	return minutes + "min";
}

const ResponsivePointLine = ({ data, points }) => (
	<div style={{ height: 150 }}>
		<ResponsiveLine
			data={data}
			crosshairType="cross"
			margin={{ top: 0, right: 7, bottom: 3, left: 0 }}
			xScale={{
				type: "point",
			}}
			yScale={{
				type: "linear",
				min: "auto",
				max: "auto",
				reverse: false,
			}}
			colors="var(--theme-ui-colors-primary)"
			curve="monotoneX"
			axisLeft={null}
			axisBottom={null}
			axisTop={{
				legendPosition: "middle",
				legendOffset: 7,
				legend: points + " Points",
			}}
			theme={{
				textColor: "var(--theme-ui-colors-text)",
				tooltip: {
					container: {
						background: "var(--theme-ui-colors-background)",
						color: "var(--theme-ui-colors-text)",
						fontSize: 12,
					},
				},
				crosshair: {
					line: {
						stroke: "var(--theme-ui-colors-primary)",
						strokeWidth: 1,
						strokeOpacity: 1,
					},
				},
			}}
			pointLabelYOffset={20}
			pointSize={10}
			areaOpacity={0.4}
			enablePointLabel={true}
			enableGridX={false}
			enableGridY={false}
			enableArea={true}
			enableSlices={false}
			useMesh={true}
			debugMesh={false}
			isInteractive={true}
		/>
	</div>
);

export default function UserScales() {
	const pointDatas: Array<{
		id: string;
		data: Array<{
			x: string;
			y: number;
		}>;
	}> = [];

	const {
		query: { login },
	} = useRouter();

	const {
		data: scales,
		isLoading,
		error,
	} = useAPI<any>(`/v2/users/${login}/scale_teams`); // TODO add scales interface

	const { data: history } = useAPI<any>(
		`/v2/users/${login}/correction_point_historics?sort=-created_at`
	); // TODO add historics interface

	if (isLoading || !history)
		return (
			<>
				Downloading scales for {login}...
				<Loading />
			</>
		);
	if (error) return <>Error</>;

	if (!scales.length)
		return (
			<>
				No scales for <b>{login}</b>
			</>
		);
	fillDatas(history, login, pointDatas);
	let totalPoints = history[0].total + history[0].sum;
	return (
		<>
			{<ResponsivePointLine data={pointDatas} points={totalPoints} />}
			<br />
			<CardGrid>
				{scales.map((s) => (
					<Card key={s.id}>
						<div className="w-full">
							<b style={{ fontSize: 15, fontFamily: "Futura" }}>
								{s.team.project_gitlab_path
									.toUpperCase()
									.split("/")
									.pop()
									.replaceAll("-", " ")}
								{" ["}
								<span
									className={`${
										s.team["validated?"]
											? "text-green-400"
											: "text-red-600"
									}`}
								>
									{s.final_mark}
								</span>
								{"]"}
							</b>
							<p className="text-xs">
								{s.corrector.login == login ? (
									<b>{s.corrector.login}: </b>
								) : (
									s.corrector.login + ": "
								)}
								<span
									className="text-xs opacity-75"
									style={{ wordBreak: "break-word" }}
								>
									{s.comment}
								</span>
							</p>
							<hr className="my-1 opacity-50" />
							<p className="text-xs">
								{s.correcteds[0].login == login ? (
									<b>{s.correcteds[0].login}: </b>
								) : (
									s.correcteds[0].login + ": "
								)}
								<span
									className="text-xs opacity-75"
									style={{ wordBreak: "break-word" }}
								>
									{s.feedback}
								</span>
							</p>
							<hr
								className="my-1 opacity-50"
								style={{ height: 20 }}
							/>
							<Box as="details" mt={-2}>
								<summary>Details</summary>
								<hr className="my-1 opacity-50" />
								<p className="text-xs">
									<span
										className={`${
											s.team["validated?"]
												? "text-green-400"
												: "text-red-600"
										}`}
									>
										{s.final_mark}
									</span>
									{" - "}
									{s.flag.name}
									<br />
									Role:{" "}
									<b>
										{" "}
										{s.corrector.login == login
											? "corrector"
											: "corrected"}{" "}
									</b>
									<br />
						Date: <b>{formatDate(scale.begin_at)}</b>
									ID: <b>{s.scale_id}</b>
									<br />
									Duration:{" "}
									<b>
										{getDuration(s.begin_at, s.filled_at)}
									</b>
									<br />
									Expected duration:{" "}
									<b> {s.scale.duration / 60} minutes</b>
									<br />
									Occurrence:{" "}
									<b>
										{s.team.users[0].occurrence + 1}{" "}
										{s.team.users[0].occurrence + 1 > 1
											? "times"
											: "time"}
									</b>
									<br />
									<b>
										{" "}
										{s.correcteds.length > 1
											? "Team name: " + s.team.name
											: ""}
									</b>
								</p>
							</Box>
						</div>
					</Card>
				))}
			</CardGrid>
		</>
	);
}

UserScales.header = UserHeader;
