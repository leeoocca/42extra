import { locale } from "lib/constants";
import useAPI from "lib/useAPI";
import { useRouter } from "next/router";
import { User } from "types/42";
import UserHeader from "ui/headers/UserHeader";
import Loading from "ui/Loading";
import UserCardWithDetails from "ui/UserCardWithDetails";
import UserGrid from "ui/UserGrid";

export default function UserPatronages() {
	const {
		query: { login },
	} = useRouter();

	const { data: user, isLoading, error } = useAPI<User>(`/v2/users/${login}`);

	if (isLoading) return <Loading />;
	if (error) return <>Error</>;

	return (
		<>
			<h1 className="mt-2 mb-4 text-3xl font-bold">Patron</h1>
			{user.patroned.length === 0 ? (
				<p>Not patroned by anyone.</p>
			) : (
				<UserGrid>
					{user.patroned.map((patron) => {
						const details = [
							{
								name: "Status",
								value: patron.ongoing ? "Ongoing" : "Finished",
							},
							{
								name: "Started",
								value: new Date(
									patron.created_at
								).toLocaleString(locale),
							},
							{
								name: "Updated",
								value: new Date(
									patron.updated_at
								).toLocaleString(locale),
							},
						];
						return (
							<UserCardWithDetails
								key={patron.godfather_id}
								user={patron.godfather_id}
								details={details}
							/>
						);
					})}
				</UserGrid>
			)}
			<h1 className="mt-8 mb-4 text-3xl font-bold">Patroning</h1>
			{user.patroning.length === 0 ? (
				<p>Not patroning anyone.</p>
			) : (
				<UserGrid>
					{user.patroning.map((patron) => {
						const details = [
							{
								name: "Status",
								value: patron.ongoing ? "Ongoing" : "Finished",
							},
							{
								name: "Started",
								value: new Date(
									patron.created_at
								).toLocaleString(locale),
							},
							{
								name: "Updated",
								value: new Date(
									patron.updated_at
								).toLocaleString(locale),
							},
						];
						return (
							<UserCardWithDetails
								key={patron.user_id}
								user={patron.user_id}
								details={details}
							/>
						);
					})}
				</UserGrid>
			)}
		</>
	);
}

UserPatronages.header = UserHeader;
