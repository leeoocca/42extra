import UserCard from "components/UserCard";
import UserGrid from "components/UserGrid";
import useAPI from "lib/useAPI";
import { User } from "next-auth";
import { useRouter } from "next/router";

function CampusesIndex() {
	const router = useRouter();
	const { id } = router.query;

	const { data: users, isLoading }: { data: User[]; isLoading: boolean } =
		useAPI(`/v2/campus/${id}/users`);

	if (isLoading) return <>Loading...</>;

	return (
		<>
			<h1 className="text-3xl font-bold leading-relaxed">
				Users for campus {id}
			</h1>
			<UserGrid>
				{users &&
					users.map((u) => <UserCard key={u.id} id={u.login} />)}
			</UserGrid>
		</>
	);
}

export default CampusesIndex;
