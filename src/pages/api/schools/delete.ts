import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing or invalid school ID" });
  }

  try {
    // Find the school first
    const school = await prisma.schools.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!school) {
      return res.status(404).json({ error: "School not found" });
    }

    // Delete the image file if it exists
    if (school.image) {
      const imagePath = path.join(
        process.cwd(),
        "public",
        school.image.replace(/^\/+/, "")
      );
      try {
        await fs.unlink(imagePath);
        console.log(`Deleted image: ${imagePath}`);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.warn(`Failed to delete image: ${imagePath}`, err.message);
        }
        // continue even if image deletion fails
      }
    }

    // Delete the school from the database
    await prisma.schools.delete({
      where: { id: parseInt(id, 10) },
    });

    return res
      .status(200)
      .json({
        success: true,
        message: "School and image deleted successfully!",
      });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Delete API Error:", err.message);
    }
    return res.status(500).json({ error: "Failed to delete school" });
  }
}
