import Link from "next/link";
import { LinkListNode } from "@interfaces/LinkListNode";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

function NavLink({ name, href, className }: LinkListNode) {
	const router = useRouter();
	const { login } = router.query;
	const activeNavRef = useRef<HTMLAnchorElement>(null);

	const active = router.pathname === href;

	useEffect(() => {
		if (active && activeNavRef.current) {
			activeNavRef.current.scrollIntoView();
		}
	}, []);

	return (
		<Link href={{ pathname: href, query: { login: login } }} key={href}>
			<a
				className={`${
					active
						? "opacity-100 border-white border-b-2"
						: "opacity-75"
				} hover:opacity-100 hover:text-white px-3 py-2 font-medium ease-in-out transition-opacity focus:opacity-100 ${className}`}
				ref={activeNavRef}
			>
				{name}
			</a>
		</Link>
	);
}

export default NavLink;
