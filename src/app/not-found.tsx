import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-grid grid min-h-screen place-items-center p-6 text-center">
      <div>
        <p className="text-7xl font-extrabold text-royal">404</p>
        <h1 className="mt-2 text-xl font-bold text-navy">This page took a wrong turn on the way to Bali.</h1>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">Go home</Link>
          <Link href="/register" className="btn btn-register">Register Now</Link>
        </div>
      </div>
    </main>
  );
}
