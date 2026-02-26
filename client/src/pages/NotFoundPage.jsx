import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="panel page-single">
      <h3>Page not found</h3>
      <Link className="btn-link btn-muted" to="/">Go Home</Link>
    </section>
  );
}
