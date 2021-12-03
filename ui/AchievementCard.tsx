import Image from "next/image";

import { Achievement } from "types/User";
import Card from "./Card";

export default function AchievementCard({ a }: { a: Achievement }) {
	return (
		<Card className="items-center">
			<Image
				src={
					"https://cdn.intra.42.fr" + a.image.replace("/uploads", "")
				}
				width={48}
				height={48}
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
