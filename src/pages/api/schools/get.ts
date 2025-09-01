import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const schools = await prisma.schools.findMany();
    return res.status(200).json(schools); // ✅ Return array
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Failed to fetch schools" });
  }
}
