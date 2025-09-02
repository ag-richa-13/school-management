// src/pages/api/schools/edit.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    const data = req.body;

    if (!id) return res.status(400).json({ error: "School ID is required" });

    const schoolId = Number(id); // 🔥 Convert to number

    const updatedSchool = await prisma.schools.update({
      where: { id: schoolId }, // ✅ Prisma expects a number here
      data,
    });

    return res.status(200).json(updatedSchool);
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ error: "Failed to update school" });
  }
}
