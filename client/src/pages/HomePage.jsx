import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="hero page-single">
      <h2>WELCOME TO E-PANCHAYAT</h2>
      <div className="logo-badge">GP</div>
      <div className="hero-actions">
        <Link className="btn-link btn-login" to="/login">LOGIN</Link>
        <Link className="btn-link btn-register" to="/register">REGISTER</Link>
        <Link className="btn-link btn-admin" to="/login">ADMIN LOGIN</Link>
      </div>
    </section>
  );
}
