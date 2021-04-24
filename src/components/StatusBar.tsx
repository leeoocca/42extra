import React from "react";
import Link from "next/link";
import UserDropdown from "./UserDropdown";
import { LinkListNode } from "@interfaces/LinkListNode";

function StatusBar({ breadcrumbs }: { breadcrumbs?: LinkListNode[] }) {
	return (
		<nav className="flex items-center w-full px-4 py-2 mx-auto align-middle max-w-7xl">
			<Link href="/">
				<button>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 -200 960 960"
						className="w-8 h-8 m-3 fill-current"
						// alt="42"
					>
						<path d="M32 412.6h330.1V578h164.7V279.1H197.3L526.8-51.1H362.1L32 279.1zM597.9 114.2L762.7-51.1H597.9zM762.7 114.2L597.9 279.1v164.8h164.8V279.1L928 114.2V-51.1H762.7z" />
						<path d="M928 279.1L762.7 443.9H928z" />
					</svg>
				</button>
			</Link>
			<div className="flex flex-grow">
				{/* {breadcrumbs &&
					breadcrumbs.map((item, i ) => (arr
						<span key={i}>
							{i !== 0 && (
								<span className="ml-2 opacity-75">/</span>
							)}
							<Link href={item.href}>
								<a
									className={`ml-2 ${
										item.isActive // arr.length - 1 === i
											? "font-bold"
											: "font-medium"
									}`}
								>
									{item.name}
								</a>
							</Link>
						</span>
					))} */}
			</div>
			<UserDropdown />
		</nav>
	);
}

export default StatusBar;
