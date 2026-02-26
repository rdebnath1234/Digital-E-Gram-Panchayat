import { useEffect, useMemo, useState } from "react";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import { authApi } from "./api/authApi";
import { serviceApi } from "./api/serviceApi";
import { applicationApi } from "./api/applicationApi";
import { logApi } from "./api/logApi";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ServicesPage from "./pages/ServicesPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import LogsPage from "./pages/LogsPage";
import NotFoundPage from "./pages/NotFoundPage";

function parseUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export default function App() {
  const [user, setUser] = useState(parseUser());
  const [services, setServices] = useState([]);
  const [applications, setApplications] = useState([]);
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState("Not logged in");

  const role = useMemo(() => user?.role || null, [user]);

  async function run(task) {
    try {
      await task();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function loadServices(search = "") {
    if (!user) return;
    setServices(await serviceApi.list(search));
  }

  async function loadApplications() {
    if (!user) return;
    setApplications(await applicationApi.mine());
  }

  async function loadLogs() {
    if (!(role === "staff" || role === "officer" || role === "admin")) return;
    setLogs(await logApi.list());
  }

  async function onRegister(payload) {
    await run(async () => {
      await authApi.register(payload);
      setMessage("Registration successful. Please login.");
    });
  }

  async function onLogin(payload) {
    await run(async () => {
      const data = await authApi.login(payload);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setMessage(`${data.user.email} (${data.user.role})`);
    });
  }

  async function onLogout() {
    await run(async () => {
      await authApi.logout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setServices([]);
      setApplications([]);
      setLogs([]);
      setMessage("Not logged in");
    });
  }

  useEffect(() => {
    if (!user) return;
    run(async () => {
      setMessage(`${user.email} (${user.role})`);
      await loadServices();
      await loadApplications();
      await loadLogs();
    });
  }, [user]);

  return (
    <div className="app-shell">
      <header className="appbar">
        <h1>Gram Panchayat Services</h1>
        <div>{message}</div>
        <nav className="topnav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/register">Register</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/applications">Applications</NavLink>
          {(role === "staff" || role === "officer" || role === "admin") && <NavLink to="/logs">Logs</NavLink>}
        </nav>
      </header>

      <main className="screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={<LoginPage onLogin={onLogin} onLogout={onLogout} loggedIn={Boolean(user)} />}
          />
          <Route path="/register" element={<RegisterPage onRegister={onRegister} />} />
          <Route
            path="/services"
            element={
              user ? (
                <ServicesPage
                  role={role}
                  services={services}
                  onSearch={(term) => run(async () => loadServices(term))}
                  onCreate={(payload) =>
                    run(async () => {
                      await serviceApi.create(payload);
                      await loadServices();
                    })
                  }
                  onUpdate={(id, payload) =>
                    run(async () => {
                      await serviceApi.update(id, payload);
                      await loadServices();
                    })
                  }
                  onDelete={(id) =>
                    run(async () => {
                      await serviceApi.remove(id);
                      await loadServices();
                    })
                  }
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/applications"
            element={
              user ? (
                <ApplicationsPage
                  role={role}
                  applications={applications}
                  onApply={(payload) =>
                    run(async () => {
                      await applicationApi.apply(payload);
                      await loadApplications();
                    })
                  }
                  onRefresh={() => run(async () => loadApplications())}
                  onUpdateStatus={(id, status) =>
                    run(async () => {
                      await applicationApi.updateStatus(id, status);
                      await loadLogs();
                    })
                  }
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/logs"
            element={
              role === "staff" || role === "officer" || role === "admin" ? (
                <LogsPage role={role} logs={logs} onRefresh={() => run(async () => loadLogs())} />
              ) : (
                <Navigate to="/services" replace />
              )
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}
