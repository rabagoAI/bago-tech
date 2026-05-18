export const LoadingSkeleton = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <div
                    key={i}
                    className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-slate-700"
                    style={{ animationDelay: `${i * 80}ms` }}
                >
                    <div className="shimmer h-48 rounded-lg mb-4" />
                    <div className="space-y-3">
                        <div className="shimmer h-3 rounded-full w-1/3" />
                        <div className="shimmer h-4 rounded-full w-full" />
                        <div className="shimmer h-4 rounded-full w-3/4" />
                        <div className="flex gap-1 pt-1">
                            {[...Array(5)].map((_, j) => (
                                <div key={j} className="shimmer h-4 w-4 rounded" />
                            ))}
                            <div className="shimmer h-4 rounded-full w-16 ml-2" />
                        </div>
                        <div className="shimmer h-8 rounded-full w-1/3" />
                        <div className="shimmer h-10 rounded-lg w-full mt-2" />
                    </div>
                </div>
            ))}
        </div>
    )
}
