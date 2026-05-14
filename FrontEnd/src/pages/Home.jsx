import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white scroll-smooth">
            <Navbar />
            <main className="py-6">
                <Hero />
            </main>
            <Footer />
        </div>
    );
}