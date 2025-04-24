"use server"

import { revalidatePath } from "next/cache"
import { sql } from "./db"

// Tipos para los formularios
export type ArticleFormData = {
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string
  author: string
  author_image: string
  author_role: string
  reading_time: number
  is_featured: boolean
  categories: number[]
  tags: number[]
}

export type CategoryFormData = {
  name: string
  slug: string
  description: string
}

export type TagFormData = {
  name: string
  slug: string
}

// Acciones para artículos
export async function createArticle(formData: FormData) {
  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const content = formData.get("content") as string
  const excerpt = formData.get("excerpt") as string
  const featured_image = formData.get("featured_image") as string
  const author = formData.get("author") as string
  const author_image = formData.get("author_image") as string
  const author_role = formData.get("author_role") as string
  const reading_time = Number.parseInt(formData.get("reading_time") as string) || 5
  const is_featured = formData.get("is_featured") === "on"

  // Categorías y etiquetas vienen como strings separadas por comas
  const categoriesStr = formData.get("categories") as string
  const tagsStr = formData.get("tags") as string

  const categories = categoriesStr ? categoriesStr.split(",").map((id) => Number.parseInt(id.trim())) : []
  const tags = tagsStr ? tagsStr.split(",").map((id) => Number.parseInt(id.trim())) : []

  try {
    // Insertar el artículo
    const result = await sql`
      INSERT INTO articles (
        title, slug, content, excerpt, featured_image, 
        author, author_image, author_role, reading_time, is_featured
      ) 
      VALUES (
        ${title}, ${slug}, ${content}, ${excerpt}, ${featured_image}, 
        ${author}, ${author_image}, ${author_role}, ${reading_time}, ${is_featured}
      )
      RETURNING id
    `

    const articleId = result[0].id

    // Insertar relaciones con categorías
    if (categories.length > 0) {
      for (const categoryId of categories) {
        await sql`
          INSERT INTO article_categories (article_id, category_id)
          VALUES (${articleId}, ${categoryId})
        `
      }
    }

    // Insertar relaciones con etiquetas
    if (tags.length > 0) {
      for (const tagId of tags) {
        await sql`
          INSERT INTO article_tags (article_id, tag_id)
          VALUES (${articleId}, ${tagId})
        `
      }
    }

    revalidatePath("/admin/articulos")
    revalidatePath("/")

    // En lugar de redirect, devolvemos un objeto con información
    return { success: true, redirectUrl: "/admin/articulos" }
  } catch (error) {
    console.error("Error al crear el artículo:", error)
    return { success: false, error: "No se pudo crear el artículo" }
  }
}

