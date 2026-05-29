import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Activity } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center py-12 px-6 lg:px-8 text-center bg-background text-foreground">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="inline-flex items-center gap-1.5 text-primary font-bold text-2xl mb-8">
          <Activity className="h-6 w-6" />
          HAQMS
        </Link>

        <div className="p-8 rounded-xl border border-border bg-card shadow-xs max-w-sm mx-auto">
          <div className="p-3.5 bg-destructive/10 text-destructive rounded-full w-fit mx-auto mb-5">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <h2 className="text-4xl font-extrabold text-foreground">404</h2>
          <h3 className="mt-2 text-lg font-bold text-foreground">
            Page Not Found
          </h3>

          <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
            The page you are looking for does not exist or may have been moved.
            Please return to the dashboard and continue using the application.
          </p>

          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-flex w-full items-center justify-center gap-1.5 py-2.5 px-4 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

