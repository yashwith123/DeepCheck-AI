import { useState } from "react";
import { AiOutlineMenu, AiOutlineClose, AiOutlineLock } from "react-icons/ai";
import Login from "./Login";
import Signup from "./Signup";
import ProfileDropdown from "./ProfileDropdown";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const [open, setOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const { user, welcome } = useAuth();

    return (
        <header className="w-full sticky top-0 z-40 bg-transparent">
            <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg">
                        <AiOutlineLock className="text-white text-xl" />
                    </div>
                    <div>
                        <a className="text-white font-semibold text-lg tracking-tight hover:opacity-90 cursor-pointer" href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/' }}>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white/90 to-white/60">DeepCheck</span>
                            <span className="ml-1 text-sm text-cyan-300">AI</span>
                        </a>
                        <div className="text-xs text-slate-400">Content Authenticity</div>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-8 text-slate-200">
                    <a className="hover:text-white transition cursor-pointer" onClick={(e) => { e.preventDefault(); if (window.location.pathname === '/') { window.location.hash = '#features'; } else { window.location.href = '/#features'; } }}>Features</a>
                    <a className="hover:text-white transition cursor-pointer" onClick={(e) => { e.preventDefault(); if (window.location.pathname === '/') { window.location.hash = '#about'; } else { window.location.href = '/#about'; } }}>About</a>

                </div>

                <div className="hidden md:flex items-center gap-4">
                    {!user ? (
                        <>
                            <button onClick={() => setShowLogin(true)} className="px-4 py-2 rounded-lg bg-white/6 text-white border border-white/10 hover:scale-105 transform transition">
                                Sign in
                            </button>
                            <button onClick={() => setShowSignup(true)} className="px-3 py-2 rounded-lg bg-cyan-500 text-slate-900 font-semibold hover:scale-105 transition">Sign up</button>
                        </>
                    ) : (
                        <div className="flex items-center gap-6">
                            <a className="hover:text-white transition text-slate-200 cursor-pointer" onClick={(e) => { e.preventDefault(); window.location.href = '/history' }}>History</a>
                            <ProfileDropdown />
                        </div>
                    )}
                </div>

                <div className="md:hidden flex items-center">
                    <button onClick={() => setOpen((s) => !s)} className="p-2 rounded-md bg-white/6 text-white">
                        {open ? <AiOutlineClose /> : <AiOutlineMenu />}
                    </button>
                </div>

                {open && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/80 backdrop-blur-sm rounded-b-lg shadow-lg md:hidden">
                        <div className="flex flex-col gap-3 p-4 text-slate-200">
                            <a className="py-2 px-3 rounded hover:bg-white/5 cursor-pointer" onClick={(e) => { e.preventDefault(); if (window.location.pathname === '/') { window.location.hash = '#features'; } else { window.location.href = '/#features'; } }}>Features</a>
                            <a className="py-2 px-3 rounded hover:bg-white/5 cursor-pointer" onClick={(e) => { e.preventDefault(); if (window.location.pathname === '/') { window.location.hash = '#about'; } else { window.location.href = '/#about'; } }}>About</a>
                            <a className="py-2 px-3 rounded hover:bg-white/5 cursor-pointer" onClick={(e) => { e.preventDefault(); if (window.location.pathname === '/') { window.location.hash = '#docs'; } else { window.location.href = '/#docs'; } }}>Docs</a>
                            {!user ? (
                                <>
                                    <button onClick={() => setShowLogin(true)} className="mt-2 py-2 px-3 rounded bg-white/6">Sign in</button>
                                    <button onClick={() => setShowSignup(true)} className="mt-2 py-2 px-3 rounded bg-cyan-500 text-slate-900">Sign up</button>
                                </>
                            ) : (
                                <>
                                    <a className="mt-2 py-2 px-3 rounded hover:bg-white/5" href="/history">History</a>
                                    <div className="mt-2 py-2 px-3"><ProfileDropdown /></div>
                                </>
                            )}
                        </div>
                    </div>
                )}
                {showLogin && <Login onClose={() => setShowLogin(false)} onSuccess={() => { setShowLogin(false); }} />}
                {showSignup && <Signup onClose={() => setShowSignup(false)} onSuccess={() => { setShowSignup(false); }} />}
                {welcome && (
                    <div className="fixed top-20 right-6 bg-slate-800 text-white px-4 py-2 rounded shadow-lg">{welcome}</div>
                )}
            </nav>
        </header>
    );
}

export default Navbar;