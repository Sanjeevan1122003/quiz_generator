import { useState } from "react";
import Tabs from "./components/Tabs";
import GenerateQuizTab from "./components/tab/GenerateQuizTab";
import HistoryTab from "./components/tab/HistoryTab";

export default function App() {
  const [activeTab, setActiveTab] = useState("generate");

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl p-6 h-[710px] overflow-hidden">

        {/* Tabs Navigation */}
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Section */}
        <div className="h-[630px] overflow-hidden">
          {activeTab === "generate" ? (
            <GenerateQuizTab />
          ) : (
            <HistoryTab />
          )}
        </div>
      </div>
    </div>
  );
}
