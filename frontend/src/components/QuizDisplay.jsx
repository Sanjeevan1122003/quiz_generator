export default function QuizDisplay({ quiz }) {
    // --------------------------------------------------
    // 0️⃣ Global Safety Check
    // --------------------------------------------------
    if (!quiz || typeof quiz !== "object") {
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded font-semibold">
                ❌ Error: Invalid quiz data received.
            </div>
        );
    }

    // --------------------------------------------------
    // 1️⃣ Universal Unwrap Function (SAFE)
    // --------------------------------------------------
    const unwrap = (q) => {
        try {
            let temp = q;
            let depth = 0;

            // prevent infinite loop (max 5 un-nest)
            while (temp?.quiz && typeof temp.quiz === "object" && depth < 5) {
                temp = temp.quiz;
                depth++;
            }

            return temp;
        } catch {
            return q;
        }
    };

    let data = unwrap(quiz);

    // --------------------------------------------------
    // 2️⃣ Extract fields safely
    // --------------------------------------------------
    const title =
        data?.title ||
        data?.quizTitle ||
        data?.quiz_title ||
        "Untitled Quiz";

    const description =
        data?.description ||
        data?.quiz_description ||
        data?.summary ||
        null;

    const questions = Array.isArray(data?.questions) ? data.questions : [];

    // --------------------------------------------------
    // 3️⃣ No questions found
    // --------------------------------------------------
    if (!questions.length) {
        return (
            <div className="p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded text-center">
                ⚠️ No questions available for this quiz.
            </div>
        );
    }

    // --------------------------------------------------
    // 4️⃣ Render Quiz
    // --------------------------------------------------
    return (
        <div className="mt-6 space-y-6 max-h-[80vh] p-2 ">

            {/* Title */}
            <h2 className="text-2xl font-bold">{title}</h2>

            {/* Description */}
            {description && (
                <p className="text-gray-700">{description}</p>
            )}

            {/* Questions */}
            <div className="space-y-4">
                {questions.map((q, index) => {
                    const questionText =
                        q?.question ||
                        q?.questionText ||
                        q?.q ||
                        "Untitled Question";

                    const difficulty = q?.difficulty || "unknown";

                    let options = [];
                    if (Array.isArray(q?.options)) {
                        options = q.options;
                    } else if (typeof q?.options === "object") {
                        options = Object.values(q.options);
                    } else {
                        options = ["Option A", "Option B", "Option C", "Option D"];
                    }

                    const answer =
                        q?.answer ||
                        q?.correctAnswer ||
                        q?.correct_option ||
                        "No answer provided";

                    return (
                        <div
                            key={index}
                            className="border p-4 rounded-lg bg-gray-50 shadow-sm"
                        >
                            <h3 className="font-semibold mb-2">
                                <span className="font-bold">{index + 1}.</span>{" "}
                                {questionText}
                                <span className="ml-2 font-bold text-blue-600">
                                    ({difficulty})
                                </span>
                            </h3>

                            {/* Options */}
                            <ol className="ml-6 list-decimal">
                                {options.map((opt, idx) => (
                                    <li key={idx}>{opt}</li>
                                ))}
                            </ol>

                            {/* Answer */}
                            <p className="mt-2 font-bold text-green-600">
                                Answer: {answer}
                            </p>

                            {/* Explanation */}
                            {q?.explanation && (
                                <p className="text-sm text-gray-600 mt-1">
                                    Explanation: {q.explanation}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
