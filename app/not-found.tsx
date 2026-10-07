import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 rounded-full bg-slate-100 p-4">
        <FileQuestion className="h-10 w-10 text-slate-500" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">
        Sorry, we couldn’t find the page you’re looking for. It might have been moved or removed.
      </p>
      <Link
        href={ROUTES.dashboard}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}
