# SYCH.TECH website source

Source code of https://sych.tech website, including build and deploy scripts.

`docker-start.sh`: starts the website in Docker. Configure HTTP port to expose to in `.env`.


`.github/workflows/main_commit.yml`: GitHub actions to build distribution files and deploy to S3. 
Required variables:
- `${{ vars.S3_AWS_DEFAULT_REGION }}`
- `${{ vars.S3_AWS_ACCESS_KEY_ID }}`
- `${{ secrets.S3_AWS_SECRET_ACCESS_KEY }}`
 

- `${{ vars.CF_DISTRIBUTION_ID }}` 
- `${{ vars.WEBSITE_URL }}`

AWS user should have this permissions set:
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "S3UPLOAD",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject*",
                "s3:PutObjectAcl",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::[ S3 BUCKET NAME ]/*",
                "arn:aws:s3:::[ S3 BUCKET NAME ]"
            ]
        },
        {
            "Sid": "CFINVALIDATION",
            "Effect": "Allow",
            "Action": [
                "cloudfront:CreateInvalidation",
                "cloudfront:GetInvalidation"
            ],
            "Resource": "arn:aws:cloudfront::[AWS ACCOUNT ID]:distribution/[CF DISTRIBUTION ID]"
        }
    ]
}
```


# License

You can use parts of this code as long as you give reference (credit) to website: https://sych.tech.  
