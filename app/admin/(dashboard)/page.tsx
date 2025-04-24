import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllArticles, getCategories, getTags } from "@/lib/db";

export default async function DashboardPage() {
  const [articles, categories, tags] = await Promise.all([
    getAllArticles(),
    getCategories(),
    getTags(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Artículos</CardTitle>
            <CardDescription>Total de artículos publicados</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{articles.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Categorías</CardTitle>
            <CardDescription>Total de categorías</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{categories.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Etiquetas</CardTitle>
            <CardDescription>Total de etiquetas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{tags.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Artículos recientes</CardTitle>
            <CardDescription>Últimos artículos publicados</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {articles.slice(0, 5).map((article) => (
                <li key={article.id} className="border-b pb-2">
                  <Link
                    href={`/admin/articulos/${article.id}`}
                    className="hover:text-rose-600"
                  >
                    {article.title}
                  </Link>
                  <p className="text-xs text-gray-500">
                    {new Date(article.published_at).toLocaleDateString("es-ES")}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Link
                href="/admin/articulos"
                className="text-sm text-rose-600 hover:underline"
              >
                Ver todos los artículos
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
            <CardDescription>Gestiona tu contenido</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/articulos/nuevo" className="block w-full">
              <div className="bg-rose-50 hover:bg-rose-100 p-4 rounded-lg border border-rose-200 text-center">
                Crear nuevo artículo
              </div>
            </Link>
            <Link href="/admin/categorias/nueva" className="block w-full">
              <div className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg border border-blue-200 text-center">
                Crear nueva categoría
              </div>
            </Link>
            <Link href="/admin/etiquetas/nueva" className="block w-full">
              <div className="bg-green-50 hover:bg-green-100 p-4 rounded-lg border border-green-200 text-center">
                Crear nueva etiqueta
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
