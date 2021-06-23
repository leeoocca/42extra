import UserCard from "./UserCard";

interface Details {
	name: string;
	value: any;
}

interface Props {
	user: string | number;
	details: Details[];
}

function UserCardWithDetails({ user, details }: Props) {
	return (
		<div>
			<UserCard id={user} />
			<table className="mt-1">
				<tbody>
					{details.map((detail) => (
						<tr key={detail.name}>
							<th className="pr-1 text-xs text-left uppercase opacity-75">
								{detail.name}
							</th>
							<td>{detail.value}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default UserCardWithDetails;
