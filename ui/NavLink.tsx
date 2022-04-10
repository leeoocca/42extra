import { Link as TLink, Text } from "@theme-ui/components";
import Link from "next/link";
import { useRouter } from "next/router";
import { LinkListNode } from "types/LinkListNode";

const activeOverrides = {
	borderBottomColor: "white",
	opacity: "100%",
	fontWeight: 600,
};

function NavLink({ name, href, initial }: LinkListNode) {
	const router = useRouter();

	const active = router.pathname === href;

	const Wrap = ({ children }) =>
		active ? (
			children
		) : (
			<Link
				href={{ pathname: href, query: router.query }}
				passHref
				scroll={false}
			>
				<TLink
					sx={{
						color: "text",
						textDecoration: "none",
					}}
				>
					{children}
				</TLink>
			</Link>
		);

	return (
		<Text
			as="li"
			sx={{
				p: 2,
				minWidth: "auto",
				borderBottom: "transparent solid 2px",
				opacity: "75%",
				fontWeight: 500,
				...(active && activeOverrides),
				"&:hover": {
					opacity: "100%",
				},
			}}
		>
			<Wrap>
				{initial === true ? (
					<>
						<Text as="u">{name.slice(0, 1)}</Text>
						{name.slice(1)}
					</>
				) : (
					name
				)}
			</Wrap>
		</Text>
	);
}

export default NavLink;
