import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_KEY in environment variables"
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadProgressPhoto(file) {
  if (!file) {
    throw new Error("No file provided");
  }

  const fileExt = file.originalname.split(".").pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const bucketName = process.env.SUPABASE_BUCKET_PHOTOS;

  if (!bucketName) {
    throw new Error("SUPABASE_BUCKET_PHOTOS not configured in environment");
  }

  console.log(`Uploading to bucket: ${bucketName}, file: ${fileName}`);

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      throw error;
    }

    console.log("Upload successful:", data);

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    console.log("Public URL:", publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Upload exception:", error);
    throw error;
  }
}

export default { uploadProgressPhoto };
