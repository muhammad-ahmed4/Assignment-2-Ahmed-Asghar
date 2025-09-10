import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { db } from "$lib/server/db.js";
import { users } from "$lib/server/db/schema.js";
import { desc, eq, like, or, and, count } from "drizzle-orm";

export const load: PageServerLoad = async ({ locals, url }) => {
  // Check if user is authenticated and is admin
  if (!locals.user) {
    throw redirect(302, "/login");
  }

  if (locals.user.role !== "admin") {
    throw redirect(302, "/dashboard");
  }

  try {
    const search = url.searchParams.get("search") || "";
    const role = url.searchParams.get("role") || "";
    const status = url.searchParams.get("status") || "";

    // Build query conditions
    let conditions = [];

    if (search) {
      conditions.push(
        or(like(users.name, `%${search}%`), like(users.email, `%${search}%`))
      );
    }

    if (role) {
      conditions.push(eq(users.role, role));
    }

    if (status) {
      conditions.push(eq(users.isActive, status === "active"));
    }

    // Get all users with filters
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        isActive: users.isActive,
      })
      .from(users)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(users.createdAt));

    // Get user counts by role
    const userCounts = await db
      .select({
        role: users.role,
        count: count(),
      })
      .from(users)
      .groupBy(users.role);

    return {
      user: locals.user,
      users: allUsers,
      userCounts,
      filters: { search, role, status },
    };
  } catch (error) {
    console.error("Admin users page error:", error);
    throw redirect(302, "/admin");
  }
};
