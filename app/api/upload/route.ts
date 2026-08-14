import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import config from '@/config';
import { logger } from '@/lib/logger';

if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true,
  });
} else if (config.cloudinary.url) {
  cloudinary.config(config.cloudinary.url);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'image/png';
    const base64Data = `data:${mimeType};base64,${buffer.toString('base64')}`;

    if (config.cloudinary.isConfigured) {
      try {
        const uploadResult = await cloudinary.uploader.upload(base64Data, {
          folder: 'my_neobrutalist_portfolio',
          resource_type: 'auto',
        });

        return NextResponse.json({
          success: true,
          url: uploadResult.secure_url,
          provider: 'cloudinary',
          public_id: uploadResult.public_id,
        });
      } catch (cloudinaryErr) {
        logger.warn('Cloudinary upload error, falling back to base64 data URL:', cloudinaryErr);
      }
    }

    return NextResponse.json({
      success: true,
      url: base64Data,
      provider: 'base64_fallback',
      fileName: file.name,
      size: file.size,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to process image upload' },
      { status: 500 }
    );
  }
}
