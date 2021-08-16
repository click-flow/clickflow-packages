# !/bin/sh

set -e

SOURCE_DIRECTORY=$1
SOURCE_VERSION=$2
TERRAFORM_BACKEND_AWS_ACCESS_KEY_ID=$3
TERRAFORM_BACKEND_AWS_DEFAULT_REGION=$4
TERRAFORM_BACKEND_AWS_PROFILE=$5
TERRAFORM_BACKEND_AWS_SECRET_ACCESS_KEY=$6
TERRAFORM_VERSION=$7

TERRAFORM_IMAGE=ghcr.io/click-flow/docker-images/terraform:v${TERRAFORM_VERSION}-alpine

docker pull --quiet $TERRAFORM_IMAGE

docker run \
	--env AWS_ACCESS_KEY_ID=$TERRAFORM_BACKEND_AWS_ACCESS_KEY_ID \
	--env AWS_DEFAULT_REGION=$TERRAFORM_BACKEND_AWS_DEFAULT_REGION \
	--env AWS_PROFILE=$TERRAFORM_BACKEND_AWS_PROFILE \
	--env AWS_SECRET_ACCESS_KEY=$TERRAFORM_BACKEND_AWS_SECRET_ACCESS_KEY \
	--env TF_VAR_VERSION=$SOURCE_VERSION \
	--rm \
	--volume $SOURCE_DIRECTORY:/app \
	--volume /var/run/docker.sock:/var/run/docker.sock \
	$TERRAFORM_IMAGE \
	sh -c "
		rm -rf ./.terraform
		terraform init
		terraform destroy -auto-approve -lock-timeout=1200s
	"

