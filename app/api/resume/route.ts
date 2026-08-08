import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import config from '@/config';
import { ApiResponse } from '@/lib/apiResponse';
import { CLOUDINARY_CONSTANTS, DATABASE_CONSTANTS } from '@/lib/constants';

// Configure Cloudinary if keys exist
if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true,
  });
}

function getLocalResumePaths() {
  const storageDir = path.join(process.cwd(), DATABASE_CONSTANTS.STORAGE_DIR);
  const localPath = path.join(storageDir, 'resume.pdf');
  const tmpPath = path.join('/tmp', 'resume.pdf');
  return { storageDir, localPath, tmpPath };
}

export async function GET() {
  const { localPath, tmpPath } = getLocalResumePaths();

  let targetPath: string | null = null;
  if (fs.existsSync(localPath)) {
    targetPath = localPath;
  } else if (fs.existsSync(tmpPath)) {
    targetPath = tmpPath;
  }

  if (targetPath) {
    try {
      const fileBuffer = fs.readFileSync(targetPath);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="Resume.pdf"',
          'Cache-Control': 'public, max-age=3600, must-revalidate',
        },
      });
    } catch (err) {
      console.error('Error reading local resume file:', err);
    }
  }

  return ApiResponse.error('Resume document not found.', 404);
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
            format: 'pdf',
          },
          (error, result) => {
            if (error || !result) {
              console.warn('Cloudinary upload error, falling back to local file storage:', error);
              saveFileLocally(buffer);
              resolve(ApiResponse.success({ url: '/api/resume', source: 'local_storage' }));
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

    // Save locally and serve via /api/resume
    saveFileLocally(buffer);
    return ApiResponse.success({ url: '/api/resume', source: 'local_storage' });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Resume upload error:', err);
    return ApiResponse.serverError(err.message || 'Failed to upload resume.');
  }
}

function saveFileLocally(buffer: Buffer) {
  const { storageDir, localPath, tmpPath } = getLocalResumePaths();

  try {
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }
    fs.writeFileSync(localPath, buffer);
  } catch {
    try {
      const tmpDir = path.dirname(tmpPath);
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      fs.writeFileSync(tmpPath, buffer);
    } catch (tmpErr) {
      console.warn('Failed to save resume buffer to local filesystem:', tmpErr);
    }
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const publicId = body.publicId;

    if (publicId && config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
      await cloudinary.uploader.destroy(publicId, { resource_type: CLOUDINARY_CONSTANTS.RESOURCE_TYPES.RAW });
    }

    const { localPath, tmpPath } = getLocalResumePaths();
    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);

    return ApiResponse.success(null, 'Resume file deleted successfully.');
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Resume delete error:', err);
    return ApiResponse.serverError(err.message || 'Failed to delete resume.');
  }
}
