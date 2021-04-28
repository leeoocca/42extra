import { Achievement } from "@interfaces/User";
import Card from "./Card";

function AchievementCard({ a }: { a: Achievement }) {
	return (
		<Card className="flex">
			<img
				src={
					"https://cdn.intra.42.fr" + a.image.replace("/uploads", "")
				}
				className="w-12 mr-4"
			/>
			<div>
				<p className="font-bold">{a.name}</p>
				<p>{a.description}</p>
				{a.tier !== "none" && (
					<p>
						<span className="mr-1 text-xs uppercase opacity-75">
							Tier
						</span>
						{a.tier}
					</p>
				)}
				<p>{a.nbr_of_success}</p>
			</div>
		</Card>
	);
}

export default AchievementCard;
