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
    throw redirect(303, "/");
  }

  return {};
};

export const actions: Actions = {
  default: async ({ request }) => {
    try {
      console.log("Registration action started");
      const data = await request.formData();
      const name = data.get("name") as string;
      const email = data.get("email") as string;
      const password = data.get("password") as string;
      const confirmPassword = data.get("confirmPassword") as string;

      console.log("Form data received:", {
        name,
        email,
        password: password ? "***" : "missing",
      });

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
      console.log("Hashing password...");
      const hashedPassword = await bcrypt.hash(password, 12);
      console.log("Password hashed successfully");

      // Create user with proper ID format
      console.log("Creating user in database...");
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
      console.log("User created successfully:", newUser[0].id);

      // Send email verification
      let emailSent = false;
      try {
        console.log("Attempting to send email verification...");
        emailSent = await TokenService.sendEmailVerification(
          newUser[0].id,
          newUser[0].email,
          newUser[0].name || "User"
        );
        console.log("Email verification result:", emailSent);
      } catch (emailError) {
        console.error("Email verification error:", emailError);
        console.error("Email error details:", emailError.message);
        // Don't fail registration if email fails, but still redirect to check email page
        emailSent = false;
      }

      // Return success with redirect info
      const redirectUrl = `/checks/check-email?context=registration&email=${encodeURIComponent(
        email
      )}&sent=${emailSent}`;

      return {
        success: true,
        message: "Registration successful! Redirecting to check your email...",
        redirectUrl: redirectUrl,
        emailSent: emailSent,
      };
    } catch (error) {
      // Check if this is a redirect (which is expected behavior)
      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 303
      ) {
        throw error; // Re-throw redirects - they are not errors
      }

      console.error("Registration error:", error);
      return fail(500, {
        error: "Internal server error",
      });
    }
  },
};
