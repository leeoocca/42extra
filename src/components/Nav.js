import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/client";

function NavLink({ name, path }) {
	return (
		<Link href={path} key={path}>
			<a className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
				{name}
			</a>
		</Link>
	);
}

export default function Nav() {
	const [profileDropdown, setProfileDropdown] = React.useState(false);
	const [session] = useSession();

	const navItems = [
		{
			name: "Profile",
			path: "/profile",
		},
		{
			name: "Explore",
			path: "/explore",
		},
	];

	return (
		<>
			<nav className="max-w-7xl mx-auto p-2 flex flex-row w-full">
				<div className="flex-grow">
					<Link href="/">
						<a>logo</a>
					</Link>
					<Link href="/">users</Link>
					<span>/</span>
					<Link href="/users/lrocca">lrocca</Link>
				</div>
				<Link href="/me">me</Link>
			</nav>
			<nav className="bg-skin-nav">
				<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
					<div className="relative flex items-center justify-between h-16">
						<div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
							<div className="flex-shrink-0 flex items-center">
								<Link href="/">
									<button>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 -200 960 960"
											fill="#FFFFFF"
											className="h-8 w-8"
											alt="42"
										>
											<path d="M32 412.6h330.1V578h164.7V279.1H197.3L526.8-51.1H362.1L32 279.1zM597.9 114.2L762.7-51.1H597.9zM762.7 114.2L597.9 279.1v164.8h164.8V279.1L928 114.2V-51.1H762.7z" />
											<path d="M928 279.1L762.7 443.9H928z" />
										</svg>
									</button>
								</Link>
							</div>
							<div className="hidden sm:block sm:ml-6">
								<div className="flex space-x-4">
									{navItems.map((item) => (
										<NavLink
											key={item.path}
											name={item.name}
											path={item.path}
										/>
									))}
									<a
										href="#"
										className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
									>
										Active link
									</a>
								</div>
							</div>
						</div>
						<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
							<button className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
								<span className="sr-only">
									View notifications
								</span>

								<svg
									className="h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
									/>
								</svg>
							</button>

							<div className="ml-3 relative">
								<div>
									<button
										type="button"
										className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
										id="user-menu"
										aria-expanded="false"
										aria-haspopup="true"
										onClick={() =>
											setProfileDropdown(!profileDropdown)
										}
									>
										<span className="sr-only">
											Open user menu
										</span>
										<img
											className="h-8 w-8 rounded-full object-cover"
											src={session.picture}
											alt=""
										/>
									</button>
								</div>
							</div>
							<div
								className={`${
									profileDropdown ? "" : "hidden"
								} origin-top-right top-12 absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
								role="menu"
								aria-orientation="vertical"
								aria-labelledby="user-menu"
							>
								<a
									href="#"
									className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									role="menuitem"
								>
									Hi {session.name}
								</a>
								<a
									href="#"
									className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									role="menuitem"
								>
									Settings
								</a>
								<a
									href="#"
									className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									role="menuitem"
									onClick={() => signOut()}
								>
									Sign out
								</a>
							</div>
						</div>
					</div>
				</div>
			</nav>
		</>
	);
}
