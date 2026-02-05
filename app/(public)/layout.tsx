import { Suspense } from "react";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
