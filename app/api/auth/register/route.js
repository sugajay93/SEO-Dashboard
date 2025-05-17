import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ 
        message: "Nom, email et mot de passe sont requis" 
      }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (existingUser) {
      return NextResponse.json({ 
        message: "Un utilisateur avec cet email existe déjà" 
      }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create new user (by default as CLIENT)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CLIENT", // Default role
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: "Utilisateur créé avec succès",
      user: userWithoutPassword
    }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ 
      message: "Une erreur s'est produite lors de l'inscription" 
    }, { status: 500 })
  }
}