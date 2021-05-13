# !/bin/sh

ARG=${1-world}

# * curl https://raw.githubusercontent.com/click-flow/clickflow-packages/main/hello-world.sh | sh -s "Something else"
echo Hello $ARG!
