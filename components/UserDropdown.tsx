import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/router";

function getButtonClasses(active: boolean) {
	return `w-full p-2 text-sm text-skin-text text-left ${
		active && "bg-white bg-opacity-10"
	}`;
}

export default function UserDropdown() {
	const [session] = useSession();
	const router = useRouter();

	return (
		<div className="h-8">
			<Menu as="div" className="relative inline-block">
				{({ open }) => (
					<>
						<div>
							<Menu.Button className="flex items-center space-x-2 rounded-full focus:outline-none focus:ring-2 focus:ring-foreground">
								<span className="sr-only">Open user menu</span>
								<span>{session.user.login}</span>
								<Avatar url={session.user.image} size={32} />
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
								className="absolute right-0 z-10 w-40 mt-2 origin-top-right divide-y rounded-md shadow-lg divide-foreground divide-opacity-50 bg-background ring-1 ring-foreground ring-opacity-5 focus:outline-none"
							>
								<div className="py-1 ">
									<Menu.Item>
										{({ active }) => (
											<button
												className={getButtonClasses(
													active
												)}
												onClick={() =>
													router.push(
														`/u/${session.user.login}`
													)
												}
											>
												Hi, {session.user.name}
											</button>
										)}
									</Menu.Item>
								</div>
								<div className="py-1">
									<Menu.Item>
										{({ active }) => (
											<div>
												<label
													htmlFor="language"
													className="m-2 text-sm"
												>
													Language
												</label>
												<select
													name="language"
													id="select-language"
													className="p-1 text-sm text-black"
												>
													<option value="en">
														English
													</option>
												</select>
											</div>
										)}
									</Menu.Item>
								</div>
								<div className="py-1">
									<Menu.Item>
										{({ active }) => (
											<button
												className={getButtonClasses(
													active
												)}
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
