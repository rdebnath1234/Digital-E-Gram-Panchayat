import { useState } from "react";

export default function ApplicationSection({ role, applications, onApply, onRefresh, onUpdateStatus }) {
  const [applyData, setApplyData] = useState({ serviceId: "", notes: "" });
  const [statusData, setStatusData] = useState({ applicationId: "", status: "Pending" });

  return (
    <section className="panel">
      <h3>Applications</h3>

      {role === "user" && (
        <form
          className="form-block"
          onSubmit={(e) => {
            e.preventDefault();
            onApply(applyData);
            setApplyData({ serviceId: "", notes: "" });
          }}
        >
          <h4>User: Apply For Service</h4>
          <label>Service ID<input id="apply-service-id" name="serviceId" required value={applyData.serviceId} onChange={(e) => setApplyData({ ...applyData, serviceId: e.target.value })} /></label>
          <label>Notes<textarea id="apply-notes" name="notes" required value={applyData.notes} onChange={(e) => setApplyData({ ...applyData, notes: e.target.value })} /></label>
          <button className="btn-login" type="submit">Submit Application</button>
        </form>
      )}

      {(role === "staff" || role === "officer" || role === "admin") && (
        <form
          className="form-block"
          onSubmit={(e) => {
            e.preventDefault();
            onUpdateStatus(statusData.applicationId, statusData.status);
          }}
        >
          <h4>Staff/Officer: Update Status</h4>
          <label>Application ID<input id="status-application-id" name="applicationId" required value={statusData.applicationId} onChange={(e) => setStatusData({ ...statusData, applicationId: e.target.value })} /></label>
          <label>Status
            <select id="status-value" name="status" value={statusData.status} onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}>
              <option>Pending</option>
              <option>Under Review</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </label>
          <button className="btn-admin" type="submit">Update Status</button>
        </form>
      )}

      <div className="form-block">
        <h4>My Application Status</h4>
        <button className="btn-muted" onClick={onRefresh}>Refresh</button>
        <ul>
          {applications.length === 0 ? <li>No records.</li> : null}
          {applications.map((a) => (
            <li key={a.id}>
              <strong>Service ID:</strong> {a.serviceId}<br />
              <strong>Status:</strong> {a.status}<br />
              <small>Application ID: {a.id}</small>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
