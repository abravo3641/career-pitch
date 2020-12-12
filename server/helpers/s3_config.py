import boto3, os
from boto3.s3.transfer import TransferConfig

bucket_name = os.getenv('S3_BUCKET_NAME')
s3_client = boto3.client('s3')
s3_resource = boto3.resource('s3')

def upload_file(file, destination, acl="public-read", video=False):
    if video:
        config = TransferConfig(multipart_threshold=1024*5, max_concurrency=10, multipart_chunksize=1024*5, use_threads=True)
        s3_client.upload_fileobj(file, bucket_name, destination, 
        ExtraArgs={'ACL':acl, 'ContentType': 'video/mp4'},
        Config = config
        )
    else:
        s3_client.upload_fileobj(file, bucket_name, destination, ExtraArgs={'ACL':acl})