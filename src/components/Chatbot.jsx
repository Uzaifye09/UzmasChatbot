import { useState } from "react";
import "../index.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const GEMINI_API_KEY = import.meta.env.VITE_UZMAS_APIKEY;
  const GEMINI_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.concat(userMsg).map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

      const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: history,
        }),
      });

      if (!res.ok) throw new Error("API request failed");

      const data = await res.json();
      const botText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I didn’t understand that.";

      setMessages((prev) => [...prev, { sender: "bot", text: botText }]);
    } catch (err) {
      console.error("Gemini API Error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error connecting to Gemini API." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-5 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold">AI Assistant</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm">Online</span>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
          >
            <div
              className={`px-5 py-3 rounded-2xl max-w-xs md:max-w-md lg:max-w-lg shadow-md message-bubble
                ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                }`}
            >
              <div className="flex items-start space-x-2">
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div>
                  <p className="font-medium text-sm mb-1">
                    {msg.sender === "user" ? "You" : "AI Assistant"}
                  </p>
                  <p className="text-sm">{msg.text}</p>
                </div>
                {msg.sender === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="px-5 py-3 rounded-2xl bg-white text-gray-600 shadow-md rounded-bl-none border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200 max-w-4xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="w-full border border-gray-300 rounded-full py-3 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <button
            onClick={handleSend}
            className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-3 rounded-full hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}