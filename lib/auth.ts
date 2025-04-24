"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sql } from "./db";
import * as bcrypt from "bcrypt";

// Tipos
export type User = {
  id: number;
  email: string;
  name: string;
  role: string;
};

export type Session = {
  id: string;
  userId: number;
  expiresAt: Date;
};

// Función para verificar credenciales
export async function verifyCredentials(
  email: string,
  password: string
): Promise<User | null> {
  try {
    const users = await sql<
      {
        id: number;
        email: string;
        password: string;
        name: string;
        role: string;
      }[]
    >`
      SELECT id, email, password, name, role
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;

    if (users.length === 0) {
      return null;
    }

    const user = users[0];
    console.log("Usuario:", user.password);
    //bycript password
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log("Contraseña hasheada:", hashedPassword);

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return null;
    }

    // No devolver la contraseña
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error("Error al verificar credenciales:", error);
    return null;
  }
}

// Función para crear una sesión
export async function createSession(userId: number): Promise<string> {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // La sesión expira en 7 días

  try {
    await sql`
      INSERT INTO sessions (id, user_id, expires_at)
      VALUES (${sessionId}, ${userId}, ${expiresAt})
    `;

    // Establecer cookie de sesión
    cookies().set("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return sessionId;
  } catch (error) {
    console.error("Error al crear sesión:", error);
    throw new Error("No se pudo crear la sesión");
  }
}

// Función para obtener la sesión actual
export async function getSession(): Promise<Session | null> {
  const sessionId = cookies().get("sessionId")?.value;

  if (!sessionId) {
    return null;
  }

  try {
    const sessions = await sql<
      { id: string; user_id: number; expires_at: Date }[]
    >`
      SELECT id, user_id, expires_at
      FROM sessions
      WHERE id = ${sessionId} AND expires_at > NOW()
      LIMIT 1
    `;

    if (sessions.length === 0) {
      return null;
    }

    const session = sessions[0];
    return {
      id: session.id,
      userId: session.user_id,
      expiresAt: session.expires_at,
    };
  } catch (error) {
    console.error("Error al obtener sesión:", error);
    return null;
  }
}

// Función para obtener el usuario actual
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();

  if (!session) {
    return null;
  }

  try {
    const users = await sql<
      { id: number; email: string; name: string; role: string }[]
    >`
      SELECT id, email, name, role
      FROM users
      WHERE id = ${session.userId}
      LIMIT 1
    `;

    if (users.length === 0) {
      return null;
    }

    return users[0];
  } catch (error) {
    console.error("Error al obtener usuario actual:", error);
    return null;
  }
}

// Función para cerrar sesión
export async function logout(): Promise<void> {
  const sessionId = cookies().get("sessionId")?.value;

  if (sessionId) {
    try {
      await sql`
        DELETE FROM sessions
        WHERE id = ${sessionId}
      `;
    } catch (error) {
      console.error("Error al eliminar sesión:", error);
    }
  }

  cookies().delete("sessionId");
}

// Middleware para proteger rutas
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}
