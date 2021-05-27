// import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";

// async function handler(req: NextApiRequest, res: NextApiResponse) {
async function handler(req, res) {
	let resp;
	try {
		const session = await getSession({ req });

		if (!session) {
			return res.status(401).end({ error: "unauthorized" });
		}

		const { marvin } = req.query;

		const rawParams = req.query;
		delete rawParams.marvin;
		const params = new URLSearchParams(rawParams).toString();

		const url =
			"https://api.intra.42.fr/v2/" + marvin.join("/") + "?" + params;

		resp = await fetch(url, {
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
			},
		});

		if (!resp.ok) throw resp;
		const data = await resp.json();

		return res.json(data);
	} catch (error) {
		return res
			.status((resp && resp.status) || (error && error.status) || 500)
			.end((resp && resp.statusText) || (error && error.message));
	}
}

export default handler;
