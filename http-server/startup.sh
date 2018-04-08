#!/bin/bash
TEMPLATE_PATH=/etc/nginx/conf.d/default.conf.template
CONF_PATH=/etc/nginx/conf.d/default.conf
envsubst < ${TEMPLATE_PATH} > ${CONF_PATH}
nginx -g 'daemon off;'
