import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export class R2Storage {
  private client: S3Client;
  private bucket: string = process.env.R2_BUCKET_NAME!;

  constructor() {
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_ACCESS_KEY_SECRET!,
      },
    });
  }

  async uploadAudio(file: Buffer | Blob, folder: string, filename: string, contentType = 'audio/mpeg') {
    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: `${folder}/${filename}`,
          Body: file,
          ContentType: contentType,
        })
      );
    } catch (error) {
      console.error('Error uploading audio file:', error);
      throw new Error('Failed to upload audio file', { cause: error });
    }
  }
}
