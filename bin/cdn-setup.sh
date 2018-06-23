#!/bin/bash

# This script creates Amazon CloudFront distributions (CDN) for development and
# production environments.

# Creates distribution.
create() {
  aws configure set aws_access_key_id $1
  aws configure set aws_secret_access_key $2
  aws configure set preview.cloudfront true
  aws cloudfront create-distribution --distribution-config file://$PWD/config/aws/$3
}

# echo "Development public CDN distribution"
# create $DEV_AWS_ACCESS_KEY_ID $DEV_AWS_SECRET_ACCESS_KEY cloudfront-public-distribution-dev.json

# echo "Producton public CDN distribution"
# create $PROD_AWS_ACCESS_KEY_ID $PROD_AWS_SECRET_ACCESS_KEY cloudfront-public-distribution-prod.json

# Updates distribution
update() {
  aws configure set aws_access_key_id $1
  aws configure set aws_secret_access_key $2
  aws configure set preview.cloudfront true
  aws cloudfront update-distribution --distribution-config file://$PWD/config/aws/$3 --id $4
}

update $DEV_AWS_ACCESS_KEY_ID $DEV_AWS_SECRET_ACCESS_KEY cloudfront-public-distribution-dev.json E1N7Y5O368XHVT
update $PROD_AWS_ACCESS_KEY_ID $PROD_AWS_SECRET_ACCESS_KEY cloudfront-public-distribution-prdo.json EKD44KXC98KGN

# Invalidates some of the cached stuff
invalidate() {
  aws configure set aws_access_key_id $1
  aws configure set aws_secret_access_key $2
  aws configure set preview.cloudfront true
  aws cloudfront create-invalidation --distribution-id $3 --paths "/static-assets/*"
}

# invalidate $DEV_AWS_ACCESS_KEY_ID $DEV_AWS_SECRET_ACCESS_KEY E1N7Y5O368XHVT
# invalidate $PROD_AWS_ACCESS_KEY_ID $PROD_AWS_SECRET_ACCESS_KEY EKD44KXC98KGN
