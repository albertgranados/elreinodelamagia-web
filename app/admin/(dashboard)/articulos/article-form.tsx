"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { Article, Category, Tag } from "@/lib/db"
import { createArticle, updateArticle } from "@/lib/actions"

interface ArticleFormProps {
  article?: Article
  categories: Category[]
  tags: Tag[]
}

export function ArticleForm({ article, categories, tags }: ArticleFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<number[]>(article?.categories?.map((c) => c.id) || [])
  const [selectedTags, setSelectedTags] = useState<number[]>(article?.tags?.map((t) => t.id) || [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    // Añadir categorías y etiquetas seleccionadas
    formData.set("categories", selectedCategories.join(","))
    formData.set("tags", selectedTags.join(","))

    try {
      let result

      if (article) {
        result = await updateArticle(article.id, formData)
      } else {
        result = await createArticle(formData)
      }

      if (result.success) {
        // Si la operación fue exitosa, redirigimos manualmente
        router.push(result.redirectUrl)
        router.refresh()
      } else {
        // Si hubo un error, lo mostramos
        setError(result.error || "Ha ocurrido un error")
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Error al guardar:", error)
      setError("Ha ocurrido un error inesperado")
      setIsSubmitting(false)
    }
  }

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const toggleTag = (tagId: number) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input id="title" name="title" defaultValue={article?.title || ""} required />
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={article?.slug || ""} required />
        </div>

        <div>
          <Label htmlFor="excerpt">Extracto</Label>
          <Textarea id="excerpt" name="excerpt" defaultValue={article?.excerpt || ""} rows={3} />
        </div>

        <div>
          <Label htmlFor="content">Contenido</Label>
          <Textarea id="content" name="content" defaultValue={article?.content || ""} rows={10} required />
        </div>

        <div>
          <Label htmlFor="featured_image">Imagen destacada (URL)</Label>
          <Input
            id="featured_image"
            name="featured_image"
            defaultValue={article?.featured_image || "/placeholder.svg?height=600&width=1200"}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="author">Autor</Label>
            <Input id="author" name="author" defaultValue={article?.author || ""} />
          </div>

          <div>
            <Label htmlFor="author_image">Imagen del autor (URL)</Label>
            <Input
              id="author_image"
              name="author_image"
              defaultValue={article?.author_image || "/placeholder.svg?height=40&width=40"}
            />
          </div>

          <div>
            <Label htmlFor="author_role">Rol del autor</Label>
            <Input id="author_role" name="author_role" defaultValue={article?.author_role || ""} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="reading_time">Tiempo de lectura (minutos)</Label>
            <Input
              id="reading_time"
              name="reading_time"
              type="number"
              min="1"
              defaultValue={article?.reading_time || 5}
            />
          </div>

          <div className="flex items-center space-x-2 pt-8">
            <Checkbox id="is_featured" name="is_featured" defaultChecked={article?.is_featured || false} />
            <Label htmlFor="is_featured">Artículo destacado</Label>
          </div>
        </div>

        <div>
          <Label>Categorías</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => toggleCategory(category.id)}
                />
                <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Etiquetas</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag.id}`}
                  checked={selectedTags.includes(tag.id)}
                  onCheckedChange={() => toggleTag(tag.id)}
                />
                <Label htmlFor={`tag-${tag.id}`}>{tag.name}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : article ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  )
}
