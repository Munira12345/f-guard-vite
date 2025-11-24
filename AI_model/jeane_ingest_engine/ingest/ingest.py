"""
Simple ingest worker:
- download from URL (public) or copy from S3
- verify checksum (optional)
- write local copy and register metadata
"""
import os
import hashlib
import logging
import requests
import boto3
import yaml
from urllib.parse import urlparse
from storage.s3_client import S3Client
from storage.metadata_db import MetadataDB


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('ingest')


with open('config.yml') as f:
    CFG = yaml.safe_load(f)


s3 = S3Client(CFG['s3'])
meta_db = MetadataDB(CFG['postgres'])




def compute_md5(path, block_size=2**20):
    h = hashlib.md5()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(block_size), b''):
            h.update(chunk)
        return h.hexdigest()




def download_url(url, out_dir='data/raw'):
    os.makedirs(out_dir, exist_ok=True)
    parsed = urlparse(url)
    name = os.path.basename(parsed.path)
    out_path = os.path.join(out_dir, name)
    logger.info(f"Downloading {url} -> {out_path}")
    r = requests.get(url, stream=True, timeout=60)
    r.raise_for_status()
    with open(out_path, 'wb') as f:
        for chunk in r.iter_content(1024*1024):
            if chunk:
                f.write(chunk)
    return out_path




def ingest_from_url(url, source='public', checksum=None):
    path = download_url(url)
    md5 = compute_md5(path)
    if checksum and md5 != checksum:
        logger.error('Checksum mismatch')
        os.remove(path)
        raise ValueError('Checksum mismatch')
# upload to S3
    key = f"{CFG['s3']['prefix']}raw/{os.path.basename(path)}"
    s3.upload_file(path, key)
    meta = {
        'source': source,
        'original_path': url,
        's3_key': key,
        'md5': md5
    }
    meta_db.insert_file(meta)
    logger.info('Ingest complete')
    return meta




if __name__ == '__main__':
    import sys
    if len(sys.argv) < 2:
        print('Usage: python ingest.py <url> [<checksum>]')
        sys.exit(1)
    url = sys.argv[1]
    checksum = sys.argv[2] if len(sys.argv) > 2 else None
    print(ingest_from_url(url, checksum=checksum))