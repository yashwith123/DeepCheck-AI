import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function Settings() {
    const [username, setUsername] = useState("");
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [loadingUser, setLoadingUser] = useState(false);
    const [loadingPass, setLoadingPass] = useState(false);
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");
    const [showPass, setShowPass] = useState(false);

    const token = localStorage.getItem("dc_token");

    const saveUsername = async () => {
        setLoadingUser(true); setMsg(""); setErr("");
        try {
            const res = await axios.put("http://127.0.0.1:8000/settings/username", { username }, { headers: { Authorization: `Bearer ${token}` } });
            setMsg(res.data.message || "Username updated successfully");
            localStorage.setItem("dc_user", username);
            setTimeout(() => setMsg(""), 3000);
        } catch (e) {
            setErr((e.response && e.response.data && e.response.data.detail) || e.message || "Update failed");
        } finally { setLoadingUser(false); }
    };

    const changePassword = async () => {
        setLoadingPass(true); setMsg(""); setErr("");
        try {
            const res = await axios.put("http://127.0.0.1:8000/settings/password", { old_password: oldPass, new_password: newPass }, { headers: { Authorization: `Bearer ${token}` } });
            setMsg(res.data.message || "Password changed successfully");
            setOldPass(""); setNewPass("");
            setTimeout(() => setMsg(""), 3000);
        } catch (e) {
            setErr((e.response && e.response.data && e.response.data.detail) || e.message || "Change failed");
        } finally { setLoadingPass(false); }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
            <Navbar />
            <main className="max-w-4xl mx-auto p-6">
                <h2 className="text-2xl font-semibold">Settings</h2>

                <div className="mt-6 grid grid-cols-1 gap-6">
                    <div className="p-6 bg-slate-800 rounded-lg">
                        <h3 className="font-semibold">Change Username</h3>
                        <div className="mt-3 flex gap-2">
                            <input className="flex-1 px-3 py-2 rounded bg-slate-700 text-white" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="New username" />
                            <button onClick={saveUsername} className="px-4 py-2 bg-cyan-500 rounded" disabled={loadingUser}>{loadingUser ? 'Saving...' : 'Save'}</button>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-800 rounded-lg">
                        <h3 className="font-semibold">Change Password</h3>
                        <div className="mt-3 flex flex-col gap-3">
                            <div className="flex gap-2">
                                <input type={showPass ? 'text' : 'password'} className="flex-1 px-3 py-2 rounded bg-slate-700 text-white" value={oldPass} onChange={(e) => setOldPass(e.target.value)} placeholder="Old password" />
                            </div>
                            <div className="flex gap-2">
                                <input type={showPass ? 'text' : 'password'} className="flex-1 px-3 py-2 rounded bg-slate-700 text-white" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="New password" />
                                <button onClick={() => setShowPass(s => !s)} className="px-3 py-2 bg-slate-700 rounded">{showPass ? 'Hide' : 'Show'}</button>
                            </div>
                            <div>
                                <button onClick={changePassword} className="px-4 py-2 bg-emerald-500 rounded" disabled={loadingPass}>{loadingPass ? 'Saving...' : 'Change Password'}</button>
                            </div>
                        </div>
                    </div>

                    {(msg || err) && (
                        <div className={`p-3 rounded ${err ? 'bg-rose-800' : 'bg-emerald-700'}`}>{err || msg}</div>
                    )}
                </div>
            </main>
        </div>
    );
}
