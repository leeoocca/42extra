import { CSSProperties, useMemo } from "react";

import {
	KBarAnimator,
	KBarPortal,
	KBarPositioner,
	KBarResults,
	KBarSearch,
	useMatches,
} from "kbar";
import { NO_GROUP } from "kbar/lib/useMatches";
import { Flex, Text } from "@theme-ui/components";

const searchStyle: CSSProperties = {
	padding: "12px 16px",
	fontSize: "16px",
	width: "100%",
	boxSizing: "border-box",
	outline: "none",
	border: "none",
	background: "var(--theme-ui-colors-background)",
	color: "var(--theme-ui-colors-text)",
};

const animatorStyle: CSSProperties = {
	maxWidth: "500px",
	width: "100%",
	background: "var(--theme-ui-colors-background)",
	color: "var(--theme-ui-colors-text)",
	borderRadius: "8px",
	overflow: "hidden",
	boxShadow: "var(--shadow)",
};

export default function CommandBar() {
	return (
		<KBarPortal>
			<KBarPositioner className="kbar-positioner">
				<KBarAnimator style={animatorStyle}>
					<KBarSearch style={searchStyle} />
					<RenderResults />
				</KBarAnimator>
			</KBarPositioner>
		</KBarPortal>
	);
}

function RenderResults() {
	const { results } = useMatches();

	return (
		<KBarResults
			items={results}
			onRender={({ item, active }) =>
				typeof item === "string" ? (
					<Text
						sx={{
							textTransform: "uppercase",
							padding: "8px 16px",
							fontSize: "10px",
							opacity: 0.5,
						}}
					>
						{item}
					</Text>
				) : (
					<Flex
						sx={{
							backgroundColor: active ? "muted" : "transparent",
							// maxHeight: 400,
							// overflow: "auto",
							justifyContent: "space-between",
							padding: "12px 16px",
							borderLeft: "2px solid",
							borderLeftColor: active ? "text" : "transparent",
							alignItems: "center",
							cursor: "pointer",
							gap: 3,
						}}
					>
						{item.icon && item.icon}
						<Text sx={{ flexGrow: 1 }}>{item.name}</Text>
						{item.shortcut?.length ? (
							<div
								aria-hidden
								style={{
									display: "grid",
									gridAutoFlow: "column",
									gap: "4px",
								}}
							>
								{item.shortcut.map((sc) => (
									<Text
										key={sc}
										as="kbd"
										sx={{
											padding: "4px 6px",
											background:
												"rgba(255 255 255 / .1)",
											borderRadius: "4px",
											fontSize: 14,
										}}
									>
										{sc}
									</Text>
								))}
							</div>
						) : null}
					</Flex>
				)
			}
		/>
	);
}
