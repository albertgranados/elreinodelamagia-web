import { getCategories, getTags } from "@/lib/db"
import { ArticleForm } from "../article-form"

export default async function NewArticlePage() {
  const [categories, tags] = await Promise.all([getCategories(), getTags()])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Crear nuevo artículo</h1>
      <ArticleForm categories={categories} tags={tags} />
    </div>
  )
}
