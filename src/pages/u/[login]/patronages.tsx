import { useRouter } from "next/router";
import useAPI from "@/lib/useAPI";
import { getLayout } from "@/components/layouts/UserLayout";
import { User } from "@/types/User";
import UserCard from "@/components/UserCard";

function UserPatronages() {
	const router = useRouter();
	const { login } = router.query;

	const {
		data: user,
		isLoading,
		isError,
	}: { data: User; isLoading: boolean; isError: boolean } = useAPI(
		`/v2/users/${login}`
	);

	if (isLoading || isError) return <>Loading or error</>;

	return (
		<>
			<h1 className="mt-2 mb-4 text-3xl font-bold">Patroned</h1>
			{user.patroned.length === 0 && <p>Not patroned by anyone.</p>}
			{user.patroned.map((patron) => {
				return (
					<div key={patron.id} className="min-w-full">
						<UserCard id={patron.godfather_id} />
						<p>
							<span className="mr-1 text-xs uppercase opacity-75">
								Status
							</span>
							{patron.ongoing ? "Ongoing" : "Finished"}
						</p>
						<p>
							<span className="mr-1 text-xs uppercase opacity-75">
								Started
							</span>
							{patron.created_at}
						</p>
						<p>
							<span className="mr-1 text-xs uppercase opacity-75">
								Updated
							</span>
							{patron.updated_at}
						</p>
					</div>
				);
			})}
			<h1 className="mt-8 mb-4 text-3xl font-bold">Patroning</h1>
			{user.patroning.length === 0 && <p>Not patroning anyone.</p>}
			<div className="flex flex-wrap min-w-full space-x-2">
				{user.patroning.map((patron) => {
					return (
						<div key={patron.id} className="min-w-full">
							<UserCard id={patron.user_id} />
							<p>
								<span className="mr-1 text-xs uppercase opacity-75">
									Status
								</span>
								{patron.ongoing ? "Ongoing" : "Finished"}
							</p>
							<p>
								<span className="mr-1 text-xs uppercase opacity-75">
									Started
								</span>
								{patron.created_at}
							</p>
							<p>
								<span className="mr-1 text-xs uppercase opacity-75">
									Updated
								</span>
								{patron.updated_at}
							</p>
						</div>
					);
				})}
			</div>
		</>
	);
}

UserPatronages.getLayout = getLayout;

export default UserPatronages;
