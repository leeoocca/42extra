import { Heading } from "@theme-ui/components";
import useAPI from "lib/useAPI";
import { User } from "next-auth";
import { useRouter } from "next/router";
import CampusHeader from "ui/headers/CampusHeader";
import Loading from "ui/Loading";
import UserCard from "ui/UserCard";
import UserGrid from "ui/UserGrid";

export default function CampusUsers() {
	const {
		query: { id },
	} = useRouter();

	const { data: users, isLoading } = useAPI<User[]>(`/v2/campus/${id}/users`);

	if (isLoading) return <Loading />;

	return (
		<>
			<Heading mb={2}>Users</Heading>
			<UserGrid>
				{users &&
					users.map((u) => <UserCard key={u.id} id={u.login} />)}
			</UserGrid>
		</>
	);
}

CampusUsers.header = CampusHeader;
