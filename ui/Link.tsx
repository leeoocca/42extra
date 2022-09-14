import NextLink from "next/link";
import { ComponentProps } from "react";
import { Link as ThemeLink } from "theme-ui";

export default function Link(props: ComponentProps<typeof NextLink>) {
	return (
		<NextLink {...props} passHref>
			<ThemeLink as="a">{props.children}</ThemeLink>
		</NextLink>
	);
}
