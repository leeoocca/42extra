import { ResponsiveLine, Serie } from "@nivo/line";

function getSerie(history): Serie[] {
	let serie: Serie[] = [{ id: "Evaluation Points", data: [] }];

	serie[0].data = history.map((m) => {
		return {
			x: new Date(m.created_at)
				.toISOString()
				.slice(0, 19)
				.replace("T", " "),
			// x: new Date(m.created_at).toISOString().slice(0, 19),
			y: m.total + m.sum,
		};
	});

	return serie;
}

export default function ScalesGraph({ history }) {
	const last = history[history.length - 1];
	const totalPoints = last.total + last.sum;

	return (
		<div style={{ height: 150, overflow: "hidden" }}>
			<ResponsiveLine
				data={getSerie(history)}
				crosshairType="cross"
				margin={{ top: 0, right: 7, bottom: 3, left: 0 }}
				xScale={{
					type: "point",
					// type: "time",
					// format: "native",
					// format: "%Y-%m-%d %H:%M:%S",
					// format: "%Y-%m-%d",
					// useUTC: false,
					// precision: "second",
				}}
				// xFormat="time:%Y-%m-%d %H:%M:%S"
				// xFormat="time:%Y-%m-%d"
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
					legend: totalPoints + " points",
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
}
