import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ClockIcon } from "lucide-react"
import { getCategories, getArticlesByCategory } from "@/lib/db"

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categories = await getCategories()
  const category = categories.find((c) => c.slug === params.slug)

  if (!category) {
    notFound()
  }

  const articles = await getArticlesByCategory(params.slug, 12)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b sticky top-0 bg-white z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/" className="font-bold text-xl text-rose-600">
              DisneyNews
            </Link>
            <Badge variant="outline" className="text-xs">
              Portal Oficial
            </Badge>
          </div>
          <nav className="hidden md:flex space-x-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className={`text-sm font-medium hover:text-rose-600 ${cat.id === category.id ? "text-rose-600" : ""}`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Category Header */}
          <div className="mb-8 text-center">
            <Badge className="bg-rose-600 hover:bg-rose-700 mb-4">Categoría</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{category.name}</h1>
            {category.description && <p className="text-gray-600 max-w-2xl mx-auto">{category.description}</p>}
          </div>

          {/* Articles */}
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Card key={article.id} className="overflow-hidden flex flex-col">
                  <div className="relative aspect-video">
                    <Image
                      src={article.featured_image || `/placeholder.svg?height=200&width=400&text=Noticia`}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className="bg-rose-600 hover:bg-rose-700">{category.name}</Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        <span>{article.reading_time} min</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 flex-grow">{article.excerpt}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <div className="text-xs text-gray-500">
                        {new Date(article.published_at).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <Link
                        href={`/articulo/${article.slug}`}
                        className="text-rose-600 text-sm font-medium hover:underline"
                      >
                        Leer más
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay artículos en esta categoría.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">DisneyNews</h3>
              <p className="text-sm text-gray-600">
                Tu portal de noticias sobre los parques Disney en todo el mundo. Información actualizada, guías y
                consejos para tu próxima visita.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Secciones</h4>
              <ul className="space-y-2">
                {categories.slice(0, 4).map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/categoria/${cat.slug}`} className="text-sm hover:text-rose-600">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Destinos</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm hover:text-rose-600">
                    Walt Disney World
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm hover:text-rose-600">
                    Disneyland
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm hover:text-rose-600">
                    Disneyland Paris
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm hover:text-rose-600">
                    Tokyo Disney
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Suscríbete</h4>
              <p className="text-sm text-gray-600 mb-4">Recibe las últimas noticias en tu correo</p>
              <div className="flex">
                <input type="email" placeholder="Tu email" className="px-3 py-2 border rounded-l-md w-full text-sm" />
                <Button className="rounded-l-none">Enviar</Button>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
            <p>© 2025 DisneyNews. Todos los derechos reservados.</p>
            <p className="mt-2">DisneyNews no está afiliado con The Walt Disney Company.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
