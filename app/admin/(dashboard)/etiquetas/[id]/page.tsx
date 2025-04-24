import { notFound } from "next/navigation"
import { getTagById } from "@/lib/db"
import { TagForm } from "../tag-form"

export default async function EditTagPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const tag = await getTagById(id)

  if (!tag) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar etiqueta</h1>
      <TagForm tag={tag} />
    </div>
  )
}
