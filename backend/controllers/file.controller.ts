import { RequestHandler } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { UploadedFile } from "express-fileupload";
import { client } from "../utils/r2";

const BUCKET = process.env.R2_BUCKET!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!;

export const uploadFile: RequestHandler = async (req: any, res) => {
  try {
    const raw = req.files?.file;
    const file: UploadedFile = Array.isArray(raw) ? raw[0] : raw;
    if (!file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    const ext = file.mimetype.split("/")[1];
    const key = `notes/${Date.now()}.${ext}`;

    await client.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: file.data,
        ContentType: file.mimetype,
      })
    );

    return res.status(201).json({
      success: true,
      url: `${PUBLIC_URL}/${key}`,
      key,
    });
  } catch (e: any) {
    console.error("[uploadFile] R2 error:", e?.message ?? e);
    return res.status(500).json({ success: false, message: e?.message ?? "Upload failed" });
  }
};
