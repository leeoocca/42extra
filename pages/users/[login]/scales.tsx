import useAPI from "lib/useAPI";
import { useRouter } from "next/router";
import {
	Line,
	LineChart,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import Card from "ui/Card";
import CardGrid from "ui/CardGrid";
import UserHeader from "ui/headers/UserHeader";
import Loading from "ui/Loading";

export default function UserScales() {
	const {
		query: { login },
	} = useRouter();

	const {
		data: scales,
		isLoading,
		error,
	} = useAPI<any>(`/v2/users/${login}/scale_teams`); // TODO add scales interface

	const { data: history } = useAPI<any>( // TODO add historics interface
		`/v2/users/${login}/correction_point_historics?sort=-created_at`
	);

	if (isLoading) return <Loading />;
	if (error) return <>Error</>;

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
					<LineChart data={history.slice().reverse()}>
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
							stroke="var(--theme-ui-colors-primary)"
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

UserScales.header = UserHeader;
