"""Custom S3 storage backends to store files in subfolders."""
from storages.backends.s3boto import S3BotoStorage

class MediaS3BotoStorage(S3BotoStorage):
    location = 'media'
