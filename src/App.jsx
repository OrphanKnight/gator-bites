import MusicPlayer from "./components/MusicPlayer";
import audio from "./music/love-the-way-you-lie.mp3";
import "./App.scss";

function App() {
	const handleTheme = () => {
		document.body.classList.toggle("dark");
	};

	return (
		<div>
			<button
				className="theme-button"
				onClick={handleTheme}
				type="button"
			>
				<svg
					className="theme-button-icon light"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 256 256"
				>
					<path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm8,24a64,64,0,1,0,64,64A64.07,64.07,0,0,0,128,64ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z" />
				</svg>
				<svg
					className="theme-button-icon dark"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 256 256"
				>
					<path d="M235.54,150.21a104.84,104.84,0,0,1-37,52.91A104,104,0,0,1,32,120,103.09,103.09,0,0,1,52.88,57.48a104.84,104.84,0,0,1,52.91-37,8,8,0,0,1,10,10,88.08,88.08,0,0,0,109.8,109.8,8,8,0,0,1,10,10Z" />
				</svg>
			</button>

			<div className="music-container">
				<MusicPlayer
					title="Love the Way You Lie ft. Rihanna"
					composer="Eminem"
					src={audio}
					image="https://assets.codepen.io/4175254/ymo.jpg"
				/>
			</div>
		</div>
	);
}

export default App;
