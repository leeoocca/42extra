import Link from "next/link";
import { LinkListNode } from "@interfaces/LinkListNode";

function NavLink({ name, uri, isActive }: LinkListNode) {
	return (
		<Link href={uri} key={uri}>
			<a
				className={`${
					isActive
						? "opacity-100 border-white border-b"
						: "opacity-75"
				} hover:opacity-100 hover:text-white px-3 py-2 font-medium transition-opacity focus:opacity-100`}
			>
				{name}
			</a>
		</Link>
	);
}

export default NavLink;
