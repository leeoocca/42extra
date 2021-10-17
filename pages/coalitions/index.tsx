import Card from "ui/Card";
import CardGrid from "ui/CardGrid";
import useAPI from "lib/useAPI";
import Link from "next/link";

function CoalitionsIndex() {
	const { data: coalitions } = useAPI(`/v2/coalitions?sort=id`);
	return (
		<>
			<h1 className="text-3xl font-bold leading-relaxed">Coalitions</h1>
			<CardGrid>
				{coalitions &&
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
										<img
											src={c.image_url}
											alt={c.name}
											className="w-16 h-16 mix-blend-soft-light"
										/>
									</div>
								</Card>
							</a>
						</Link>
					))}
			</CardGrid>
		</>
	);
}

export default CoalitionsIndex;
