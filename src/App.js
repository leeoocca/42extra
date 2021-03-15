import logo from "./logo.svg";
import "./App.css";

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>Welcome!</p>
				<a
					className="App-link"
					href={
						"https://api.intra.42.fr/oauth/authorize?\
						client_id=b60505384faf7b8305c22e79f1c16e7593c8968a8a0d2d430e01d4b82122490c\
						&redirect_uri=https%3A%2F%2F42react.netlify.app%2F.netlify%2Ffunctions%2Fauth-callback\
						&response_type=code"
					}
					target="_blank"
					rel="noopener noreferrer"
				>
					Login
				</a>
			</header>
		</div>
	);
}

export default App;
