"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Category } from "@/lib/db"
import { createCategory, updateCategory } from "@/lib/actions"

interface CategoryFormProps {
  category?: Category
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      let result

      if (category) {
        result = await updateCategory(category.id, formData)
      } else {
        result = await createCategory(formData)
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" name="name" defaultValue={category?.name || ""} required />
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={category?.slug || ""} required />
        </div>

        <div>
          <Label htmlFor="description">Descripción</Label>
          <Textarea id="description" name="description" defaultValue={category?.description || ""} rows={3} />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : category ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  )
}
