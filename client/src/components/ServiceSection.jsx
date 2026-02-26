import { useState } from "react";

export default function ServiceSection({ role, services, onSearch, onCreate, onUpdate, onDelete }) {
  const [form, setForm] = useState({ title: "", description: "" });

  return (
    <section className="panel">
      <h3>Services</h3>
      {(role === "officer" || role === "admin") && (
        <form
          className="form-block"
          onSubmit={(e) => {
            e.preventDefault();
            onCreate(form);
            setForm({ title: "", description: "" });
          }}
        >
          <h4>Officer/Admin: Create Service</h4>
          <label>Service Name<input id="service-title" name="title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
          <label>Description<textarea id="service-description" name="description" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <button className="btn-admin" type="submit">Create Service</button>
        </form>
      )}

      <label>Search Services<input id="service-search" name="serviceSearch" onChange={(e) => onSearch(e.target.value)} placeholder="Search services..." /></label>
      <ul>
        {services.length === 0 ? <li>No records.</li> : null}
        {services.map((s) => (
          <li key={s.id}>
            <strong>{s.title}</strong><br />
            <span>{s.description}</span><br />
            <small>ID: {s.id}</small>
            {(role === "officer" || role === "admin") && (
              <div className="actions">
                <button className="mini" onClick={() => {
                  const title = window.prompt("New title", s.title);
                  const description = window.prompt("New description", s.description);
                  if (title && description) onUpdate(s.id, { title, description });
                }}>Edit</button>
                <button className="mini danger" onClick={() => onDelete(s.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
