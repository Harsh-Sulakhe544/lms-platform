import { generateComponents } from "@uploadthing/react";
 
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// by default upload-button will use our ourFileRouter -- whatever we defined courseid , cahpterVideo
export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>();