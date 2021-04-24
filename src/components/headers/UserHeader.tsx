import Avatar from "@components/Avatar";
import { User } from "@interfaces/User";
import useAPI from "@lib/useAPI";
import { useRouter } from "next/router";

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

	if (isError) return <>error</>;

	return (
		<header className="flex flex-row items-center px-4 py-2 mx-auto my-6 max-w-7xl">
			{isLoading ? (
				<>
					<div className="w-32 h-32 bg-white rounded-full animate-pulse"></div>
				</>
			) : (
				<>
					<div className="relative w-32 h-32">
						<Avatar url={user.image_url} />
					</div>
					<div className="pb-1 ml-4">
						<h1 className="text-4xl font-bold">{login}</h1>
						<p className="text-3xl font-medium">
							{user.usual_full_name}
						</p>
					</div>
				</>
			)}
		</header>
	);
}

export default UserHeader;
