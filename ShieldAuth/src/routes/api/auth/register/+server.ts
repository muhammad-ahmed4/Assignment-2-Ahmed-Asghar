import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db.js";
import { users } from "$lib/server/db/schema.js";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { TokenService } from "$lib/server/tokens";
import type { RequestHandler } from "./$types.js";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with proper ID format
    const newUser = await db
      .insert(users)
      .values({
        id: nanoid(),
        name,
        email,
        password: hashedPassword,
        emailVerified: null, // Require email verification
        role: "user",
        isActive: true,
      })
      .returning();

    // Send email verification
    const emailSent = await TokenService.sendEmailVerification(
      newUser[0].id,
      newUser[0].email,
      newUser[0].name || "User"
    );

    // Return success (don't return password)
    const { password: _, ...userWithoutPassword } = newUser[0];

    return json(
      {
        message: emailSent
          ? "User created successfully. Please check your email to verify your account."
          : "User created successfully, but verification email could not be sent. Please contact support.",
        user: userWithoutPassword,
        emailVerificationSent: emailSent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
