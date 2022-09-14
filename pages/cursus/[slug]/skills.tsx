import useAPI from "lib/useAPI";
import { useRouter } from "next/router";
import { Skill } from "types/42";
import CursusHeader from "ui/headers/CursusHeader";
import Loading from "ui/Loading";

export default function CursusSkills() {
	const {
		query: { slug },
	} = useRouter();

	const { data: skills } = useAPI<Skill[]>(
		`/v2/cursus/${slug}/skills?page[size]=100`
	);

	if (!skills) return <Loading />;

	return (
		<ul>
			{skills.map((skill) => (
				<li key={skill.id}>{skill.name}</li>
			))}
		</ul>
	);
}

CursusSkills.header = CursusHeader;
