import Link from "next/link";

import { Card, Flex } from "@theme-ui/components";
import { Check, X } from "lucide-react";

import { ICON_SIZE } from "lib/actions";
import getTimeAgo from "lib/getTimeAgo";

export default function ProjectCard({ project, login }) {
	return (
		<Link href={`/users/${login}/${project.project.slug}`} passHref>
			<Card as="a" bg="muted" p={2}>
				<div className="flex items-end justify-between w-full h-24">
					<div>
						<h2 className="text-lg">{project.project.name}</h2>
						<p className="text-sm">
							<span
								className={`${
									project.status === "in_progress" &&
									"text-yellow-400"
								}`}
							>
								{project.status.replace(/_/g, " ")}
							</span>
							{project.marked_at && (
								<time
									title={project.marked_at.toString()}
									className="ml-1 opacity-75"
								>
									{getTimeAgo(project.marked_at)}
								</time>
							)}
						</p>
					</div>
					<Flex
						className={`${
							project["validated?"]
								? "text-green-400"
								: "text-red-600"
						}`}
						sx={{ alignItems: "center", gap: 1 }}
					>
						{project["validated?"] ? (
							<Check size={ICON_SIZE} />
						) : (
							project.marked_at && <X size={ICON_SIZE} />
						)}
						{project.final_mark}
					</Flex>
				</div>
			</Card>
		</Link>
	);
}
