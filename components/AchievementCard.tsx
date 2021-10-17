import { Achievement } from "types/User";
import Card from "./Card";

function AchievementCard({ a }: { a: Achievement }) {
	return (
		<Card className="items-center">
			<img
				src={
					"https://cdn.intra.42.fr" + a.image.replace("/uploads", "")
				}
				className="w-12 m-2"
			/>
			<div className="flex flex-col justify-center ml-2 leading-relaxed pt-0.5 pb-1.5">
				<h3 className="font-bold tracking-tight">{a.name}</h3>
				<p className="text-sm">{a.description}</p>
				{a.tier !== "none" && (
					<p className="mt-1 text-sm">
						<span className="mr-1 text-xs uppercase opacity-75">
							Tier
						</span>
						{a.tier}
					</p>
				)}
			</div>
		</Card>
	);
}

export default AchievementCard;
