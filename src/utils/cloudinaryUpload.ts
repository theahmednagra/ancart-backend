import cloudinary from "../config/cloudinary"

export const uploadToCloudinary = async (buffer: Buffer, folder: string) => {
    return await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        stream.end(buffer);
    });
}