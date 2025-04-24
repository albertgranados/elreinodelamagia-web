import { notFound } from "next/navigation"
import { getArticleById, getCategories, getTags } from "@/lib/db"
import { ArticleForm } from "../article-form"

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const [article, categories, tags] = await Promise.all([getArticleById(id), getCategories(), getTags()])

  if (!article) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar artículo</h1>
      <ArticleForm article={article} categories={categories} tags={tags} />
    </div>
  )
}
