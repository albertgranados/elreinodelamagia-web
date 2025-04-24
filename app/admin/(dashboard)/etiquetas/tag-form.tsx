"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Tag } from "@/lib/db"
import { createTag, updateTag } from "@/lib/actions"

interface TagFormProps {
  tag?: Tag
}

export function TagForm({ tag }: TagFormProps) {
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

      if (tag) {
        result = await updateTag(tag.id, formData)
      } else {
        result = await createTag(formData)
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
          <Input id="name" name="name" defaultValue={tag?.name || ""} required />
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={tag?.slug || ""} required />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : tag ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  )
}
