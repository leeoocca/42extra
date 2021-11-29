import { Container, Box } from "@theme-ui/components";

export default function Header() {
	return (
		<Box
			sx={{
				backgroundColor: "rgba(var(--nav), var(--nav-opacity))",
				transition:
					"background-color 500ms cubic-bezier(0.4, 0, 0.2, 1)",
			}}
		>
			<Container p={0} as="header" id="header" />
		</Box>
	);
}
