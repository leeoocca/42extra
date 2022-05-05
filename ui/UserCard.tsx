import { User } from "types/42";
import useAPI from "lib/useAPI";
import Link from "next/link";
import Avatar, { ErrorAvatar, LoadingAvatar } from "./Avatar";
import Card from "./Card";

function Template({ id, avatar, title, description }) {
	return (
		<Link href={`/users/${id}`}>
			<a className="w-full">
				<Card className="flex w-full">
					{avatar}
					<div className="ml-3">
						<p className="text-sm font-medium text-gray-200">
							{title}
						</p>
						<p className="text-sm text-gray-500">{description}</p>
					</div>
				</Card>
			</a>
		</Link>
	);
}

function UserCard({ id }: { id: string | number }) {
	const { data: user, isLoading, error } = useAPI<User>(`/v2/users/${id}`);

	if (isLoading)
		return (
			<Template
				id={id}
				avatar={<Avatar url={null} size={40} />}
				title={id}
				description={"Loading..."}
			/>
		);

	if (error)
		return (
			<Template
				id={id}
				title={"Error"}
				description={`while loading ${id}`}
				avatar={<Avatar url={null} size={40} />}
			/>
		);

	const primaryCampus = user.campus_users.find((campus) => campus.is_primary);
	const campus = user.campus.find(
		(campus) => campus.id === primaryCampus.campus_id
	);

	return (
		<Template
			id={id}
			avatar={<Avatar url={user.image_url} size={40} />}
			title={user.login}
			description={
				campus !== undefined ? campus.name : user.usual_full_name
			}
		/>
	);
}

export default UserCard;
