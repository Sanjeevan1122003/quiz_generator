import { useEffect, useState } from "react";
import { getHistory, getQuizById } from "../services/api";
import Modal from "../Modal";
import QuizDisplay from "../QuizDisplay";
import HistoryTable from "../HistoryTable";

export default function HistoryTab() {
    const [history, setHistory] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [loadingId, setLoadingId] = useState(null);
    const [error, setError] = useState("");
    const [loadingHistory, setLoadingHistory] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const data = await getHistory();

                // Backend error (FastAPI)
                if (data?.detail) {
                    setError(data.detail);
                }
                // Server offline or failed fetch
                else if (!Array.isArray(data)) {
                    setError("Server is offline. Please try again later.");
                }
                else {
                    setHistory(data);
                }
            } catch (err) {
                setError("Failed to load history. Server might be offline.");
            } finally {
                setLoadingHistory(false);
            }
        })();
    }, []);

    const unwrap = (q) => {
        try {
            let data = q;
            let depth = 0;
            while (data?.quiz && typeof data.quiz === "object" && depth < 5) {
                data = data.quiz;
                depth++;
            }
            return data;
        } catch {
            return q;
        }
    };

    const openQuiz = async (id) => {
        setLoadingId(id);
        setError("");

        try {
            const data = await getQuizById(id);

            if (data?.detail) {
                setError(data.detail);
                return;
            }

            if (!data || !data.quiz) {
                setError("Failed to load quiz details.");
                return;
            }

            // send fully normalized quiz data
            const unwrapped = unwrap(data.quiz);
            setSelectedQuiz(unwrapped);

        } catch (err) {
            setError("Failed to fetch quiz. Server may be offline.");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="relative">

            {/* 🔵 Loading history */}
            {loadingHistory && (
                <div className="p-4 bg-blue-100 rounded mb-4 text-center border border-blue-300">
                    <p className="text-blue-700 font-semibold animate-pulse">
                        🌐 Loading history...
                    </p>
                </div>
            )}

            {/* 🔴 Error box */}
            {error && (
                <div className="bg-red-100 text-red-800 border border-red-300 p-3 rounded mb-4 text-center">
                    <strong>🚫 </strong> {error}
                </div>
            )}

            {/* ⚠ No history */}
            {!loadingHistory && history.length === 0 && !error && (
                <div className="p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded text-center">
                    No quiz history found.
                </div>
            )}

            {/* 📄 History Table */}
            {!loadingHistory && history.length > 0 && (
                <HistoryTable
                    history={history}
                    onOpenQuiz={openQuiz}
                    loadingId={loadingId}
                />
            )}

            {/* 🧩 Modal (Quiz details) */}
            {selectedQuiz && (
                <Modal onClose={() => setSelectedQuiz(null)}>
                    <QuizDisplay quiz={selectedQuiz} />
                </Modal>
            )}
        </div>
    );
}
