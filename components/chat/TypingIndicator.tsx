export default function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 px-2">
      <span className="w-2 h-2 bg-gray-400 dark:bg-gray-200 rounded-full animate-blink"></span>
      <span className="w-2 h-2 bg-gray-400 dark:bg-gray-200 rounded-full animate-blink delay-200"></span>
      <span className="w-2 h-2 bg-gray-400 dark:bg-gray-200 rounded-full animate-blink delay-400"></span>
    </div>
  );
}
