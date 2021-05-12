import Link from "next/link";
import SearchBar from "./SearchBar";
import UserDropdown from "./UserDropdown";

function StatusBar() {
	return (
		<nav className="flex items-center p-4 mx-auto space-x-4 align-middle max-w-7xl">
			<Link href="/">
				<a>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 -200 960 960"
						className="w-8 h-8 fill-current"
					>
						<path d="M32 412.6h330.1V578h164.7V279.1H197.3L526.8-51.1H362.1L32 279.1zM597.9 114.2L762.7-51.1H597.9zM762.7 114.2L597.9 279.1v164.8h164.8V279.1L928 114.2V-51.1H762.7z" />
						<path d="M928 279.1L762.7 443.9H928z" />
					</svg>
				</a>
			</Link>
			<div className="flex flex-grow">
				<SearchBar />
			</div>
			<UserDropdown />
		</nav>
	);
}

export default StatusBar;
