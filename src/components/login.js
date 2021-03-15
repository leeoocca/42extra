export function redirectToOAuth(returnURL) {
	const { location, localStorage } = window;

	// prevent shenanigans using a CSRF token
	// see https://owasp.org/www-community/attacks/csrf
	const csrfToken = uuid();

	// store the token so we can use it later for validation
	localStorage.setItem(csrfToken, "true");

	// tell the auth flow where to go once you have a token
	const successURL = returnURL || `${location.origin}${location.pathname}`;

	// redirect to start the OAuth flow
	window.location.href = `https://42react.netlify.app/.netlify/functions/auth?url=${successURL}&csrf=${csrfToken}`;
}
