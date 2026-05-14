import { FaGithub, FaTwitter } from "react-icons/fa";

function Footer() {
    return (
        <footer className="mt-16 border-t border-white/6 pt-6">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-400">© 2026 DeepCheck Labs — All rights reserved.</div>
                <div className="flex items-center gap-4">
                    <a className="text-slate-300 hover:text-white transition" href="#">Privacy</a>
                    <a className="text-slate-300 hover:text-white transition" href="#">Terms</a>
                    <a className="text-slate-300 hover:text-white transition flex items-center gap-2" href="#">
                        <FaGithub /> <span className="text-xs">GitHub</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;