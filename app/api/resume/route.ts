import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import config from '@/config';
import { ApiResponse } from '@/lib/apiResponse';
import { CLOUDINARY_CONSTANTS } from '@/lib/constants';

// Configure Cloudinary if keys exist
if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true,
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return ApiResponse.error('No file provided for upload.', 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // If Cloudinary is configured, upload to Cloudinary
    if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
      return new Promise<NextResponse>((resolve) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: CLOUDINARY_CONSTANTS.RESUME_FOLDER,
            resource_type: CLOUDINARY_CONSTANTS.RESOURCE_TYPES.AUTO,
            public_id: `resume_${Date.now()}`,
          },
          (error, result) => {
            if (error || !result) {
              console.warn('Cloudinary upload error:', error);
              // Fallback to base64 data URL
              const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
              resolve(ApiResponse.success({ url: base64, source: 'base64_fallback' }));
            } else {
              resolve(
                ApiResponse.success({
                  url: result.secure_url,
                  publicId: result.public_id,
                  source: 'cloudinary',
                })
              );
            }
          }
        );
        uploadStream.end(buffer);
      });
    }

    // Local Base64 fallback if Cloudinary is not configured
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
    return ApiResponse.success({ url: base64, source: 'base64_fallback' });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Resume upload error:', err);
    return ApiResponse.serverError(err.message || 'Failed to upload resume.');
  }
}

export async function DELETE(request: Request) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return ApiResponse.error('Public ID is required to delete Cloudinary asset.', 400);
    }

    if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
      await cloudinary.uploader.destroy(publicId, { resource_type: CLOUDINARY_CONSTANTS.RESOURCE_TYPES.RAW });
    }

    return ApiResponse.success(null, 'Resume file deleted successfully.');
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Resume delete error:', err);
    return ApiResponse.serverError(err.message || 'Failed to delete resume.');
  }
}
