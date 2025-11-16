export default function HistoryTable({ history = [], onOpenQuiz, loadingId }) {
    return (
        <div className="overflow-y-auto max-h-[73vh] border rounded-lg">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-blue-600 text-white sticky top-0">
                        <th className="p-3 border">ID</th>
                        <th className="p-3 border">URL</th>
                        <th className="p-3 border">Title</th>
                        <th className="p-3 border">Date</th>
                        <th className="p-3 border">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {history.length === 0 && (
                        <tr>
                            <td
                                colSpan={5}
                                className="p-4 text-center text-gray-600"
                            >
                                No history available
                            </td>
                        </tr>
                    )}

                    {history.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-100">
                            <td className="p-3 border">{item.id}</td>

                            {/* URL truncated for safety */}
                            <td className="p-3 border max-w-[280px] truncate">
                                {item.url}
                            </td>

                            {/* Title */}
                            <td className="p-3 border">
                                {item.title || "Untitled"}
                            </td>

                            {/* Date formatted DD-MM-YYYY */}
                            <td className="p-3 border">
                                {item.date_generated
                                    ? new Date(item.date_generated)
                                        .toLocaleDateString("en-GB")
                                        .replace(/\//g, "-")
                                    : "N/A"}
                            </td>

                            {/* Button with loader */}
                            <td className="p-3 border text-center">
                                <button
                                    onClick={() => onOpenQuiz(item.id)}
                                    className={`px-3 py-1 rounded text-white font-medium transition 
                                        ${loadingId === item.id
                                            ? "bg-gray-500 cursor-not-allowed"
                                            : "bg-blue-500 hover:bg-blue-600"
                                        }
                                    `}
                                    disabled={loadingId === item.id}
                                >
                                    {loadingId === item.id
                                        ? "Loading..."
                                        : "Details"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
