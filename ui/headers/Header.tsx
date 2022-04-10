import { Box, Container } from "@theme-ui/components";

export default function Header({ children }) {
	return (
		<Box
			sx={{
				// bg: "primarydim",
				// backgroundColor:
				// 	"rgba(var(--theme-ui-colors-primary), var(--nav-opacity))",
				position: "relative",
				"&:after": {
					transition:
						"background-color 500ms cubic-bezier(0.4, 0, 0.2, 1)",
					content: "''",
					width: "100%",
					height: "100%",
					backgroundColor: "var(--theme-ui-colors-primary)",
					opacity: 0.6,
					position: "absolute",
					top: 0,
					left: 0,
					zIndex: -1,
				},
			}}
		>
			<Container p={0} as="header" id="header">
				{children}
			</Container>
		</Box>
	);
}
