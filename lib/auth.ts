import jwt from "jsonwebtoken";

export function verifyToken(token: string | undefined) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    return decoded.userId;
  } catch {
    return null;
  }
}