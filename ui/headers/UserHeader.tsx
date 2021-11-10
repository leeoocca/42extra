import Avatar from "ui/Avatar";
import { BadgeCheckIcon } from "@heroicons/react/outline";
import { User } from "types/User";
import useAPI from "lib/useAPI";
import { useRouter } from "next/router";

function getCustomUserLogin(user: User): string {
	const selectedTitle = user.titles_users.find((title) => title.selected);
	if (selectedTitle) {
		const selectedTitleName = user.titles.find(
			(title) => title.id === selectedTitle.title_id
		);
		return selectedTitleName.name.replace("%login", user.login);
	}
	return null;
}

function UserHeader() {
	const router = useRouter();
	const { login } = router.query;

	const {
		data: user,
		isLoading,
		isError,
	}: { data: User; isLoading: boolean; isError: any } = useAPI(
		`/v2/users/${login}`
	);

	const customUserLogin = user && getCustomUserLogin(user);

	return (
		<header className="flex flex-row items-center px-4 py-2 mx-auto my-6 max-w-7xl">
			<Avatar
				url={
					isError
						? "https://cdn.intra.42.fr/users/3b3.jpg"
						: user
						? user.image_url
						: null
				}
				size={128}
				className="w-16 h-16 md:w-32 md:h-32"
			/>
			{!isLoading && (
				<div className="pb-1 ml-4">
					<h1 className="inline-flex text-4xl font-bold">
						{isError ? (
							"Error"
						) : (
							<>
								<span>
									{/* maybe just always use user.login? */}
									{/* useful when loading though */}
									{customUserLogin
										? customUserLogin
										: Number(login) > 0
										? user.login
										: login}
								</span>
								{user["staff?"] && (
									<span
										title={`${login} is a member of the staff`}
									>
										<BadgeCheckIcon className="mt-2 ml-1.5 w-7" />
									</span>
								)}{" "}
							</>
						)}
					</h1>
					<p className="text-3xl font-medium">
						{isError ? "Don't panic!" : user.usual_full_name}
					</p>
				</div>
			)}
		</header>
	);
}

export default UserHeader;
