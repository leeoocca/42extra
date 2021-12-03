import { useRouter } from "next/router";

import { Heading } from "@theme-ui/components";
import { User } from "next-auth";

import CampusHeader from "ui/headers/CampusHeader";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";
import UserCard from "ui/UserCard";
import UserGrid from "ui/UserGrid";

export default function CampusUsers() {
	const router = useRouter();
	const { id } = router.query;

	const { data: users, isLoading }: { data: User[]; isLoading: boolean } =
		useAPI(`/v2/campus/${id}/users`);

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
