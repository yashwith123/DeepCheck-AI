import React from "react";

export default function HistoryCard({ item, onDelete, onView }) {
    const isImage = item.file_type === "image";
    const resultIsReal = item.prediction && item.prediction.toLowerCase() === "real";

    const color = resultIsReal ? "bg-emerald-500" : "bg-rose-500";

    return (
        <div className="bg-slate-800 rounded-lg p-4 shadow-md flex gap-4 items-center">
            <div className="w-24 h-24 rounded overflow-hidden bg-slate-700 flex items-center justify-center">
                {isImage ? (
                    <img
                        src={`/uploads/${item.filename}`}
                        alt={item.filename}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                            // Prevent infinite onError loop by only replacing once
                            try {
                                if (!e.currentTarget.dataset._err) {
                                    e.currentTarget.dataset._err = "1";
                                    e.currentTarget.src = "/placeholder.png";
                                }
                            } catch (err) {
                                e.currentTarget.src = "/placeholder.png";
                            }
                        }}
                    />
                ) : (
                    <div className="text-sm text-slate-300">Video</div>
                )}
            </div>

            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-white font-medium">{item.filename}</div>
                        <div className="text-xs text-slate-400">Type: {item.file_type}</div>
                    </div>
                    <div className="text-right">
                        <div className={`inline-block px-3 py-1 rounded-full text-white text-sm ${color}`}>{item.prediction}</div>
                        <div className="text-xs text-slate-400 mt-1">{new Date(item.created_at).toLocaleString()}</div>
                    </div>
                </div>

                <div className="mt-3">
                    <div className="text-xs text-slate-400">Confidence</div>
                    <div className="w-full bg-white/5 rounded-full h-3 mt-1 overflow-hidden">
                        <div className={`${color} h-3`} style={{ width: `${Math.min(100, item.confidence)}%` }} />
                    </div>
                </div>

                <div className="mt-3 flex gap-2">
                    <button onClick={() => onView ? onView(item) : (window.location.href = '/')} className="px-3 py-1 bg-white/6 rounded hover:bg-white/5">View</button>
                    <button onClick={() => onDelete(item.id)} className="px-3 py-1 bg-rose-600 text-white rounded hover:opacity-90">Delete</button>
                </div>
            </div>
        </div>
    );
}
