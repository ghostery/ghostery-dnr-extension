#!/bin/bash
#
# Downloads a snapshot of the requires rules resources (e.g. generated
# block lists, tracker descriptions for the UI). This snapshot
# maybe be outdated, but it will allow building and running the extension.

set -e
set -u
set -o pipefail

# make sure we are in the root directory of the project
cd "${BASH_SOURCE%/*}/.."

mkdir -p bundles
readonly resources=bundles/ghostery-dnr-resources.tar.xz
if ! [[ -e $resources ]]; then
    echo "Downloading resource snapshot..."
    curl --output "$resources" https://s3.amazonaws.com/ghostery.cdn/ghostery-dnr-extension-resources/ghostery-dnr-resources.tar.xz
fi
echo "Extracting resource files..."
(mkdir -p src/rule_resources/ && cd src/rule_resources/ && tar xfJv "../../$resources")
echo
echo "Success. Rule resources were unpacked at: src/rule_resources/"
