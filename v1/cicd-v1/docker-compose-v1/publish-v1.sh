# !/bin/sh

set -e

DOCKER_REGISTRY_NAME=${1-}
DOCKER_REGISTRY_USERNAME=${2-}
DOCKER_REGISTRY_PASSWORD=${3-}

if [ ! -z $DOCKER_REGISTRY_NAME ]
then
	if [ -z $DOCKER_REGISTRY_USERNAME ]
	then
		echo "arg 2: Registry username is missing"
		exit 1
	fi

	if [ -z $DOCKER_REGISTRY_PASSWORD ]
	then
		echo "arg 3: Registry password is missing"
		exit 1
	fi

	echo $DOCKER_REGISTRY_PASSWORD | docker login \
		--password-stdin \
		--username $DOCKER_REGISTRY_USERNAME \
		$DOCKER_REGISTRY_NAME
fi

docker-compose build

docker-compose push
