// src/components/ChatBubble.jsx

export default function ChatBubble({ text, isUser, name, avatar }) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      {!isUser && avatar && (
        <img
          src={avatar}
          alt={name}
          className="w-8 h-8 rounded-full mr-2 self-end shadow"
        />
      )}
      <div className={`
        px-4 py-2 rounded-2xl shadow 
        ${isUser ? "bg-emerald-100 text-emerald-900" : "bg-gray-100 text-gray-800"} 
        max-w-[75%]
      `}>
        <span className="block text-xs text-gray-400 mb-1">{name}</span>
        {text}
      </div>
    </div>
  );
}
