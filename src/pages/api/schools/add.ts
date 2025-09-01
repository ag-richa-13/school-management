import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "public/schoolImages");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = formidable({
      uploadDir: uploadDir,
      keepExtensions: true,
      multiples: false,
    });

    const {
      fields,
      files,
    }: { fields: formidable.Fields; files: formidable.Files } =
      await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });

    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const address = Array.isArray(fields.address)
      ? fields.address[0]
      : fields.address;
    const city = Array.isArray(fields.city) ? fields.city[0] : fields.city;
    const state = Array.isArray(fields.state) ? fields.state[0] : fields.state;
    const contact = Array.isArray(fields.contact)
      ? fields.contact[0]
      : fields.contact;
    const email_id = Array.isArray(fields.email_id)
      ? fields.email_id[0]
      : fields.email_id;

    // 🔥 Check if school with same name already exists
    const existingSchool = await prisma.schools.findFirst({
      where: {
        name: name || "",
      },
    });

    if (existingSchool) {
      return res.status(400).json({ error: "School already exists!" });
    }

    // Handle file upload
    const uploadedFile = files.image
      ? Array.isArray(files.image)
        ? files.image[0]
        : files.image
      : null;
    const imagePath = uploadedFile
      ? `/schoolImages/${path.basename((uploadedFile as File).filepath)}`
      : "";

    await prisma.schools.create({
      data: {
        name: name || "",
        address: address || "",
        city: city || "",
        state: state || "",
        contact: contact || "",
        email_id: email_id || "",
        image: imagePath,
      },
    });

    return res
      .status(200)
      .json({ success: true, message: "School added successfully!" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Failed to add school" });
  }
}
