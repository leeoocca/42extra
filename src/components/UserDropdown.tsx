import { useState } from "react";
import { useSession, signOut } from "next-auth/client";
import Avatar from "./Avatar";

function UserDropdown() {
	const [profileDropdown, setProfileDropdown] = useState(false);
	const [session] = useSession();

	return (
		<>
			<div className="ml-3 relative">
				<div>
					<button
						type="button"
						className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
						id="user-menu"
						aria-expanded="false"
						aria-haspopup="true"
						onClick={() => setProfileDropdown(!profileDropdown)}
					>
						<span className="sr-only">Open user menu</span>
						<div className="w-8 h-8 relative">
							<Avatar url={session.picture} />
						</div>
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
		</>
	);
}

export default UserDropdown;
