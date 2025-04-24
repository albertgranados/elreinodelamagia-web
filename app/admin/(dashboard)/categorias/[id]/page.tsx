import { notFound } from "next/navigation"
import { getCategoryById } from "@/lib/db"
import { CategoryForm } from "../category-form"

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const category = await getCategoryById(id)

  if (!category) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar categoría</h1>
      <CategoryForm category={category} />
    </div>
  )
}
