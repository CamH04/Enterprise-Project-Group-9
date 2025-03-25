import React, { useEffect, useState } from 'react';
import './TextToSpeech.css';

const TextToSpeech = ({ text }) => {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(1);
  const synth = window.speechSynthesis;

  useEffect(() => {
    const loadVoices = () => {
      let availableVoices = synth.getVoices().filter(voice => voice.lang.startsWith('en'));
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleReadAloud = () => {
    if (!text) return;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.pitch = pitch;

    if (selectedVoice) {
      utterance.voice = voices.find((v) => v.name === selectedVoice);
    }

    synth.speak(utterance);
  };

  const handleStop = () => {
    synth.cancel();
  };

  return (
    <div className="tts-container">
      <h3>Read Article Aloud</h3>

      <div className="nhsuk-form-group">
        <label className="nhsuk-label" htmlFor="voiceSelect">
          Choose a voice:
        </label>
        <select
          id="voiceSelect"
          className="nhsuk-select"
          onChange={(e) => setSelectedVoice(e.target.value)}
          value={selectedVoice}
        >
          {voices.map((voice, index) => (
            <option key={index} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>

      <div className="nhsuk-form-group">
        <label className="nhsuk-label" htmlFor="speedRange">
          Speed: {speed.toFixed(1)}x
        </label>
        <input
          type="range"
          id="speedRange"
          min="0.5"
          max="2"
          step="0.1"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="tts-slider"
        />
      </div>

      <div className="nhsuk-form-group">
        <label className="nhsuk-label" htmlFor="pitchRange">
          Pitch: {pitch.toFixed(1)}
        </label>
        <input
          type="range"
          id="pitchRange"
          min="0.5"
          max="2"
          step="0.1"
          value={pitch}
          onChange={(e) => setPitch(parseFloat(e.target.value))}
          className="tts-slider"
        />
      </div>

      <button className="nhsuk-button" onClick={handleReadAloud}>
        Read Aloud
      </button>
      <button className="nhsuk-button nhsuk-button--secondary" onClick={handleStop}>
        Stop
      </button>
    </div>
  );
};

export default TextToSpeech;
