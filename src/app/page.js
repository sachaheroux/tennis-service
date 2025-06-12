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
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Analyseur de Service Tennis</h1>
          <p className="text-gray-600">Cliquez sur le carré de service pour placer votre balle</p>
        </div>
        
        <div className="flex justify-center gap-4 mb-8">
          <button 
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              mode === 'egalite' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setMode('egalite')}
          >
            Égalité
          </button>
          <button 
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              mode === 'avantage' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setMode('avantage')}
          >
            Avantage
          </button>
        </div>

        <div className="flex justify-center">
          <div 
            className="relative border-4 border-blue-700 rounded-lg overflow-hidden bg-green-100 shadow-xl"
            style={{ width: COURT_WIDTH, height: COURT_HEIGHT }}
            onClick={handleCourtClick}
          >
            {/* Lignes du carré de service */}
            <div className="absolute w-full h-1/2 border-b-2 border-white" />
            <div className="absolute w-1/2 h-full border-r-2 border-white" />
            
            {/* Point de la balle */}
            {ballPos && (
              <div 
                className="absolute w-4 h-4 rounded-full bg-yellow-400 border-2 border-yellow-600 shadow-md transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  left: ballPos.x,
                  top: ballPos.y,
                }}
              />
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg max-w-md mx-auto space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-medium text-gray-700">Vitesse: {speed} km/h</label>
              <span className="text-gray-500 text-sm">{Math.round(speedScore)} points</span>
            </div>
            <input
              type="range"
              min="100"
              max="220"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="font-medium text-gray-700">Effet: {spin}</label>
              <span className="text-gray-500 text-sm">x{spinBonus.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={spin}
              onChange={(e) => setSpin(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="font-medium text-gray-700">Type de balle</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!isFirstServe}
                onChange={(e) => setIsFirstServe(!e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-24 h-8 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 flex items-center justify-between px-2 text-xs font-medium">
                <span className={`${!isFirstServe ? 'text-white' : 'text-gray-700'}`}>2ème</span>
                <span className={`${isFirstServe ? 'text-gray-700' : 'text-white'}`}>1ère</span>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="font-medium text-gray-700">Faute</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isFault}
                onChange={(e) => setIsFault(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-200 rounded-full peer peer-checked:bg-red-600 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white" />
            </label>
          </div>
        </div>

        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600">
            {finalScore} points
          </div>
          {ballPos && (
            <div className="text-gray-600 mt-2">
              Précision: {Math.round(precision * 100)}%
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
