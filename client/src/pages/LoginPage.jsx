import { useState } from "react";

export default function LoginPage({ onLogin, onLogout, loggedIn }) {
  const [form, setForm] = useState({ email: "", password: "" });

  return (
    <section className="panel page-single">
      <h3>Login To E-Gram Panchayat Services</h3>
      <form
        className="form-block"
        onSubmit={(e) => {
          e.preventDefault();
          onLogin(form);
        }}
      >
        <label>
          Email
          <input
            id="login-email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label>
          Password
          <input
            id="login-password"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        <button className="btn-login" type="submit">LOGIN</button>
        {loggedIn ? (
          <button className="btn-muted" type="button" onClick={onLogout}>LOGOUT</button>
        ) : null}
      </form>
    </section>
  );
}
