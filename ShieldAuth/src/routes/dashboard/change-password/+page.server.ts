import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { TokenService } from "$lib/server/tokens";

export const load: PageServerLoad = async ({ locals }) => {
  // Redirect if not authenticated
  if (!locals.auth?.user) {
    throw redirect(303, "/login");
  }

  return {
    user: locals.auth.user,
  };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    try {
      // Check if user is authenticated
      if (!locals.auth?.user) {
        return fail(401, {
          error: "Authentication required",
        });
      }

      const data = await request.formData();
      const email = data.get("email") as string;

      if (!email) {
        return fail(400, {
          error: "Email is required",
        });
      }

      // Find user by email
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user) {
        return fail(404, {
          error: "User not found",
        });
      }

      // Verify the email matches the authenticated user
      if (user.id !== locals.auth.user.id) {
        return fail(403, {
          error: "Email does not match your account",
        });
      }

      // Send password reset email
      const emailSent = await TokenService.sendPasswordReset(
        user.id,
        user.email,
        user.name || "User"
      );

      if (!emailSent) {
        return fail(500, {
          error: "Failed to send password reset email",
        });
      }

      // Redirect to check email page
      throw redirect(
        303,
        `/auth/check-email?context=password-change&email=${encodeURIComponent(
          email
        )}&sent=${emailSent}`
      );
    } catch (error) {
      if (error instanceof Error && error.message.includes("redirect")) {
        throw error; // Re-throw redirect errors
      }
      console.error("Request password change error:", error);
      return fail(500, {
        error: "Internal server error",
      });
    }
  },
};
