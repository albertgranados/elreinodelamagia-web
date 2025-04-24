import type React from "react";
import Link from "next/link";
import { LogoutButton } from "./logout-button";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/admin" className="font-bold text-xl text-rose-600">
              DisneyNews Admin
            </Link>
          </div>
          <nav className="flex space-x-4">
            <Link href="/" className="text-sm font-medium hover:text-rose-600">
              Ver sitio
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="bg-white p-4 rounded-lg shadow-sm">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/admin"
                  className="block p-2 hover:bg-gray-100 rounded"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/articulos"
                  className="block p-2 hover:bg-gray-100 rounded"
                >
                  Artículos
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/categorias"
                  className="block p-2 hover:bg-gray-100 rounded"
                >
                  Categorías
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/etiquetas"
                  className="block p-2 hover:bg-gray-100 rounded"
                >
                  Etiquetas
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1 bg-white p-6 rounded-lg shadow-sm">
          {children}
        </main>
      </div>
    </div>
  );
}
