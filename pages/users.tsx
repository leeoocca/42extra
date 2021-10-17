import useAPI from "lib/useAPI";
import { User } from "types/User";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSession } from "next-auth/client";

function UsersIndex() {
	const [login, setLogin] = useState("");
	// const [session] = useSession();

	// const {
	// 	data,
	// 	isLoading,
	// 	isError,
	// }: { data: User[]; isLoading: boolean; isError: any } = useAPI(
	// 	`/v2/users?filter[primary_campus_id]=30`
	// );

	const router = useRouter();

	return (
		<>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					router.push(`/u/${login}`, null, { shallow: true });
				}}
			>
				<input
					type="search"
					placeholder="login"
					className="text-black"
					name="login"
					onChange={(event) => setLogin(event.target.value)}
					value={login}
				/>
				<button type="submit">Search</button>
			</form>
			{/* <ul>
				{!isLoading &&
					!isError &&
					data.map((user) => (
						<li key={user.id} className="flex py-4">
							<img
								className="w-10 h-10 rounded-full"
								src={`https://cdn.intra.42.fr/users/${user.login}.jpeg`}
								alt=""
							/>
							<div className="ml-3">
								<p className="text-sm font-medium text-gray-200">
									{user.login}
								</p>
								<p className="text-sm text-gray-500">
									{user.email}
									{console.log(user)}
								</p>
							</div>
						</li>
					))}
			</ul> */}
		</>
	);
}

export default UsersIndex;
