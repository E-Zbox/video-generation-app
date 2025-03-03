import cloudinary from "@/config/cloudinary";
// .
import { IUploadToCloudinaryResponse } from "./interface";
// uploadFiles
import { rootUploadDir } from "@/middlewares/uploadFiles";

export const uploadToCloudinary = async (
  filePath: string,
  folder: string = "video/trimmed"
): Promise<IUploadToCloudinaryResponse> => {
  let response: IUploadToCloudinaryResponse = {
    data: {
      mimetype: "",
      path: "",
      publicId: "",
    },
    error: "",
    success: true,
  };

  try {
    const {
      format,
      public_id: publicId,
      resource_type,
      secure_url: path,
    } = await cloudinary.uploader.upload(filePath, {
      folder: `${rootUploadDir}/${folder}`,
      public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
      resource_type: "auto",
    });

    const mimetype = `${resource_type}/${format}`;

    response = {
      data: {
        mimetype,
        path,
        publicId,
      },
      error: "",
      success: true,
    };
  } catch (error) {
    response = {
      ...response,
      error: `${error}`,
    };
  } finally {
    return response;
  }
};
