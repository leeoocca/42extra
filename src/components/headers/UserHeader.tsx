import Avatar from "@components/Avatar";

function UserHeader({
	login,
	fullName,
	imageUrl,
}: {
	login: string;
	fullName: string;
	imageUrl: string;
}) {
	return (
		<header className="max-w-7xl mx-auto px-4 py-2 flex flex-row items-center my-6">
			<div className="w-32 h-32 relative">
				<Avatar url={imageUrl} />
			</div>
			<div className="ml-4 pb-1">
				<h1 className="font-bold text-4xl">{login}</h1>
				<p className="font-medium text-3xl">{fullName}</p>
			</div>
		</header>
	);
}

export default UserHeader;
