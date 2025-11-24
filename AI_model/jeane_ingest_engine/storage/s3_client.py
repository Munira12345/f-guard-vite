import boto3
import logging


logger = logging.getLogger('s3')


class S3Client:
    def __init__(self, cfg):
        self.bucket = cfg['bucket']
        session = boto3.session.Session(
            aws_access_key_id=cfg.get('aws_access_key_id'),
            aws_secret_access_key=cfg.get('aws_secret_access_key'),
            region_name=cfg.get('region')
            )
        self.s3 = session.client('s3')


def upload_file(self, local_path, key):
    logger.info(f"Uploading {local_path} to s3://{self.bucket}/{key}")
    self.s3.upload_file(local_path, self.bucket, key)


def download_file(self, key, local_path):
    logger.info(f"Downloading s3://{self.bucket}/{key} -> {local_path}")
    self.s3.download_file(self.bucket, key, local_path)


def exists(self, key):
    try:
        self.s3.head_object(Bucket=self.bucket, Key=key)
        return True
    except Exception:
        return False