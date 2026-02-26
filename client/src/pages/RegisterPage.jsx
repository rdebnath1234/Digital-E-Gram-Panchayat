import { useState } from "react";

export default function RegisterPage({ onRegister }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  return (
    <section className="panel page-single">
      <h3>Not Registered? Register Here</h3>
      <form
        className="form-block"
        onSubmit={(e) => {
          e.preventDefault();
          onRegister(form);
        }}
      >
        <label>
          Name
          <input
            id="register-name"
            name="name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label>
          Email
          <input
            id="register-email"
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
            id="register-password"
            name="password"
            type="password"
            minLength={6}
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        <button className="btn-register" type="submit">REGISTER</button>
      </form>
    </section>
  );
}
