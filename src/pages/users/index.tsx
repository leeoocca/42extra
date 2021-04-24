import { getLayout } from "@components/layouts/MainLayout";
import useAPI from "@lib/useAPI";
import { User } from "@interfaces/User";
import { useRouter } from "next/router";
import { useState } from "react";

function UsersIndex() {
	const [login, setLogin] = useState("");

	const {
		data,
		isLoading,
		isError,
	}: { data: User[]; isLoading: boolean; isError: any } = useAPI("/v2/users");

	const router = useRouter();

	return (
		<>
			<form onSubmit={() => router.push(`/users/${login}`)}>
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
			{!isLoading &&
				!isError &&
				data.map((user) => (
					<code key={user.id} className="block">
						{user.login}
					</code>
				))}
		</>
	);
}

UsersIndex.getLayout = getLayout;

export default UsersIndex;
