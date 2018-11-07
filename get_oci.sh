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
	private_ips
	ips_by_subnet
and detail in:
	all
	elementId
EOF
)

if [ -z $1 ]; then
	echo $usage 
	exit 1
fi

selector=$2
type_of_element=$1

get_ips()
{
	vnics=$(node get_all_vnicAttachments.js | jq '.[] | {vnic: .vnicId}' | grep vnic | awk '{print $2}' | tr -d '\"')
	for vnic in $vnics; do
		# echo $vnic
		node get_all_privateIps.js $vnic | jq '.[] | {displayName: .displayName, ipAddress: .ipAddress}'
	done
}

ips_by_subnet()
{
	subnets=$(node get_all_subnets.js | jq '.[] | {id: .id}' | grep id | awk '{print $2}' | tr -d '\"')
	for subnet in $subnets; do
		node get_all_privateIps_by_subnet.js $subnet | jq '.[] | {subnetId: .subnetId, hostnameLabel: .hostnameLabel, ipAddress: .ipAddress}'
	done
}

case $type_of_element in
	instances ) node get_instances.js $selector | jq '.';;
	subnets   ) node get_subnets.js $selector | jq '.';;
	routes    ) node get_routes.js $selector | jq '.';;
	seclists  ) node get_seclists.js $selector | jq '.';;
	jcs_instances ) node get_jcsinstances.js $selector | jq '.';;
	dbas_instances ) node get_dbaasinstances.js $selector | jq '.';;
	private_ips ) get_ips;;
	ips_by_subnet ) ips_by_subnet;;
esac

