export function SkeletonLayout() {
  return (
    <div className="w-full h-full flex flex-col p-6 animate-pulse bg-muted">
      <div className="h-6 w-1/2 bg-gray-300 rounded mb-4" />
      <div className="h-4 w-full bg-gray-300 rounded mb-2" />
      <div className="h-4 w-3/4 bg-gray-300 rounded mb-2" />
      <div className="h-4 w-5/6 bg-gray-300 rounded" />
    </div>
  );
}
