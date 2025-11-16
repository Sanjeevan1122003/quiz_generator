import { useState } from "react";
import { generateQuiz } from "../services/api";
import QuizDisplay from "../QuizDisplay";

export default function GenerateQuizTab() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState("");

  // Validate Wikipedia URLs
  const isValidWikipediaUrl = (url) => {
    if (!url) return false;
    try {
      const u = new URL(url);
      return u.hostname.endsWith("wikipedia.org");
    } catch {
      return false;
    }
  };

  const handleGenerate = async () => {
    setError("");
    setQuiz(null);

    //Empty field
    if (!url.trim()) {
      setError("URL cannot be empty.");
      return;
    }

    // Not a valid Wikipedia link
    if (!isValidWikipediaUrl(url)) {
      setError("Please enter a valid Wikipedia URL.");
      return;
    }

    try {
      setLoading(true);

      const result = await generateQuiz(url);

      //Backend error response
      if (result?.detail) {
        setError(result.detail);
        setLoading(false);
        return;
      }

      //Unexpected structure
      if (!result || !result.quiz) {
        setError("Failed to process quiz. Please try again.");
        setLoading(false);
        return;
      }

      setQuiz(result);

    } catch (err) {

      if (err.message?.includes("Failed to fetch")) {
        setError("Server is offline. Please try again later.");
      } else {
        setError("Failed to generate quiz. Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="h-full">
      {/* Input + Button */}
      <div className="flex gap-3 mb-6">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          type="text"
          placeholder="Enter Wikipedia URL..."
          className="flex-1 p-3 border rounded-lg"
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-semibold text-white ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600"
            }`}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-4 bg-red-100 border border-red-300 rounded text-center">
          <p className="text-red-700 font-semibold">🚫 {error}</p>
        </div>
      )}

      {/* Content Scroll */}
      <div className="overflow-y-auto h-[500px]">
        {/* Quiz Output */}
        {!loading && quiz && <QuizDisplay quiz={quiz} />}

        {/* Loader */}
        {loading && (
          <div className="p-4 bg-blue-100 border border-blue-300 rounded text-center">
            <p className="text-blue-700 font-semibold animate-pulse">
              🌐 Generating quiz questions...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
