import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const SkillAnalyzer = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // ⚠️ PASTE YOUR FUNCTION URL HERE:
  const FUNCTION_URL = 'https://us-central1-campusconnectapp-6bfaf.cloudfunctions.net/analyzeGitHubProfile';

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch data');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto mt-10">
        <h1 className="text-4xl font-bold mb-4 text-blue-400 text-center">Forensic Skill Analyzer</h1>
        <p className="text-gray-400 mb-8 text-center max-w-2xl mx-auto">
          Enter a GitHub username. Our AI will analyze their public repositories, languages, and commit history to reveal their true developer stats (and give them a brutal roast).
        </p>

        {/* SEARCH FORM */}
        <form onSubmit={handleAnalyze} className="flex gap-4 max-w-xl mx-auto mb-12">
          <input
            type="text"
            placeholder="e.g., torvalds"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 p-4 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition-colors"
            required
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-8 py-4 rounded-lg font-bold transition-colors"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg mb-8 text-center">
            {error}
          </div>
        )}

        {/* THE REVEAL: ROAST & STATS */}
        {result && (
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* LEFT COLUMN: THE AI ROAST */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 text-purple-400 flex items-center gap-2">
                🤖 The AI Verdict
              </h2>
              <div className="prose prose-invert prose-blue max-w-none">
                <ReactMarkdown>{result.roast}</ReactMarkdown>
              </div>
            </div>

            {/* RIGHT COLUMN: DEVELOPER TRADING CARD */}
            <div className="bg-gradient-to-br from-blue-900 to-gray-900 p-6 rounded-xl border border-blue-800 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-white text-center">
                Verified Repo Stats
              </h2>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {result.stats.map((repo, index) => (
                  <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-blue-300 truncate pr-4">{repo.name}</h3>
                      <span className="flex items-center gap-1 text-yellow-400 text-sm font-bold bg-yellow-400/10 px-2 py-1 rounded">
                        ★ {repo.stars}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                      {repo.description}
                    </p>
                    <span className="inline-block text-xs font-bold px-2 py-1 bg-gray-700 rounded text-gray-300">
                      {repo.language}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default SkillAnalyzer;