import boto3, os

bucket_name = os.getenv('S3_BUCKET_NAME')
s3_client = boto3.client('s3')
s3_resource = boto3.resource('s3')

def upload_file(file, destination, acl="public-read"):
    s3_client.upload_fileobj(file, bucket_name, destination, ExtraArgs={'ACL':acl})
