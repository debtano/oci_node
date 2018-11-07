#!/bin/bash
#
# Node scripts selector
# Based on arg 1 ....
if [ -z $1 ]; then
	echo 'usage: get_oci.sh type_of_element all|elementID'
	exit 1
fi

if [ -z $2 ]; then
	echo 'usage: get_oci.sh type_of_element all|elementID'
	exit 1
else
	selector=$2
fi

type_of_element=$1

case $type_of_element in
	instances ) node get_instances.js $selector | jq '.';;
	otro ) echo "no selection"
esac