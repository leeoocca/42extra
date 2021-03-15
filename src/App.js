import logo from "./logo.svg";
import "./App.css";
import { redirectToOAuth } from "./components/login.js";

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>Welcome!</p>
				<a
					className="App-link"
					href="#login"
					onClick={() => redirectToOAuth()}
				>
					Login
				</a>
			</header>
		</div>
	);
}

export default App;
