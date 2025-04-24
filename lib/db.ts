import { neon } from "@neondatabase/serverless"

// Crear una instancia de cliente SQL reutilizable
export const sql = neon(process.env.DATABASE_URL!)

// Tipos para nuestros datos
export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
}

export interface Article {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string | null
  featured_image: string | null
  author: string | null
  author_image: string | null
  author_role: string | null
  published_at: string
  reading_time: number
  is_featured: boolean
  categories?: Category[]
  tags?: Tag[]
  created_at?: string
  updated_at?: string
}

export interface Tag {
  id: number
  name: string
  slug: string
}

export interface User {
  id: number
  email: string
  name: string
  role: string
}

export interface Session {
  id: string
  user_id: number
  expires_at: Date
}

// Funciones para obtener datos
export async function getCategories(): Promise<Category[]> {
  const categories = await sql<Category[]>`
    SELECT id, name, slug, description
    FROM categories
    ORDER BY name ASC
  `
  return categories
}

export async function getArticles(limit = 10, offset = 0): Promise<Article[]> {
  const articles = await sql<Article[]>`
    SELECT id, title, slug, excerpt, featured_image, author, author_image, author_role, 
           published_at, reading_time, is_featured
    FROM articles
    ORDER BY published_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `
  return articles
}

export async function getAllArticles(): Promise<Article[]> {
  const articles = await sql<Article[]>`
    SELECT id, title, slug, excerpt, featured_image, author, author_image, author_role, 
           published_at, reading_time, is_featured, created_at, updated_at
    FROM articles
    ORDER BY published_at DESC
  `
  return articles
}

export async function getFeaturedArticles(limit = 3): Promise<Article[]> {
  const articles = await sql<Article[]>`
    SELECT id, title, slug, excerpt, featured_image, author, author_image, author_role, 
           published_at, reading_time, is_featured
    FROM articles
    WHERE is_featured = true
    ORDER BY published_at DESC
    LIMIT ${limit}
  `
  return articles
}

export async function getArticlesByCategory(categorySlug: string, limit = 10, offset = 0): Promise<Article[]> {
  const articles = await sql<Article[]>`
    SELECT a.id, a.title, a.slug, a.excerpt, a.featured_image, a.author, a.author_image, 
           a.author_role, a.published_at, a.reading_time, a.is_featured
    FROM articles a
    JOIN article_categories ac ON a.id = ac.article_id
    JOIN categories c ON ac.category_id = c.id
    WHERE c.slug = ${categorySlug}
    ORDER BY a.published_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `
  return articles
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await sql<Article[]>`
    SELECT id, title, slug, content, excerpt, featured_image, author, author_image, 
           author_role, published_at, reading_time, is_featured
    FROM articles
    WHERE slug = ${slug}
    LIMIT 1
  `

  if (articles.length === 0) {
    return null
  }

  const article = articles[0]

  // Obtener categorías del artículo
  const categories = await sql<Category[]>`
    SELECT c.id, c.name, c.slug, c.description
    FROM categories c
    JOIN article_categories ac ON c.id = ac.category_id
    WHERE ac.article_id = ${article.id}
  `

  // Obtener etiquetas del artículo
  const tags = await sql<Tag[]>`
    SELECT t.id, t.name, t.slug
    FROM tags t
    JOIN article_tags at ON t.id = at.tag_id
    WHERE at.article_id = ${article.id}
  `

  return {
    ...article,
    categories,
    tags,
  }
}

export async function getArticleById(id: number): Promise<Article | null> {
  const articles = await sql<Article[]>`
    SELECT id, title, slug, content, excerpt, featured_image, author, author_image, 
           author_role, published_at, reading_time, is_featured
    FROM articles
    WHERE id = ${id}
    LIMIT 1
  `

  if (articles.length === 0) {
    return null
  }

  const article = articles[0]

  // Obtener categorías del artículo
  const categories = await sql<Category[]>`
    SELECT c.id, c.name, c.slug, c.description
    FROM categories c
    JOIN article_categories ac ON c.id = ac.category_id
    WHERE ac.article_id = ${article.id}
  `

  // Obtener etiquetas del artículo
  const tags = await sql<Tag[]>`
    SELECT t.id, t.name, t.slug
    FROM tags t
    JOIN article_tags at ON t.id = at.tag_id
    WHERE at.article_id = ${article.id}
  `

  return {
    ...article,
    categories,
    tags,
  }
}

export async function getRelatedArticles(articleId: number, limit = 3): Promise<Article[]> {
  const articles = await sql<Article[]>`
    SELECT a.id, a.title, a.slug, a.excerpt, a.featured_image, a.author, a.author_image, 
           a.author_role, a.published_at, a.reading_time, a.is_featured
    FROM articles a
    JOIN related_articles ra ON a.id = ra.related_article_id
    WHERE ra.article_id = ${articleId}
    LIMIT ${limit}
  `
  return articles
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const categories = await sql<Category[]>`
    SELECT id, name, slug, description
    FROM categories
    WHERE id = ${id}
    LIMIT 1
  `

  if (categories.length === 0) {
    return null
  }

  return categories[0]
}

export async function getTags(): Promise<Tag[]> {
  const tags = await sql<Tag[]>`
    SELECT id, name, slug
    FROM tags
    ORDER BY name ASC
  `
  return tags
}

export async function getTagById(id: number): Promise<Tag | null> {
  const tags = await sql<Tag[]>`
    SELECT id, name, slug
    FROM tags
    WHERE id = ${id}
    LIMIT 1
  `

  if (tags.length === 0) {
    return null
  }

  return tags[0]
}

export async function getArticleCategories(articleId: number): Promise<Category[]> {
  const categories = await sql<Category[]>`
    SELECT c.id, c.name, c.slug, c.description
    FROM categories c
    JOIN article_categories ac ON c.id = ac.category_id
    WHERE ac.article_id = ${articleId}
  `
  return categories
}

export async function getArticleTags(articleId: number): Promise<Tag[]> {
  const tags = await sql<Tag[]>`
    SELECT t.id, t.name, t.slug
    FROM tags t
    JOIN article_tags at ON t.id = at.tag_id
    WHERE at.article_id = ${articleId}
  `
  return tags
}
