'use client';

import { useState } from 'react';

const COURT_WIDTH = 270;
const COURT_HEIGHT = 420;

function scorePrecision(x, y, mode) {
  // x: 0-13.5, y: 0-21
  let cibles = mode === 'egalite' ? [0, 6, 13.5] : [0, 8, 13.5];
  let minDist = Math.min(...cibles.map(c => Math.abs(x - c)));
  let score_x = 1 - 0.4 * (minDist / 6.75);

  let facteur_y = 1;
  if (Math.abs(x - 0) < 1 || Math.abs(x - 13.5) < 1) {
    facteur_y = 0.8 + 0.4 * (1 - y / 21);
  } else if ((mode === 'egalite' && Math.abs(x - 6) < 1) || (mode === 'avantage' && Math.abs(x - 8) < 1)) {
    facteur_y = 0.8 + 0.4 * (y / 21);
  } else {
    facteur_y = 0.8 + 0.4 * (y / 21);
  }

  return score_x * facteur_y;
}

export default function Home() {
  const [mode, setMode] = useState('egalite');
  const [isFirstServe, setIsFirstServe] = useState(true);
  const [isFault, setIsFault] = useState(false);
  const [speed, setSpeed] = useState(160);
  const [spin, setSpin] = useState(5);
  const [ballPos, setBallPos] = useState(null);

  const pxToCourt = (px, py) => ({
    x: (px / COURT_WIDTH) * 13.5,
    y: (py / COURT_HEIGHT) * 21,
  });

  let precision = 0;
  if (ballPos) {
    const { x, y } = pxToCourt(ballPos.x, ballPos.y);
    precision = scorePrecision(x, y, mode);
  }
  const speedScore = speed / 2;
  const spinBonus = 1 + 0.015 * (spin - 1);
  const finalScore = ballPos && !isFault ? Math.round(precision * speedScore * spinBonus) : 0;

  const handleCourtClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setBallPos({ x, y });
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Efficacité Service Tennis</h1>
      
      <div className="flex gap-2 mb-4">
        <button 
          className={`px-4 py-2 rounded ${mode === 'egalite' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setMode('egalite')}
        >
          Égalité
        </button>
        <button 
          className={`px-4 py-2 rounded ${mode === 'avantage' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setMode('avantage')}
        >
          Avantage
        </button>
      </div>

      <div 
        className="relative border-2 border-teal-600 rounded-lg overflow-hidden bg-teal-50"
        style={{ width: COURT_WIDTH, height: COURT_HEIGHT }}
        onClick={handleCourtClick}
      >
        {ballPos && (
          <div 
            className="absolute w-5 h-5 rounded-full bg-orange-500 border-2 border-orange-700"
            style={{ 
              left: ballPos.x - 10,
              top: ballPos.y - 10,
            }}
          />
        )}
      </div>

      <div className="w-full max-w-md mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Vitesse: {speed} km/h</label>
          <input
            type="range"
            min="100"
            max="220"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Spin: {spin}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={spin}
            onChange={(e) => setSpin(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between">
          <span>1ère balle</span>
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              checked={isFirstServe}
              onChange={(e) => setIsFirstServe(e.target.checked)}
              className="sr-only peer"
              id="serve-toggle"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </div>
          <span>2ème balle</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Faute</span>
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              checked={isFault}
              onChange={(e) => setIsFault(e.target.checked)}
              className="sr-only peer"
              id="fault-toggle"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-xl font-bold">
        Score du service : {finalScore}
      </div>
    </main>
  );
}
