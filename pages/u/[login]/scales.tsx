import useAPI from "lib/useAPI";
import { getLayout } from "ui/layouts/UserLayout";
import { useRouter } from "next/router";
import {
	ResponsiveContainer,
	LineChart,
	Line,
	Tooltip,
	ReferenceLine,
} from "recharts";
import CardGrid from "ui/CardGrid";
import Card from "ui/Card";

function UserScales() {
	const router = useRouter();
	const { login } = router.query;

	const {
		data: scales,
		isLoading,
		isError,
	}: {
		data: any; // @todo add scales interface
		isLoading: boolean;
		isError: boolean;
	} = useAPI(`/v2/users/${login}/scale_teams`);

	const { data: history } = useAPI(
		`/v2/users/${login}/correction_point_historics`
	);

	if (isLoading) return <>Loading...</>;
	if (isError) return <>Error</>;

	if (!scales.length)
		return (
			<>
				No scales for <b>{login}</b>
			</>
		);

	return (
		<>
			{history && (
				<ResponsiveContainer height={100}>
					<LineChart data={history}>
						<ReferenceLine
							y={0}
							label="0"
							stroke="gray"
							strokeDasharray="3 3"
						/>
						<Tooltip />
						<Line
							type="monotone"
							dataKey="total"
							stroke="var(--foreground)"
						/>
					</LineChart>
				</ResponsiveContainer>
			)}
			<CardGrid>
				{scales.map((s) => (
					<Card key={s.id}>
						<div className="w-full">
							<p>{s.scale_id}</p>
							<p className="text-xs opacity-75">{s.comment}</p>
							<hr className="my-1 opacity-50" />
							<p className="text-xs opacity-75">{s.feedback}</p>
							<p>
								<span
									className={`${
										s.flag.positive
											? "text-green-400"
											: "text-red-600"
									}`}
								>
									{s.final_mark}
								</span>{" "}
								— {s.flag.name}
							</p>
						</div>
					</Card>
				))}
			</CardGrid>
		</>
	);
}

UserScales.getLayout = getLayout;

export default UserScales;
