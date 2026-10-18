import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <main className="bg-grid grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Image src="/brand/dob.webp" alt="Dreams of Bangladesh" width={1305} height={459} className="h-14 w-auto" priority />
        </div>
        <div className="card overflow-hidden">
          <div className="h-1.5 bg-orange" />
          <div className="p-6">
            <h1 className="text-xl font-bold text-royal">BIESF Bangladesh admin</h1>
            <p className="mt-1 text-sm text-navy/60">For the Dreams of Bangladesh team only.</p>
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
