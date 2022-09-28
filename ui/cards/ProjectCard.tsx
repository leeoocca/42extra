import { Card, Flex, Text } from "@theme-ui/components";
import { ICON_SIZE } from "lib/actions";
import { Check, X } from "lucide-react";
import Link from "next/link";
import RelativeTime from "ui/RelativeTime";

export default function ProjectCard({ project, login }) {
	return (
		<Link href={`/users/${login}/${project.project.slug}`} passHref>
			<Card as="a" bg="muted" p={2}>
				<div className="flex items-end justify-between w-full h-24">
					<div>
						<h2 className="text-lg">{project.project.name}</h2>
						<Flex sx={{ gap: 2, fontSize: 1 }}>
							<span
								className={`${
									project.status === "in_progress" &&
									"text-yellow-400"
								}`}
							>
								{project.status.replace(/_/g, " ")}
							</span>
							<Text sx={{ color: "gray" }}>
								{project.marked_at && (
									<RelativeTime
										date={project.marked_at}
										clickable={false}
									/>
								)}
							</Text>
						</Flex>
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
