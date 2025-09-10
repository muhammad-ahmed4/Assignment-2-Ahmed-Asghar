import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { TokenService } from "$lib/server/tokens";

export const load: PageServerLoad = async ({ locals }) => {
  // Redirect if already authenticated
  if (locals.auth?.user) {
    throw redirect(303, "/dashboard");
  }

  return {};
};

export const actions: Actions = {
  default: async ({ request }) => {
    try {
      const data = await request.formData();
      const name = data.get("name") as string;
      const email = data.get("email") as string;
      const password = data.get("password") as string;
      const confirmPassword = data.get("confirmPassword") as string;

      // Validation
      if (!name || !email || !password || !confirmPassword) {
        return fail(400, {
          error: "All fields are required",
        });
      }

      if (password !== confirmPassword) {
        return fail(400, {
          error: "Passwords do not match",
        });
      }

      if (password.length < 8) {
        return fail(400, {
          error: "Password must be at least 8 characters long",
        });
      }

      // Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser) {
        return fail(409, {
          error: "User with this email already exists",
        });
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

      // Redirect to check email page
      throw redirect(
        303,
        `/auth/check-email?context=registration&email=${encodeURIComponent(
          email
        )}&sent=${emailSent}`
      );
    } catch (error) {
      if (error instanceof Error && error.message.includes("redirect")) {
        throw error; // Re-throw redirect errors
      }
      console.error("Registration error:", error);
      return fail(500, {
        error: "Internal server error",
      });
    }
  },
};
