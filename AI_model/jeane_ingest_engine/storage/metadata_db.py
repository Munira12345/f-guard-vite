from sqlalchemy import create_engine, Table, Column, Integer, String, MetaData, JSON, DateTime
from sqlalchemy.dialects.postgresql import JSONB
import datetime


class MetadataDB:
    def __init__(self, cfg):
        user = cfg['user']
        pw = cfg['password']
        host = cfg['host']
        port = cfg['port']
        db = cfg['database']
        url = f"postgresql://{user}:{pw}@{host}:{port}/{db}"
        self.engine = create_engine(url)
        self.metadata = MetaData()
        self.files = Table('files', self.metadata,
                            Column('id', Integer, primary_key=True),
                            Column('s3_key', String, nullable=False),
                            Column('source', String),
                            Column('original_path', String),
                            Column('md5', String),
                            Column('metadata', JSONB),
                            Column('created_at', DateTime, default=datetime.datetime.utcnow))
        self.metadata.create_all(self.engine)


def insert_file(self, meta: dict):
    meta_row = {
        's3_key': meta['s3_key'],
        'source': meta.get('source'),
        'original_path': meta.get('original_path'),
        'md5': meta.get('md5'),
        'metadata': meta
    }

    ins = self.files.insert().values(**meta_row)
    with self.engine.begin() as conn:
        conn.execute(ins)