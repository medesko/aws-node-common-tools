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

  async putBucketNotification(
    bucket: string,
    notificationConfiguration: S3.NotificationConfiguration,
  ): Promise<PromiseResult<any, AWSError>> {
    const putRequest = {
      Bucket: bucket,
      NotificationConfiguration: notificationConfiguration,
    };

    return await this.s3.putBucketNotificationConfiguration(putRequest).promise();
  }
}

export { S3Storage };
