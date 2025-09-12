import { db } from "./db";
import { verificationTokens } from "./db/schema";
import { eq, and, gt, lt } from "drizzle-orm";
import { EmailService } from "./email";

export type TokenType = "email_verification" | "password_reset";

export class TokenService {
  static async createToken(
    userId: string,
    email: string,
    type: TokenType,
    expiresInHours: number = 24
  ): Promise<string> {
    // Clean up any existing tokens of the same type for this user
    await this.cleanupExpiredTokens(userId, type);

    const token =
      type === "email_verification"
        ? EmailService.generateVerificationToken()
        : EmailService.generatePasswordResetToken();

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    console.log("Creating token:", {
      userId,
      email,
      type,
      token: token.substring(0, 10) + "...",
      expiresAt,
    });

    await db.insert(verificationTokens).values({
      identifier: email,
      token,
      expires: expiresAt,
      type,
      userId,
    });

    console.log("Token created successfully");
    return token;
  }

  static async validateToken(
    token: string,
    type: TokenType
  ): Promise<{
    valid: boolean;
    userId?: string;
    email?: string;
  }> {
    try {
      console.log("Validating token:", {
        token: token.substring(0, 10) + "...",
        type,
      });

      const tokenRecord = await db.query.verificationTokens.findFirst({
        where: and(
          eq(verificationTokens.token, token),
          eq(verificationTokens.type, type),
          gt(verificationTokens.expires, new Date())
        ),
      });

      console.log("Token record found:", tokenRecord ? "Yes" : "No");

      if (!tokenRecord) {
        return { valid: false };
      }

      return {
        valid: true,
        userId: tokenRecord.userId,
        email: tokenRecord.identifier,
      };
    } catch (error) {
      console.error("Error validating token:", error);
      return { valid: false };
    }
  }

  static async consumeToken(
    token: string,
    type: TokenType
  ): Promise<{
    success: boolean;
    userId?: string;
    email?: string;
  }> {
    const validation = await this.validateToken(token, type);

    if (!validation.valid) {
      return { success: false };
    }

    try {
      // Delete the token after successful validation
      await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.token, token));

      return {
        success: true,
        userId: validation.userId,
        email: validation.email,
      };
    } catch (error) {
      console.error("Error consuming token:", error);
      return { success: false };
    }
  }

  static async cleanupExpiredTokens(
    userId?: string,
    type?: TokenType
  ): Promise<void> {
    try {
      const conditions = [lt(verificationTokens.expires, new Date())];

      if (userId) {
        conditions.push(eq(verificationTokens.userId, userId));
      }

      if (type) {
        conditions.push(eq(verificationTokens.type, type));
      }

      await db.delete(verificationTokens).where(and(...conditions));
    } catch (error) {
      console.error("Error cleaning up expired tokens:", error);
    }
  }

  static async sendEmailVerification(
    userId: string,
    email: string,
    name: string,
    context: string = "registration"
  ): Promise<boolean> {
    try {
      const token = await this.createToken(
        userId,
        email,
        "email_verification",
        24
      );
      return await EmailService.sendEmailVerification(
        email,
        name,
        token,
        context
      );
    } catch (error) {
      console.error("Error sending email verification:", error);
      return false;
    }
  }

  static async sendPasswordReset(
    userId: string,
    email: string,
    name: string
  ): Promise<boolean> {
    try {
      const token = await this.createToken(userId, email, "password_reset", 1); // 1 hour expiry
      return await EmailService.sendPasswordReset(email, name, token);
    } catch (error) {
      console.error("Error sending password reset:", error);
      return false;
    }
  }
}
