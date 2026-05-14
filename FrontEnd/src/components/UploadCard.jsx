import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AiOutlineCloudUpload, AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

export default function UploadCard({ mode = "image" }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setError("");
        if (inputRef.current) inputRef.current.value = "";
    }, [mode]);

    const handleFileChange = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
        setResult(null);
        setError("");
    };

    const handleReset = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setError("");
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file first");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const endpointMap = {
                image: "http://127.0.0.1:8000/predict",
                video: "http://127.0.0.1:8000/predict_video",
            };

            const endpoint = endpointMap[mode] || endpointMap.image;

            const token = localStorage.getItem("dc_token");
            const headers = { "Content-Type": "multipart/form-data" };
            if (token) headers.Authorization = `Bearer ${token}`;
            const response = await axios.post(endpoint, formData, {
                headers,
            });

            setResult(response.data);
        } catch (err) {
            console.error(err);
            const details = err?.response?.data ? JSON.stringify(err.response.data) : err.message;
            setError(`Failed to analyze file: ${details}`);
        } finally {
            setLoading(false);
        }
    };

    const isFake = (pred) => {
        if (!pred) return false;
        const p = String(pred).toLowerCase();
        return p === "fake" || p === "ai" || p.includes("fake") || p.includes("ai");
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="p-6 bg-white/6 backdrop-blur-md rounded-2xl border border-white/6 shadow-2xl transition transform hover:-translate-y-1">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1 text-center md:text-left">
                        <label className="block mb-4">
                            <div className="mx-auto md:mx-0 inline-flex items-center gap-3 px-4 py-3 rounded-lg bg-white/8 hover:bg-white/10 cursor-pointer transition">
                                <AiOutlineCloudUpload className="text-cyan-300 text-2xl" />
                                <span className="text-sm text-white/90 font-medium">Choose {mode === "image" ? "Image" : "Video"}</span>
                            </div>
                            <input
                                ref={inputRef}
                                type="file"
                                accept={mode === "image" ? "image/*" : "video/*"}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>

                        {preview && mode === "image" && (
                            <img src={preview} alt="preview" className="w-48 h-48 object-cover rounded-md mx-auto md:mx-0 border border-white/6" />
                        )}

                        {preview && mode === "video" && (
                            <video src={preview} controls className="w-full md:w-80 rounded-md mx-auto md:mx-0 border border-white/6" />
                        )}
                    </div>

                    <div className="w-full md:w-72 flex-shrink-0 text-center">
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleUpload}
                                className="px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-500 text-white font-semibold shadow hover:scale-105 transform transition"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                        </svg>
                                        <span>Analyzing...</span>
                                    </div>
                                ) : (
                                    <span>{mode === "image" ? "Analyze Image" : "Analyze Video"}</span>
                                )}
                            </button>

                            <button onClick={handleReset} className="px-3 py-2 rounded-lg bg-white/6 text-white hover:scale-105 transition">
                                Reset
                            </button>
                        </div>

                        {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}
                    </div>
                </div>

                {/* Result Area */}
                {result && (
                    <div className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <div className={`p-4 rounded-lg shadow-md transition transform ${isFake(result.prediction) ? "bg-red-800/40 border border-red-600" : "bg-green-800/30 border border-green-600"}`}>
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">
                                        {isFake(result.prediction) ? <AiOutlineCloseCircle className="text-red-400" /> : <AiOutlineCheckCircle className="text-green-300" />}
                                    </div>
                                    <div>
                                        <div className="text-sm text-white/90 font-semibold">{isFake(result.prediction) ? "FAKE" : "REAL"}</div>
                                        <div className="text-xs text-slate-300">Model verdict</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-white/4 border border-white/6">
                                <div className="flex items-baseline justify-between">
                                    <div className="text-sm text-slate-300">Confidence</div>
                                    <div className="text-sm font-medium text-white">{Number(result.confidence).toFixed(2)}%</div>
                                </div>

                                <div className="w-full bg-white/10 h-3 rounded-full mt-3 overflow-hidden">
                                    <div
                                        className={`h-3 rounded-full ${isFake(result.prediction) ? "bg-red-500" : "bg-green-400"}`}
                                        style={{ width: `${Number(result.confidence)}%`, transition: "width 900ms ease" }}
                                    />
                                </div>
                            </div>
                        </div>

                        {result.explanation && (
                            <div className="mt-4 text-sm text-slate-300">{result.explanation}</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}