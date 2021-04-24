import React from "react";
import Link from "next/link";
import UserDropdown from "./UserDropdown";
import { LinkListNode } from "@interfaces/LinkListNode";

function StatusBar({ breadcrumbs }: { breadcrumbs: LinkListNode[] }) {
	return (
		<nav className="max-w-7xl mx-auto px-4 py-2 flex w-full align-middle items-center">
			<Link href="/">
				<button>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 -200 960 960"
						className="h-8 w-8 fill-current m-3"
						// alt="42"
					>
						<path d="M32 412.6h330.1V578h164.7V279.1H197.3L526.8-51.1H362.1L32 279.1zM597.9 114.2L762.7-51.1H597.9zM762.7 114.2L597.9 279.1v164.8h164.8V279.1L928 114.2V-51.1H762.7z" />
						<path d="M928 279.1L762.7 443.9H928z" />
					</svg>
				</button>
			</Link>
			<div className="flex-grow flex">
				{breadcrumbs &&
					breadcrumbs.map((item, i /* arr */) => (
						<span key={i}>
							{i !== 0 && (
								<span className="opacity-75 ml-2">/</span>
							)}
							<Link href={item.uri}>
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
					))}
			</div>
			<UserDropdown />
		</nav>
	);
}

export default StatusBar;
