export default function Tabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "generate", label: "Generate Quiz" },
    { id: "history", label: "History" }
  ];

  return (
    <div className="flex gap-3 mb-6 border-b pb-3 select-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md font-semibold transition-all duration-200 outline-none
              ${isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
