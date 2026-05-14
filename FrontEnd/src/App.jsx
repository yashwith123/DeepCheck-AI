import Home from "./pages/Home"
import History from "./pages/History"
import Profile from "./pages/Profile"
import Settings from "./pages/Settings"
import { AuthProvider } from "./context/AuthContext";

function App() {
    const path = typeof window !== "undefined" ? window.location.pathname : "/";
    return (
        <AuthProvider>
            {path === "/history" ? <History /> : path === "/profile" ? <Profile /> : path === "/settings" ? <Settings /> : <Home />}
        </AuthProvider>
    );
}

export default App