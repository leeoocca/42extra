import { useState } from "react";
import { useRouter } from "next/router";
// import Link from "next/link";

// const links = [
// 	{ name: "users", href: "/users" },
// 	{ name: "projects", href: "/projects" },
// ];

function SearchBar() {
	const [search, setSearch] = useState("");
	const router = useRouter();
	return (
		<>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					// while (search.length && search[0] == "/")
					// 	setSearch(search.substr(1));
					router.push(`/${search}`, null, { shallow: true });
					// https://stackoverflow.com/a/56899483/14477874
					if (document.activeElement instanceof HTMLElement)
						document.activeElement.blur();
					setSearch("");
				}}
				className="w-full"
			>
				<input
					type="text"
					placeholder={router.asPath}
					className="w-full px-2 py-1 placeholder-opacity-75 bg-transparent border-none rounded placeholder-foreground text-foreground"
					name="search"
					onChange={(event) => setSearch(event.target.value)}
					value={search}
					// onFocus={() => setVisibility(true)}
					// onBlur={() => setVisibility(false)}
					autoComplete="off"
				/>
			</form>
			{/* {visibility && (
				<div className="absolute z-50 mt-10 overflow-hidden overflow-y-scroll border border-gray-300 rounded w-max bg-skin-base max-height-48">
					<ul className="py-1">
						{links.map((link) => (
							<li className="px-3 py-2 text-opacity-50 cursor-pointer hover:text-opacity-100">
								<Link href={link.href}>
									<a>{link.name}</a>
								</Link>
							</li>
						))}
					</ul>
				</div>
			)} */}
		</>
	);
}

export default SearchBar;
