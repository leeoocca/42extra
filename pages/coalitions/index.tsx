import Link from "next/link";

import SVG from "react-inlinesvg";

import Card from "ui/Card";
import CardGrid from "ui/CardGrid";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";

export default function CoalitionsIndex() {
	const { data: coalitions } = useAPI(
		`/v2/coalitions?sort=id&page[size]=100`
	);
	// TODO paginate results
	return (
		<>
			<h1 className="text-3xl font-bold leading-relaxed">Coalitions</h1>
			<CardGrid>
				{coalitions ? (
					coalitions.map((c) => (
						<Link href={`/coalitions/${c.slug}`} key={c.id}>
							<a>
								<Card
									className={
										"h-32 overflow-hidden bg-white bg-opacity-20 hover:bg-opacity-30"
									}
									// backgroundImageURL={c.cover_url}
									backgroundColor={c.color + "66"}
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
							</a>
						</Link>
					))
				) : (
					<Loading />
				)}
			</CardGrid>
		</>
	);
}
