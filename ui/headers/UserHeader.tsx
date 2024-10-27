import { Box, Flex, Heading } from "@theme-ui/components";
import { useRegisterActions } from "kbar";
import { userActions } from "lib/actions";
import { setPrimaryColor } from "lib/color";
import { TITLE_DEPRECATED_ID } from "lib/constants";
import { getUserNavLinks } from "lib/NavLinks";
import useAPI from "lib/useAPI";
import { useRouter } from "next/router";
import { CSSProperties, useEffect, useState } from "react";
import SVG from "react-inlinesvg";
import { Coalition, User } from "types/42";
import Avatar from "ui/Avatar";
import PageTitle, { PAGE_TITLE_SEPARATOR } from "ui/PageTitle";
import HeaderNav from "./HeaderNav";

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

const BadgeCheckIcon = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="mt-2 ml-1.5 w-7"
		viewBox="0 0 20 20"
		fill="currentColor"
		{...props}
	>
		<path
			fillRule="evenodd"
			d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
			clipRule="evenodd"
		/>
	</svg>
);

const UnknownCoalition = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		viewBox="0 0 24 24"
		{...props}
	>
		<path
			fillRule="evenodd"
			d="M11.26 2.024c-2.164.223-3.841.877-5.46 2.13-.439.34-1.308 1.21-1.649 1.651-1.146 1.479-1.814 3.078-2.079 4.975-.065.465-.065 1.975 0 2.44.223 1.596.73 2.976 1.558 4.24 1.419 2.169 3.642 3.721 6.13 4.281.832.187 1.288.236 2.22.237.894.001 1.252-.032 2.02-.183 2.571-.508 4.947-2.129 6.385-4.355.806-1.247 1.282-2.525 1.521-4.08.087-.562.099-2.033.022-2.58-.27-1.921-.96-3.558-2.106-5-1.623-2.04-3.892-3.323-6.542-3.7-.315-.044-1.745-.084-2.02-.056m1.532 2.017a7.978 7.978 0 0 1 4.762 2.215 7.992 7.992 0 0 1 2.405 6.51 7.953 7.953 0 0 1-2.215 4.788 7.857 7.857 0 0 1-2.244 1.63A7.968 7.968 0 0 1 6.505 17.8a7.966 7.966 0 0 1-1.689-9.3 7.491 7.491 0 0 1 1.46-2.073c1.693-1.742 4.142-2.639 6.516-2.386m-1.638 2.017c-1.748.251-3.189 1.189-3.795 2.471-.146.308-.158.602-.036.871.176.388.467.576.897.578.445.003.677-.152.964-.643.224-.383.588-.7 1.076-.938.596-.29.982-.373 1.74-.373.762 0 1.144.083 1.753.379.333.163.469.257.704.489.402.399.522.653.522 1.108 0 .455-.12.709-.522 1.108-.368.364-.899.635-1.557.796-.608.148-.987.349-1.315.697-.647.686-.773 1.613-.286 2.1.589.589 1.549.257 1.693-.586l.03-.175.48-.126c1.827-.482 3.115-1.664 3.419-3.137.432-2.091-1.133-4.017-3.701-4.556-.524-.11-1.525-.141-2.066-.063m.489 10.008c-.355.131-.643.549-.643.934 0 .729.814 1.222 1.465.887.711-.365.708-1.41-.004-1.776-.211-.109-.588-.129-.818-.045"
		/>
	</svg>
);

const CoalitionSVGStyles: CSSProperties = {
	position: "absolute",
	objectFit: "cover",
	height: "160px",
	right: 4,
	mixBlendMode: "soft-light",
};

export default function UserHeader() {
	const {
		query: { login },
		route,
	} = useRouter();

	const { data: user, isLoading, error } = useAPI<User>(`/v2/users/${login}`);

	const { data: coalitions } = useAPI<Coalition[]>(
		login && `/v2/users/${login}/coalitions`
	);

	const [title, setTitle] = useState<string | string[]>(String(login));

	useEffect(() => {
		const routeArray = route.split("/");
		const page = routeArray[routeArray.length - 1];
		setTitle(
			page !== "[login]"
				? [String(login), page.replace(/^\w/, (c) => c.toUpperCase())]
				: login
		);
	}, [login, route]);

	const coalition = coalitions && coalitions.slice(0).reverse()[0];

	useEffect(() => {
		setPrimaryColor(coalition?.color || null);
		return () => setPrimaryColor();
	}, [coalition]);

	const customUserLogin = user && getCustomUserLogin(user);

	useRegisterActions(
		userActions(String(login), ["Users", login].join(PAGE_TITLE_SEPARATOR)),
		[login]
	);

	return (
		<>
			<PageTitle title={title} />
			<Box sx={{ position: "relative" }}>
				{coalition ? (
					<SVG
						src={coalition.image_url}
						fill="black"
						style={CoalitionSVGStyles}
						height="auto"
						width="auto"
					/>
				) : (
					<UnknownCoalition fill="black" style={CoalitionSVGStyles} />
				)}
			</Box>
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
				<a
					href={user?.image?.link || ""}
					target="_blank"
					rel="noopener noreferrer"
				>
					<Avatar
						url={
							error
								? "/default.jpg"
								: user
								? user.image.versions.medium
								: null
						}
						size={128}
						deprecated={
							user &&
							!!user.titles_users.find(
								(title) =>
									title.title_id === TITLE_DEPRECATED_ID &&
									title.selected
							)
						}
					/>
				</a>
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
							{error ? (
								"Error"
							) : (
								<>
									{customUserLogin
										? customUserLogin
										: user.login}
									{user["staff?"] && (
										<span
											title={`${user.login} is a member of the staff`}
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
							{error ? "Don't panic!" : user.usual_full_name}
						</Heading>
					</Box>
				)}
			</Flex>
			<HeaderNav navLinks={getUserNavLinks()} />
		</>
	);
}
