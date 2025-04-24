import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, ClockIcon } from "lucide-react"
import { getCategories, getFeaturedArticles, getArticles } from "@/lib/db"

export default async function HomePage() {
  const categories = await getCategories()
  const featuredArticles = await getFeaturedArticles(1)
  const latestArticles = await getArticles(6)

  const featuredArticle = featuredArticles[0]

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
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categoria/${category.slug}`}
                className="text-sm font-medium hover:text-rose-600"
              >
                {category.name}
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
        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Artículo Destacado</h2>
            <div className="grid md:grid-cols-2 gap-8 bg-gray-50 rounded-xl overflow-hidden">
              <div className="relative aspect-video md:aspect-auto">
                <Image
                  src={featuredArticle.featured_image || "/placeholder.svg?height=600&width=1200"}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center space-x-4 mb-4">
                  <Badge className="bg-rose-600 hover:bg-rose-700">Destacado</Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>
                      {new Date(featuredArticle.published_at).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-4">{featuredArticle.title}</h1>
                <p className="text-gray-700 mb-6">{featuredArticle.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={featuredArticle.author_image || "/placeholder.svg?height=40&width=40"}
                        alt={featuredArticle.author || "Autor"}
                      />
                      <AvatarFallback>{featuredArticle.author?.substring(0, 2) || "AU"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{featuredArticle.author}</p>
                      <p className="text-xs text-gray-500">{featuredArticle.author_role}</p>
                    </div>
                  </div>
                  <Link href={`/articulo/${featuredArticle.slug}`}>
                    <Button>Leer más</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Latest Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Últimas Noticias</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
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
                    <Badge className="bg-rose-600 hover:bg-rose-700">Noticias</Badge>
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
          <div className="mt-6 text-center">
            <Link href="/noticias">
              <Button variant="outline">Ver todas las noticias</Button>
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Categorías</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categoria/${category.slug}`}
                className="bg-gray-50 hover:bg-gray-100 p-6 rounded-lg transition-colors"
              >
                <h3 className="font-bold text-lg mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </Link>
            ))}
          </div>
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
                {categories.slice(0, 4).map((category) => (
                  <li key={category.id}>
                    <Link href={`/categoria/${category.slug}`} className="text-sm hover:text-rose-600">
                      {category.name}
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
