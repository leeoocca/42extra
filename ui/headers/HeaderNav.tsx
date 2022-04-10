import { Flex } from "@theme-ui/components";
import NavLink from "ui/NavLink";

export default function HeaderNav({ navLinks }) {
	return (
		<Flex
			as="nav"
			sx={{
				px: 3,
				gap: 3,
				overflow: "auto",
				userSelect: "none",
			}}
		>
			{navLinks.map((item) => (
				<NavLink key={item.href} name={item.name} href={item.href} />
			))}
		</Flex>
	);
}
