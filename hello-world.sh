# !/bin/sh

ARG=$1

# * curl https://raw.githubusercontent.com/click-flow/clickflow-packages/main/hello-world.sh | sh
echo Hello ${ARG-world}!
