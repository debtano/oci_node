#!/bin/bash
#
# Node scripts selector
# Based on arg 1 ....

usage=$(cat <<EOF
get_oci.sh type_of_element detail
where :
type_of_element in :
	instances
	subnets
	routes
	seclists
	jcs_instances
	dbas_instances
and detail in:
	all
	elementId
EOF
)

if [ -z $1 ]; then
	echo $usage 
	exit 1
fi

if [ -z $2 ]; then
	echo $usage
	exit 1
else
	selector=$2
fi

type_of_element=$1

case $type_of_element in
	instances ) node get_instances.js $selector | jq '.';;
	subnets   ) node get_subnets.js $selector | jq '.';;
	routes    ) node get_routes.js $selector | jq '.';;
	seclists  ) node get_seclists.js $selector | jq '.';;
	jcs_instances ) node get_jcsinstances.js $selector | jq '.';;
	dbas_instances ) node get_dbaasinstances.js $selector | jq '.';;
esac