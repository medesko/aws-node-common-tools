import { S3, AWSError } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import ReadableStream = NodeJS.ReadableStream;

class S3Storage {
  private s3: S3;
  constructor(s3: S3) {
    this.s3 = s3;
  }

  async put(
    object: ReadableStream,
    objectKey: string,
    bucket: string,
  ): Promise<PromiseResult<S3.PutObjectOutput, AWSError>> {
    const putRequest = {
      Body: object,
      Bucket: bucket,
      Key: objectKey,
    };

    return await this.s3.putObject(putRequest).promise();
  }
}

export { S3Storage };
