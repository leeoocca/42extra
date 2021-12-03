import { useRouter } from "next/router";

import CursusHeader from "ui/headers/CursusHeader";
import Loading from "ui/Loading";
import useAPI from "lib/useAPI";
import { Themed } from "@theme-ui/mdx";

export default function CursusSkills() {
	const router = useRouter();
	const { slug } = router.query;

	const { data: skills } = useAPI(`/v2/cursus/${slug}/skills?page[size]=100`);

	if (!skills) return <Loading />;

	return (
		<Themed.ul>
			{skills.map((skill) => (
				<Themed.li key={skill.id}>{skill.name}</Themed.li>
			))}
		</Themed.ul>
	);
}

CursusSkills.header = CursusHeader;