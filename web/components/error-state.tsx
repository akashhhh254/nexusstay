export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 shadow-soft">
      <div className="text-base font-semibold">Something went wrong</div>
      <p className="mt-2 text-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-4 rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700">
          Retry
        </button>
      )}
    </div>
  );
}
