import { Link } from "react-router-dom";
import TopoBackground from "../components/TopoBackground";
import ThemeToggle from "../components/ThemeToggle";
import PenguinFishing from "../components/PenguinFishing";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg">
      <ThemeToggle />
      <TopoBackground />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div
          className="w-full max-w-md px-10 py-12 flex flex-col items-center text-center"
          style={{
            background: "var(--color-card)",
            border: "1px solid var(--color-green-deep)",
          }}
        >
          <h1 className="font-display font-bold text-title tracking-tight text-ink leading-none">
            404<span className="text-green-deep">.</span>
          </h1>
          <p className="font-grotesk font-light text-caption text-gray-muted mt-3 mb-0">
            This page doesn't exist.
          </p>

          <PenguinFishing />

          <span className="btn-brutalist-wrap mt-6">
            <Link
              to="/"
              className="btn-brutalist block font-grotesk text-caption text-green-deep border border-green-deep px-5 py-2 bg-card"
            >
              go to homepage
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
