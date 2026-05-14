import { useState } from "react";
import UploadCard from "./UploadCard";
import { FiCpu } from "react-icons/fi";
import { AiOutlineInfoCircle } from "react-icons/ai";

function Hero() {
    const [mode, setMode] = useState("image");

    return (
        <section className="relative overflow-hidden">
            <div className="pt-12 pb-16 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
                        Authenticate content with DeepCheck AI
                    </h1>
                    <p className="mt-3 text-slate-300 max-w-2xl mx-auto">
                        Fast, secure AI-powered detection for images and videos — defend against manipulated media with confidence.
                    </p>

                    <div className="mt-8 flex justify-center">
                        <div className="inline-flex rounded-xl overflow-hidden bg-white/6 p-1 shadow-lg backdrop-blur-sm">
                            <button
                                onClick={() => setMode("image")}
                                className={`px-5 py-2 rounded-lg font-medium transition transform ${mode === "image" ? "bg-gradient-to-r from-cyan-400 to-indigo-500 text-white shadow-md scale-105" : "text-white/90 hover:bg-white/5"}`}
                            >
                                Image
                            </button>
                            <button
                                onClick={() => setMode("video")}
                                className={`px-5 py-2 rounded-lg font-medium transition transform ${mode === "video" ? "bg-gradient-to-r from-cyan-400 to-indigo-500 text-white shadow-md scale-105" : "text-white/90 hover:bg-white/5"}`}
                            >
                                Video
                            </button>
                        </div>
                    </div>

                    <div className="mt-10">
                        <UploadCard mode={mode} />
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section id="features" className="-mt-6 relative z-10 max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 rounded-xl p-6 text-center backdrop-blur-sm border border-white/6 shadow-md">
                        <div className="mx-auto w-12 h-12 rounded-md bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white">
                            <FiCpu />
                        </div>
                        <h3 className="mt-4 font-semibold text-white">AI Image Detection</h3>
                        <p className="mt-2 text-sm text-slate-300">Detect manipulated images with high accuracy using state-of-the-art models.</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 text-center backdrop-blur-sm border border-white/6 shadow-md">
                        <div className="mx-auto w-12 h-12 rounded-md bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white">📹</div>
                        <h3 className="mt-4 font-semibold text-white">Deepfake Video Detection</h3>
                        <p className="mt-2 text-sm text-slate-300">Analyze video frames to reveal synthetic manipulations and tampering.</p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 text-center backdrop-blur-sm border border-white/6 shadow-md">
                        <div className="mx-auto w-12 h-12 rounded-md bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center text-white">🔒</div>
                        <h3 className="mt-4 font-semibold text-white">Secure AI Analysis</h3>
                        <p className="mt-2 text-sm text-slate-300">Local-first analysis with safe endpoints and privacy-respecting workflows.</p>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="mt-12 max-w-4xl mx-auto px-6">
                <div className="bg-white/5 rounded-xl p-8 backdrop-blur-sm border border-white/6 shadow-md">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-md bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-2xl">
                            <AiOutlineInfoCircle />
                        </div>
                        <div>
                            <h3 className="text-white text-2xl font-semibold">About DeepCheck</h3>
                            <p className="mt-2 text-slate-300">
                                DeepCheck is an AI-driven content authenticity platform focused on detecting manipulated
                                images and videos. We combine lightweight, local-first analysis with secure server-side
                                models to give fast and privacy-aware results for forensic and cybersecurity use cases.
                            </p>
                            <ul className="mt-3 text-slate-300 list-disc list-inside space-y-1">
                                <li>Image and video analysis using state-of-the-art deep learning models.</li>
                                <li>Designed for fast integration into workflows and privacy-conscious deployments.</li>
                                <li>Clear confidence scores, explanation metadata, and enterprise-friendly APIs.</li>
                            </ul>
                            <p className="mt-3 text-sm text-slate-400">Trusted by researchers and security teams for actionable results.</p>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
}

export default Hero;