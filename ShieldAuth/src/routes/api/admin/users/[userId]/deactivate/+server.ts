import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { sessions } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export const DELETE: RequestHandler = async ({ params, locals }) => {
  // Check if user is authenticated and is admin
  if (!locals.user || locals.user.role !== "admin") {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = params;

  if (!userId) {
    return json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Delete all sessions for the user (this will log them out)
    await db.delete(sessions).where(eq(sessions.userId, userId));

    return json({
      success: true,
      message: "User deactivated successfully",
    });
  } catch (error) {
    console.error("Error deactivating user:", error);
    return json(
      {
        error: "Failed to deactivate user",
      },
      { status: 500 }
    );
  }
};
