import NextLink from "next/link";
import { ComponentProps } from "react";
import { Link as ThemeLink } from "theme-ui";

export default function Link({
	sx,
	...props
}: ComponentProps<typeof NextLink> & ComponentProps<typeof ThemeLink>) {
	return (
		<NextLink passHref {...props}>
			<ThemeLink as="a" sx={sx} {...props}>
				{props.children}
			</ThemeLink>
		</NextLink>
	);
}
