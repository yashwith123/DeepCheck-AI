import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import StatsCard from "../components/StatsCard";

function formatDate(iso) {
    try {
        const d = new Date(iso);
        return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) { return iso; }
}

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function fetchProfile() {
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("dc_token");
            const res = await axios.get("http://127.0.0.1:8000/profile", { headers: { Authorization: `Bearer ${token}` } });
            setProfile(res.data);
        } catch (err) {
            if (err.response && err.response.status === 401) setError("Unauthorized. Please sign in.");
            else setError(err.message || "Failed to load profile");
        } finally { setLoading(false); }
    }

    useEffect(() => { fetchProfile(); }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
            <Navbar />
            <main className="max-w-6xl mx-auto p-6">
                <h2 className="text-2xl font-semibold">Profile</h2>

                <div className="mt-6">
                    {loading && <div className="p-6 bg-slate-800 rounded">Loading profile...</div>}
                    {error && <div className="p-4 bg-rose-800 rounded">{error}</div>}
                    {!loading && !error && profile && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <ProfileCard username={profile.username} email={profile.email} joined={formatDate(profile.created_at)} />
                            </div>
                            <div className="grid gap-4">
                                <StatsCard title="Total Uploads" value={profile.total_uploads} accent="text-cyan-300" />
                                <StatsCard title="Fake Detected" value={profile.fake_count} accent="text-rose-400" />
                                <StatsCard title="Real Detected" value={profile.real_count} accent="text-emerald-300" />
                            </div>
                        </div>
                    )}
                    {!loading && !error && !profile && (
                        <div className="p-6 bg-slate-800 rounded">No profile data available.</div>
                    )}
                </div>
            </main>
        </div>
    );
}
