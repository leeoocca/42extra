import { mendColor } from "lib/color";
import useAPI from "lib/useAPI";
import Link from "next/link";
import SVG from "react-inlinesvg";
import { Coalition } from "types/42";
import Card from "ui/cards/Card";
import CardGrid from "ui/grids/CardGrid";
import Loading from "ui/Loading";
import PageTitle from "ui/PageTitle";

export default function CoalitionsIndex() {
	const { data: coalitions } = useAPI<Coalition[]>(
		`/v2/coalitions?sort=id&page[size]=100`
	);
	// TODO paginate results
	return (
		<>
			<PageTitle title="Coalitions" />
			<h1 className="text-3xl font-bold leading-relaxed">Coalitions</h1>
			<CardGrid>
				{coalitions ? (
					coalitions.map((c) => (
						<Link href={`/coalitions/${c.slug}`} key={c.id}>
							<Card
								className={
									"h-32 overflow-hidden bg-white bg-opacity-20 hover:bg-opacity-30"
								}
								// backgroundImageURL={c.cover_url}
								backgroundColor={mendColor(c.color) + "66"}
							>
								<div className="flex items-end justify-between w-full h-full">
									<div>
										<h2 className="text-lg font-semibold">
											{c.name}
										</h2>
										<p className="text-xs uppercase">
											Score: {c.score}
										</p>
									</div>
									<SVG
										src={c.image_url}
										fill="white"
										className="w-16 h-16 mix-blend-soft-light"
									/>
								</div>
							</Card>
						</Link>
					))
				) : (
					<Loading />
				)}
			</CardGrid>
		</>
	);
}
