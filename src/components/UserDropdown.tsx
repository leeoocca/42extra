import { useSession, signIn, signOut } from "next-auth/client";
import Avatar from "./Avatar";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function UserDropdown() {
	const [session] = useSession();

	return (
		<div className="w-56 text-right">
			<Menu as="div" className="relative inline-block text-left">
				{({ open }) => (
					<>
						<div>
							<Menu.Button className="rounded-full focus:outline-none focus:ring-2 focus:ring-white">
								<span className="sr-only">Open user menu</span>
								<div className="relative w-8 h-8">
									<Avatar
										url={session.user.image}
										size={32}
									/>
								</div>
							</Menu.Button>
						</div>
						<Transition
							show={open}
							as={Fragment}
							enter="transition ease-out duration-100"
							enterFrom="transform opacity-0 scale-95"
							enterTo="transform opacity-100 scale-100"
							leave="transition ease-in duration-75"
							leaveFrom="transform opacity-100 scale-100"
							leaveTo="transform opacity-0 scale-95"
						>
							<Menu.Items
								static
								className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
							>
								<div className="px-1 py-1 ">
									<Menu.Item>
										{({ active }) => (
											<button
												className={`${
													active
														? "bg-black text-white"
														: "text-gray-900"
												} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
											>
												Hi {session.user.name}
											</button>
										)}
									</Menu.Item>
									<Menu.Item>
										{({ active }) => (
											<button
												className={`${
													active
														? "bg-black text-white"
														: "text-gray-900"
												} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
											>
												Duplicate
											</button>
										)}
									</Menu.Item>
								</div>
								<div className="px-1 py-1">
									<Menu.Item>
										{({ active }) => (
											<button
												className={`${
													active
														? "bg-black text-white"
														: "text-gray-900"
												} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
											>
												Language
											</button>
										)}
									</Menu.Item>
									<Menu.Item>
										{({ active }) => (
											<button
												className={`${
													active
														? "bg-black text-white"
														: "text-gray-900"
												} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
											>
												Theme
											</button>
										)}
									</Menu.Item>
								</div>
								<div className="px-1 py-1">
									<Menu.Item>
										{({ active }) => (
											<button
												className={`${
													active
														? "bg-black text-white"
														: "text-gray-900"
												} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
												onClick={() => signIn("42")}
											>
												Sign in
											</button>
										)}
									</Menu.Item>
									<Menu.Item>
										{({ active }) => (
											<button
												className={`${
													active
														? "bg-black text-white"
														: "text-gray-900"
												} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
												onClick={() => signOut()}
											>
												Sign out
											</button>
										)}
									</Menu.Item>
								</div>
							</Menu.Items>
						</Transition>
					</>
				)}
			</Menu>
		</div>
	);
}
