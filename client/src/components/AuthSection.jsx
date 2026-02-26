import { useState } from "react";

export default function AuthSection({ onRegister, onLogin, onLogout, loggedIn }) {
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  return (
    <section className="panel" id="authCard">
      <h3>Login To E-Gram Panchayat Services</h3>
      <div className="stack">
        <form
          className="form-block"
          onSubmit={(e) => {
            e.preventDefault();
            onLogin(loginData);
          }}
        >
          <label>Email<input id="legacy-login-email" name="email" type="email" required value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} /></label>
          <label>Password<input id="legacy-login-password" name="password" type="password" required value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} /></label>
          <button className="btn-login" type="submit">LOGIN</button>
          {loggedIn ? <button className="btn-muted" type="button" onClick={onLogout}>LOGOUT</button> : null}
        </form>

        <form
          className="form-block"
          onSubmit={(e) => {
            e.preventDefault();
            onRegister(registerData);
          }}
        >
          <h4>Not Registered? Register Here</h4>
          <label>Name<input id="legacy-register-name" name="name" required value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} /></label>
          <label>Email<input id="legacy-register-email" name="email" type="email" required value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} /></label>
          <label>Password<input id="legacy-register-password" name="password" type="password" required minLength={6} value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} /></label>
          <button className="btn-register" type="submit">REGISTER</button>
        </form>
      </div>
    </section>
  );
}
