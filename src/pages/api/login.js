import withSession from '@lib/session'
import oauth from '@lib/oauth'

export default withSession(async (req, res) => {
  const { url, csrf } = await req.body

  if (!url || !csrf) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: "Missing required parameters `url` and/or `csrf`",
      }),
    };
  }

  const authorizationURI = oauth.authorizeURL({
    redirect_uri: process.env.FT_REDIRECT_URI,
    state: `url=${url}&csrf=${csrf}`,
  });

  return {
    statusCode: 302,
    headers: {
      Location: authorizationURI,
      "Cache-Control": "no-cache",
    },
    body: "redirecting to authorization...",
  };
})
