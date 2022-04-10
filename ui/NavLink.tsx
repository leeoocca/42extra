import Link from "next/link";
import { useRouter } from "next/router";
import { LinkListNode } from "types/LinkListNode";

function NavLink({ name, href, className }: LinkListNode) {
	const router = useRouter();

	const active = router.pathname === href;

	return (
		<Link href={{ pathname: href, query: router.query }}>
			<a
				className={`${
					active
						? "opacity-100 border-white"
						: "opacity-75 border-transparent"
				} hover:opacity-100 hover:text-white border-b-2 px-1 py-2 font-medium ease-in-out transition-opacity focus:opacity-100 ${className}`}
			>
				{name}
			</a>
		</Link>
	);
}

export default NavLink;
