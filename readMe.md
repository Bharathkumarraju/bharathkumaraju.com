# [bharathkumaraju.com](https://bharathkumaraju.com)
BharathKumarRaju's Official Website

This repository contains all source code and files for the Website bharathkumaraju.com.
It is hosted in AWS S3 as a static website and SSL with AWS Certificate Manager(ACM) with CloudFront Distribution.
Feel free to check it and drop me a line if you notice any bug or issue, will do PR and fix :) 
```
See my CV in below link as well.
```
## [bharathkumaraju.com/resume.pdf](https://bharathkumaraju.com/resume.pdf)

### cache invalidation 

```
bharathkumardasaraju@bharathkumaraju.com$ aws cloudfront create-invalidation --distribution-id=E1YYMBUH8BLLGN --paths / --region us-east-1
{
    "Location": "https://cloudfront.amazonaws.com/2020-05-31/distribution/E1YYMBUH8BLLGN/invalidation/IAR2ACYCIPWH0DDE0HPV88OQPF",
    "Invalidation": {
        "Id": "IAR2ACYCIPWH0DDE0HPV88OQPF",
        "Status": "InProgress",
        "CreateTime": "2025-11-26T18:12:51.567000+00:00",
        "InvalidationBatch": {
            "Paths": {
                "Quantity": 1,
                "Items": [
                    "/"
                ]
            },
            "CallerReference": "cli-1764180770-920817"
        }
    }
}
bharathkumardasaraju@bharathkumaraju.com$ aws cloudfront create-invalidation --distribution-id=E1YYMBUH8BLLGN --paths /resume.pdf --region us-east-1
{
    "Location": "https://cloudfront.amazonaws.com/2020-05-31/distribution/E1YYMBUH8BLLGN/invalidation/I4XIAK965HJGH0ON9MU6TCWE5J",
    "Invalidation": {
        "Id": "I4XIAK965HJGH0ON9MU6TCWE5J",
        "Status": "InProgress",
        "CreateTime": "2025-11-26T18:13:02.288000+00:00",
        "InvalidationBatch": {
            "Paths": {
                "Quantity": 1,
                "Items": [
                    "/resume.pdf"
                ]
            },
            "CallerReference": "cli-1764180781-107667"
        }
    }
}
bharathkumardasaraju@bharathkumaraju.com$

```
