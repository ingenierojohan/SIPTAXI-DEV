#!/bin/bash
# Para usar la DB mongo Principal
# EJECUTAR como ( . ./start.sh )



#rm /var/lib/mongodb/mongod.lock
#service mongodb restart

#export MONGO_URL='mongodb://SIPTAXI-admin:siptelco.08@127.0.0.1:27017/SIPTAXI?autoReconnect=true&connectTimeout=60000'
echo "MONGO_URL='mongodb://SIPTAXI-admin:siptelco.08@127.0.0.1:27017/SIPTAXI-DEV'"
export MONGO_URL="mongodb://SIPTAXI-admin:siptelco.08@127.0.0.1:27017/SIPTAXI-DEV"

echo "PUERTO: 3001  --- PORT=3001"
export PORT=3001
meteor