export async function updateArticle(id: number, formData: FormData) {
  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const content = formData.get("content") as string
  const excerpt = formData.get("excerpt") as string
  const featured_image = formData.get("featured_image") as string
  const author = formData.get("author") as string
  const author_image = formData.get("author_image") as string
  const author_role = formData.get("author_role") as string
  const reading_time = Number.parseInt(formData.get("reading_time") as string) || 5
  const is_featured = formData.get("is_featured") === "on"

  // Categorías y etiquetas vienen como strings separadas por comas
  const categoriesStr = formData.get("categories") as string
  const tagsStr = formData.get("tags") as string

  const categories = categoriesStr ? categoriesStr.split(",").map((id) => Number.parseInt(id.trim())) : []
  const tags = tagsStr ? tagsStr.split(",").map((id) => Number.parseInt(id.trim())) : []

  try {
    // Actualizar el artículo
    await sql`
      UPDATE articles
      SET 
        title = ${title},
        slug = ${slug},
        content = ${content},
        excerpt = ${excerpt},
        featured_image = ${featured_image},
        author = ${author},
        author_image = ${author_image},
        author_role = ${author_role},
        reading_time = ${reading_time},
        is_featured = ${is_featured},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    // Eliminar relaciones existentes con categorías
    await sql`DELETE FROM article_categories WHERE article_id = ${id}`

    // Insertar nuevas relaciones con categorías
    if (categories.length > 0) {
      for (const categoryId of categories) {
        await sql`
          INSERT INTO article_categories (article_id, category_id)
          VALUES (${id}, ${categoryId})
        `
      }
    }

    // Eliminar relaciones existentes con etiquetas
    await sql`DELETE FROM article_tags WHERE article_id = ${id}`

    // Insertar nuevas relaciones con etiquetas
    if (tags.length > 0) {
      for (const tagId of tags) {
        await sql`
          INSERT INTO article_tags (article_id, tag_id)
          VALUES (${id}, ${tagId})
        `
      }
    }

    revalidatePath("/admin/articulos")
    revalidatePath(`/articulo/${slug}`)
    revalidatePath("/")

    // En lugar de redirect, devolvemos un objeto con información
    return { success: true, redirectUrl: "/admin/articulos" }
  } catch (error) {
    console.error("Error al actualizar el artículo:", error)
    return { success: false, error: "No se pudo actualizar el artículo" }
  }
}

export async function deleteArticle(id: number) {
  try {
    // Eliminar relaciones
    await sql`DELETE FROM article_categories WHERE article_id = ${id}`
    await sql`DELETE FROM article_tags WHERE article_id = ${id}`
    await sql`DELETE FROM related_articles WHERE article_id = ${id} OR related_article_id = ${id}`

    // Eliminar el artículo
    await sql`DELETE FROM articles WHERE id = ${id}`

    revalidatePath("/admin/articulos")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error al eliminar el artículo:", error)
    return { success: false, error: "No se pudo eliminar el artículo" }
  }
}

// Acciones para categorías
export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string
  const slug = formData.get("slug") as string
  const description = formData.get("description") as string

  try {
    await sql`
      INSERT INTO categories (name, slug, description)
      VALUES (${name}, ${slug}, ${description})
    `

    revalidatePath("/admin/categorias")
    revalidatePath("/")

    // En lugar de redirect, devolvemos un objeto con información
    return { success: true, redirectUrl: "/admin/categorias" }
  } catch (error) {
    console.error("Error al crear la categoría:", error)
    return { success: false, error: "No se pudo crear la categoría" }
  }
}

export async function updateCategory(id: number, formData: FormData) {
  const name = formData.get("name") as string
  const slug = formData.get("slug") as string
  const description = formData.get("description") as string

  try {
    await sql`
      UPDATE categories
      SET 
        name = ${name},
        slug = ${slug},
        description = ${description},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    revalidatePath("/admin/categorias")
    revalidatePath("/")

    // En lugar de redirect, devolvemos un objeto con información
    return { success: true, redirectUrl: "/admin/categorias" }
  } catch (error) {
    console.error("Error al actualizar la categoría:", error)
    return { success: false, error: "No se pudo actualizar la categoría" }
  }
}

export async function deleteCategory(id: number) {
  try {
    // Eliminar relaciones
    await sql`DELETE FROM article_categories WHERE category_id = ${id}`

    // Eliminar la categoría
    await sql`DELETE FROM categories WHERE id = ${id}`

    revalidatePath("/admin/categorias")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error al eliminar la categoría:", error)
    return { success: false, error: "No se pudo eliminar la categoría" }
  }
}

// Acciones para etiquetas
export async function createTag(formData: FormData) {
  const name = formData.get("name") as string
  const slug = formData.get("slug") as string

  try {
    await sql`
      INSERT INTO tags (name, slug)
      VALUES (${name}, ${slug})
    `

    revalidatePath("/admin/etiquetas")

    // En lugar de redirect, devolvemos un objeto con información
    return { success: true, redirectUrl: "/admin/etiquetas" }
  } catch (error) {
    console.error("Error al crear la etiqueta:", error)
    return { success: false, error: "No se pudo crear la etiqueta" }
  }
}

export async function updateTag(id: number, formData: FormData) {
  const name = formData.get("name") as string
  const slug = formData.get("slug") as string

  try {
    await sql`
      UPDATE tags
      SET 
        name = ${name},
        slug = ${slug}
      WHERE id = ${id}
    `

    revalidatePath("/admin/etiquetas")

    // En lugar de redirect, devolvemos un objeto con información
    return { success: true, redirectUrl: "/admin/etiquetas" }
  } catch (error) {
    console.error("Error al actualizar la etiqueta:", error)
    return { success: false, error: "No se pudo actualizar la etiqueta" }
  }
}

export async function deleteTag(id: number) {
  try {
    // Eliminar relaciones
    await sql`DELETE FROM article_tags WHERE tag_id = ${id}`

    // Eliminar la etiqueta
    await sql`DELETE FROM tags WHERE id = ${id}`

    revalidatePath("/admin/etiquetas")

    return { success: true }
  } catch (error) {
    console.error("Error al eliminar la etiqueta:", error)
    return { success: false, error: "No se pudo eliminar la etiqueta" }
  }
}
