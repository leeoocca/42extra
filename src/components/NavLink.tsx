import Link from "next/link";
import { LinkListNode } from "@interfaces/LinkListNode";
import { useRouter } from "next/router";

function NavLink({ name, href }: LinkListNode) {
	const router = useRouter();
	const { login } = router.query;
	return (
		<Link href={{ pathname: href, query: { login: login } }} key={href}>
			<a
				className={`${
					router.pathname === href
						? "opacity-100 border-white border-b-2"
						: "opacity-75"
				} hover:opacity-100 hover:text-white px-3 py-2 font-medium ease-in-out transition-opacity focus:opacity-100`}
			>
				{name}
			</a>
		</Link>
	);
}

export default NavLink;
