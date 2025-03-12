import React, { useState } from "react";
import song from "./static/song.mp3";
import "./AudioPlayer.css";

function AudioPlayer() {
    const [audio] = useState(new Audio(song));
    const [isPlaying, setIsPlaying] = useState(false);

    const playPause = () => {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="nhs-button" onClick={playPause}>
            <i className={isPlaying ? "fas fa-pause" : "fas fa-play"}></i>
        </button>
    </div>
);
}

export default AudioPlayer;
