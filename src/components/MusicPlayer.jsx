import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import RepeatIcon from '../assets/repeat.svg'
import ShuffleIcon from '../assets/shuffle.svg'
import SkipBackIcon from '../assets/skip-back.svg'
import SkipForwardIcon from '../assets/skip-forward.svg'

const MusicPlayer = ({ title, composer, src, image }) => {
	const vinylWrapperRef = useRef(null);
	const playButtonRef = useRef(null);
	const playButtonTextRef = useRef(null);
	const musicRef = useRef(null);
	const musicInputRef = useRef(null);
	const musicCurrentTimeElementRef = useRef(null);
	const musicDurationElementRef = useRef(null);
	const repeatButtonRef = useRef(null);
	const shuffleButtonRef = useRef(null);
	const skipBackButtonRef = useRef(null);
	const skipForwardButtonRef = useRef(null);
	const visualizerElementRef = useRef(null);

	const visualizerLevelCount = 84;
	const visualizerBarWidth = 2;
	const visualizerBarGap = 2;
	const visualizerWidth =
		visualizerBarWidth * visualizerLevelCount +
		visualizerBarGap * (visualizerLevelCount - 1);
	const visualizerHeight = 24;

	useEffect(() => {
		const vinylWrapper = vinylWrapperRef.current;
		const playButton = playButtonRef.current;
		const playButtonText = playButtonTextRef.current;
		const music = musicRef.current;
		const musicInput = musicInputRef.current;
		const musicCurrentTimeElement = musicCurrentTimeElementRef.current;
		const musicDurationElement = musicDurationElementRef.current;
		const visualizerElement = visualizerElementRef.current;

		// const getAudioLevels = async (audioUrl) => {
		const getAudioLevels = async () => {
			// commented because of heavy process, should be done using audioworklet or server-side
			/*
            const response = await fetch(audioUrl);
            const arrayBuffer = await response.arrayBuffer();
            
            const audioContext = new AudioContext();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            
            const sampleRate = audioBuffer.sampleRate;
            const samplesPerSlice = Math.floor(audioBuffer.length / visualizerLevelCount);
            const levels = [];
            
            for (let i = 0; i < visualizerLevelCount; i++) {
                const start = i * samplesPerSlice;
                const end = start + samplesPerSlice;
            
                let sum = 0;
            
                for (let j = start; j < end; j++) {
                sum += Math.abs(audioBuffer.getChannelData(0)[j]);
                }
            
                const average = sum / samplesPerSlice;
                levels.push(average);
            }
            
            return levels;
            */

			// output from previous code rounded to 5 decimals
			return [
				0.04789, 0.03436, 0.03869, 0.0478, 0.04839, 0.09588, 0.14296,
				0.12231, 0.12481, 0.12564, 0.13751, 0.14356, 0.13111, 0.14017,
				0.14686, 0.13407, 0.13742, 0.14819, 0.17, 0.14212, 0.14231,
				0.14845, 0.14107, 0.14919, 0.16656, 0.1553, 0.16256, 0.15493,
				0.16029, 0.15779, 0.15799, 0.16111, 0.16638, 0.1554, 0.16561,
				0.16766, 0.15581, 0.16701, 0.15893, 0.1736, 0.16581, 0.1716,
				0.15874, 0.15816, 0.16938, 0.1626, 0.1618, 0.17307, 0.1672,
				0.17365, 0.14406, 0.10569, 0.1059, 0.11444, 0.11334, 0.12655,
				0.14976, 0.12986, 0.11341, 0.13378, 0.13692, 0.14709, 0.13644,
				0.14972, 0.14367, 0.1514, 0.14632, 0.15284, 0.18201, 0.15739,
				0.14746, 0.16426, 0.16314, 0.16238, 0.16831, 0.16798, 0.13169,
				0.12982, 0.12973, 0.11814, 0.11691, 0.08365, 0.0879, 0.07783,
			];
		};

		const setAudioLevels = async (audioUrl, visualizerElement) => {
			visualizerElement.setAttribute(
				"viewBox",
				`0 0 ${visualizerWidth} ${visualizerHeight}`
			);

			const rects = [];

			for (let i = 0; i < visualizerLevelCount; i++) {
				const barHeight = 3;
				const x = i * visualizerBarWidth + i * visualizerBarGap;
				const y = (visualizerHeight - barHeight) / 2;

				const rect = document.createElementNS(
					"http://www.w3.org/2000/svg",
					"rect"
				);
				rect.classList.add("music-progress-input-visualizer-bar");
				rect.setAttribute("x", x);
				rect.setAttribute("y", y);
				rect.setAttribute("rx", 1);
				rect.setAttribute("width", visualizerBarWidth);
				rect.setAttribute("height", 3);

				visualizerElement.appendChild(rect);
				rects.push(rect);
			}

			const audioLevels = await getAudioLevels(audioUrl);

			const maxValue = Math.max(...audioLevels);

			for (let i = 0; i < rects.length; i++) {
				const barHeight = Math.max(
					(audioLevels[i] / maxValue) * visualizerHeight,
					3
				);
				// const x = i * visualizerBarWidth + i * visualizerBarGap;
				const y = (visualizerHeight - barHeight) / 2;

				rects[i].setAttribute("y", y);
				rects[i].setAttribute("rx", 1);
				rects[i].setAttribute("height", barHeight);
			}
		};

		setAudioLevels(music.src, visualizerElement);

		const formatTime = (timeInSeconds) => {
			const minutes = Math.floor(timeInSeconds / 60);
			const seconds = String(Math.floor(timeInSeconds % 60)).padStart(
				2,
				"0"
			);
			return `${minutes}:${seconds}`;
		};

		const fillVisualizerBars = () => {
			const bars = visualizerElement.childNodes;
			for (let i = 0; i < bars.length; i++) {
				if (
					+bars[i].getAttribute("x") + visualizerBarWidth / 2 <=
					(music.currentTime * visualizerWidth) / music.duration
				) {
					bars[i].classList.add("filled");
				} else {
					bars[i].classList.remove("filled");
				}
			}
		};

		music.addEventListener("timeupdate", () => {
			fillVisualizerBars();
			musicCurrentTimeElement.textContent = formatTime(music.currentTime);
			if (music.currentTime >= music.duration) {
				if (music.loop) {
					music.currentTime = 0;
					music.play();
				} else {
					playButton.classList.remove("is-playing");
				}
			}
		});

		const setMusicDuration = () => {
			musicInput.max = music.duration;
			musicDurationElement.textContent = formatTime(music.duration);
			// musicInputPreviousValue = 0;
		};

		music.readyState
			? setMusicDuration()
			: music.addEventListener("loadedmetadata", setMusicDuration);

		music.addEventListener("play", () => {
			if (music.currentTime >= music.duration) music.currentTime = 0;
			vinylWrapper.classList.add("rotate");
			playButton.classList.add("is-playing");
			playButtonText.textContent = "Play";
		});

		music.addEventListener("pause", () => {
			vinylWrapper.classList.remove("rotate");
			playButton.classList.remove("is-playing");
			playButtonText.textContent = "Play";
		});

		musicInput.addEventListener("input", () => {
			music.currentTime = musicInput.value;
		});

	}, []);
    
    const handleRepeat = () => {
        repeatButtonRef.current.classList.toggle("active");
        musicRef.current.loop = !musicRef.current.loop;
    }

    const handleShuffle = () => {
        shuffleButtonRef.current.classList.toggle("active");
    }
    
    const handleSkipBack = () => {
        musicRef.current.currentTime = 0;
    }
    
    const handleSkipForward = () => {
        musicRef.current.currentTime = musicRef.current.duration + 1;
    }

    const handlePlayMusic = () => {
        musicRef.current.paused ? musicRef.current.play() : musicRef.current.pause();
        console.log(musicRef.current.paused);
    }

	return (
		<>
			<div className="music-player-container">
				<div className="vinyl-wrapper" ref={vinylWrapperRef}>
					<div className="vinyl" style={{"--bg-image": `url(${image})`}}></div>
				</div>
				<audio ref={musicRef} src={src} preload="metadata"></audio>
				<p className="music-title">{title}</p>
				<p className="music-composer">{composer}</p>
				<div className="music-progress-container">
					<p
						className="music-progress-current-time"
						ref={musicCurrentTimeElementRef}
					>
						0:00
					</p>
					<div className="music-progress-input-container">
						<input
							className="music-progress-input"
							ref={musicInputRef}
							type="range"
							value="0"
							min="0"
							step="any"
						/>
						<svg
							className="music-progress-input-visualizer"
							xmlns="http://www.w3.org/2000/svg"
							ref={visualizerElementRef}
						></svg>
					</div>
					<p
						className="music-progress-duration"
						ref={musicDurationElementRef}
					>
						0:00
					</p>
				</div>
				<div className="music-controls-container">
					<button
						className="music-controls-button toggle repeat"
						type="button"
						ref={repeatButtonRef}
                        onClick={handleRepeat}
					>
                        <RepeatIcon />
					</button>
					<button
						className="music-controls-button skip back"
						type="button"
						ref={skipBackButtonRef}
                        onClick={handleSkipBack}
					>
                        <SkipBackIcon />
					</button>
					<button
						className="play-button play"
						ref={playButtonRef}
						type="button"
                        onClick={handlePlayMusic}
					>
						<svg
							className="play-button-icon play"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 256 256"
						>
							<path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z" />
						</svg>
						<svg
							className="play-button-icon pause"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 256 256"
						>
							<path d="M216,48V208a16,16,0,0,1-16,16H160a16,16,0,0,1-16-16V48a16,16,0,0,1,16-16h40A16,16,0,0,1,216,48ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Z" />
						</svg>
					</button>
					<button
						className="music-controls-button skip forward"
						type="button"
						ref={skipForwardButtonRef}
                        onClick={handleSkipForward}
					>
                        <SkipForwardIcon />
					</button>
					<button
						className="music-controls-button shuffle toggle"
						type="button"
						ref={shuffleButtonRef}
                        onClick={handleShuffle}
					>
                        <ShuffleIcon />
					</button>
				</div>
			</div>
		</>
	);
};

MusicPlayer.propTypes = {
	title: PropTypes.string,
	composer: PropTypes.string,
	src: PropTypes.string,
    image: PropTypes.string
};

export default MusicPlayer;
