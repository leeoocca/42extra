import { Box, Flex } from "@theme-ui/components";
import NavLink from "ui/NavLink";

export default function HeaderNav({ navLinks }) {
	return (
		<Box as="nav">
			<Flex
				as="ul"
				sx={{
					overflow: "auto",
					gap: 3,
					flexWrap: "nowrap",
					m: 0,
					px: 3,
					py: 0,
					listStyle: "none",
				}}
			>
				{navLinks.map((item) => (
					<NavLink key={item.href} {...item} />
				))}
			</Flex>
		</Box>
	);
}
