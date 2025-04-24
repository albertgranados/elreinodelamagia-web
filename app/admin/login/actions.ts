"use server";
import { verifyCredentials, createSession } from "@/lib/auth";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  console.log("Email:", email);
  console.log("Password:", password);

  if (!email || !password) {
    return {
      success: false,
      error: "Correo electrónico y contraseña son requeridos",
    };
  }

  try {
    const user = await verifyCredentials(email, password);

    if (!user) {
      return { success: false, error: "Credenciales inválidas" };
    }

    await createSession(user.id);
    return { success: true, redirectUrl: "/admin" };
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return { success: false, error: "Error al iniciar sesión" };
  }
}
