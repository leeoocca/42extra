import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { LinkListNode } from "types/LinkListNode";

function NavLink({ name, href, className }: LinkListNode) {
	const router = useRouter();
	const activeNavRef = useRef<HTMLAnchorElement>(null);

	const active = router.asPath === href;

	useEffect(() => {
		if (active && activeNavRef.current) {
			activeNavRef.current.scrollIntoView({
				block: "nearest",
				inline: "center",
			});
		}
	}, [active]);

	return (
		<Link href={href}>
			<a
				className={`${
					active
						? "opacity-100 border-white"
						: "opacity-75 border-transparent"
				} hover:opacity-100 hover:text-white border-b-2 px-1 py-2 font-medium ease-in-out transition-opacity focus:opacity-100 ${className}`}
				ref={activeNavRef}
			>
				{name}
			</a>
		</Link>
	);
}

export default NavLink;
