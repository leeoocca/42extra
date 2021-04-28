// import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";

// async function handler(req: NextApiRequest, res: NextApiResponse) {
async function handler(req, res) {
	let resp;
	try {
		const session = await getSession({ req });

		if (!session) {
			res.status(401).send({ error: "unauthorized" });
		}

		const { marvin } = req.query;

		resp = await fetch(`https://api.intra.42.fr/${marvin.join("/")}`, {
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
			},
		});

		if (!resp.ok) throw resp;
		const data = await resp.json();

		return res.json(data);
	} catch (error) {
		return res
			.status(resp.status || error.status || 500)
			.end(resp.statusText || error.message);
	}
}

export default handler;
