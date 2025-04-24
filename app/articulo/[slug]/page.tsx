import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, ClockIcon, ShareIcon, BookmarkIcon } from "lucide-react"
import { getArticleBySlug, getRelatedArticles, getCategories } from "@/lib/db"

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(article.id, 3)
  const categories = await getCategories()

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
        <div className="max-w-4xl mx-auto">
          {/* Category and Date */}
          <div className="flex items-center space-x-4 mb-4">
            {article.categories?.map((category) => (
              <Link key={category.id} href={`/categoria/${category.slug}`}>
                <Badge className="bg-rose-600 hover:bg-rose-700">{category.name}</Badge>
              </Link>
            ))}
            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>
                {new Date(article.published_at).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{article.title}</h1>

          {/* Author */}
          <div className="flex items-center space-x-3 mb-6">
            <Avatar>
              <AvatarImage
                src={article.author_image || "/placeholder.svg?height=40&width=40"}
                alt={article.author || "Autor"}
              />
              <AvatarFallback>{article.author?.substring(0, 2) || "AU"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{article.author}</p>
              <p className="text-xs text-gray-500">{article.author_role}</p>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
            <Image
              src={article.featured_image || "/placeholder.svg?height=600&width=1200"}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content */}
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {article.tags.map((tag) => (
                <Badge key={tag.id} variant="outline">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Share and Save */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ShareIcon className="h-4 w-4 mr-2" />
                Compartir
              </Button>
              <Button variant="outline" size="sm">
                <BookmarkIcon className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>{article.reading_time} min de lectura</span>
            </div>
          </div>

          {/* Related News */}
          {relatedArticles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Noticias relacionadas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Card key={relatedArticle.id} className="overflow-hidden">
                    <div className="relative aspect-video">
                      <Image
                        src={relatedArticle.featured_image || `/placeholder.svg?height=200&width=400&text=Noticia`}
                        alt={relatedArticle.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <Badge className="mb-2" variant="secondary">
                        Relacionado
                      </Badge>
                      <h3 className="font-bold mb-2">{relatedArticle.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(relatedArticle.published_at).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <Link
                        href={`/articulo/${relatedArticle.slug}`}
                        className="text-rose-600 text-sm font-medium hover:underline"
                      >
                        Leer más
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
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
