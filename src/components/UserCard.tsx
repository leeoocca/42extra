import { User } from "@/types/User";
import useAPI from "@/lib/useAPI";
import Link from "next/link";
import Avatar from "./Avatar";
import Card from "./Card";

function UserCard({ id }: { id: string | number }) {
	const {
		data: user,
		isLoading,
		isError,
	}: { data: User; isLoading: boolean; isError: boolean } = useAPI(
		`/v2/users/${id}`
	);

	if (isLoading) return <Card>loading {id}</Card>;

	if (isError) return <Card>error for {id}</Card>;

	const primaryCampus = user.campus_users.find((campus) => campus.is_primary);
	const campus = user.campus.find(
		(campus) => campus.id === primaryCampus.campus_id
	);

	return (
		<Link href={`/u/${id}`}>
			<a className="min-w-full">
				<Card className="flex w-full max-w-xs p-2 md:w-64">
					<Avatar url={user.image_url} size={40} />
					<div className="ml-3">
						<p className="text-sm font-medium text-gray-200">
							{user.login}
						</p>
						<p className="text-sm text-gray-500">
							{campus !== undefined
								? campus.name
								: user.usual_full_name}
						</p>
					</div>
				</Card>
			</a>
		</Link>
	);
}

export default UserCard;
