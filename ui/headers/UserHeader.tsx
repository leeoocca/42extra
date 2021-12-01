import { useRouter } from "next/router";

import { useRegisterActions } from "kbar";
import { Flex, Box, Heading } from "@theme-ui/components";
import SVG from "react-inlinesvg";

import { getUserNavLinks } from "lib/NavLinks";
import { User } from "types/User";
import { userActions } from "lib/actions";
import Avatar from "ui/Avatar";
import NavLink from "ui/NavLink";
import useAPI from "lib/useAPI";
import hexToRGB from "lib/hexToRGB";
import PageTitle from "ui/PageTitle";

function getCustomUserLogin(user: User): string {
	const selectedTitle = user.titles_users.find((title) => title.selected);
	if (selectedTitle) {
		const selectedTitleName = user.titles.find(
			(title) => title.id === selectedTitle.title_id
		);
		return selectedTitleName.name.replace("%login", user.login);
	}
	return null;
}

function getPageTitle(login: string, routeArray: any) {
	const pageName = routeArray[routeArray.length - 1];
	return pageName !== "[login]" ? `${login}'s ${pageName}` : login;
}

const BadgeCheckIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="mt-2 ml-1.5 w-7"
		viewBox="0 0 20 20"
		fill="currentColor"
	>
		<path
			fillRule="evenodd"
			d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
			clipRule="evenodd"
		/>
	</svg>
);

export default function UserHeader() {
	const router = useRouter();
	const { login } = router.query;

	const {
		data: user,
		isLoading,
		isError,
	}: { data: User; isLoading: boolean; isError: any } = useAPI(
		`/v2/users/${login}`
	);

	const { data: coalitions } = useAPI(
		login && `/v2/users/${login}/coalitions`
	);

	document.documentElement.style.setProperty("--nav", "");

	const coalition = coalitions && coalitions[0] ? coalitions[0] : null;

	if (coalition)
		document.documentElement.style.setProperty(
			"--nav",
			hexToRGB(coalition.color)
		);
	else if (coalitions !== undefined)
		document.documentElement.style.setProperty("--nav", "0, 186, 188");

	const customUserLogin = user && getCustomUserLogin(user);

	useRegisterActions(userActions(String(login), `${login}'s profile`), [
		login,
	]);

	return (
		<>
			<PageTitle>
				{getPageTitle(String(login), router.route.split("/"))}
			</PageTitle>
			{coalition && (
				<Box sx={{ position: "relative" }}>
					<SVG
						src={coalition.image_url}
						fill="black"
						style={{
							position: "absolute",
							objectFit: "cover",
							height: "160px",
							right: 4,
							mixBlendMode: "soft-light",
						}}
					/>
				</Box>
			)}
			<Flex
				sx={{
					px: 3,
					my: 3,
					width: "100%",
					gap: [2, , 3],
					alignItems: "center",
					flexDirection: ["column", , "row"],
				}}
			>
				<Box sx={{ w: 6, h: 6 }}>
					<Avatar
						url={
							isError
								? "https://cdn.intra.42.fr/users/3b3.jpg"
								: user
								? user.image_url
								: null
						}
						size={128}
					/>
				</Box>
				{!isLoading && (
					<Box>
						<Heading
							as="h1"
							sx={{
								fontSize: 36,
								display: "flex",
								justifyContent: ["center", , "flex-start"],
								lineHeight: "2.5rem",
								textAlign: "center",
							}}
						>
							{isError ? (
								"Error"
							) : (
								<>
									{/* maybe just always use user.login? */}
									{/* useful when loading though */}
									{customUserLogin
										? customUserLogin
										: Number(login) > 0
										? user.login
										: login}
									{user["staff?"] && (
										<span
											title={`${login} is a member of the staff`}
										>
											<BadgeCheckIcon />
										</span>
									)}{" "}
								</>
							)}
						</Heading>
						<Heading
							sx={{
								fontSize: 30,
								fontWeight: 500,
								textAlign: ["center", , "left"],
							}}
						>
							{isError ? "Don't panic!" : user.usual_full_name}
						</Heading>
					</Box>
				)}
			</Flex>
			<Flex
				as="nav"
				sx={{
					px: 3,
					gap: 3,
					overflow: "auto",
					userSelect: "none",
				}}
			>
				{getUserNavLinks().map((item) => (
					<NavLink
						key={item.href}
						name={item.name}
						href={item.href}
					/>
				))}
			</Flex>
		</>
	);
}
