SIPTAXI-DEV
===========

SIPTAXI Branch dev, Sistema de Registro de Servicios Bases de Taxis


# SIPTAXI --- Sistema de Despacho de Servicios de Taxis 
# Version : 1.0
# Fecha : 2014-08-02
# Desarrollado : Ing Johan Ramirez

#Requiere de Modulos NODE.js
NPM >>> npm install asterisk-manager	--- Libreria para interactuar con Asterisk AMI (Agregar en Packages.json)
								en packages.json
								{
											"asterisk-manager":"0.1.9"
										}

# Require Modulos Menteor Oficiales
meteor add accounts-base			--- Gestion de Usuarios En Meteor
meteor add accounts-password	--- Gestion por medio de Password
meteor add bootstrap			--- Framework css
meteor add email			--- Modulo para enviar Emails

#Requiere Modulos METEOR extraidos desde Atmosphere
mrt add npm					mrt --- Integracion con NPM
///mrt add streams				--- Libreria para Emitir Notificaciones en Meteor (Agragar en smart.json)
mrt add iron-router			--- Modulo para gestionar Rutas en Meteor
mrt add spin				Efecto de Carga de datos spinner
mrt add moment			Manejador de Fechas y Horas
mrt add fast-render
mrt add numeral			Para darle Formato a los Numeros


#Modulos Meteor para Remover
mrt remove insecure 			---- Sincronizacion de colecciones full con el Cliente.
mrt remove autopublish


# Tips
	#Cambiar el Idioma a Moment.js
		cd /root/.meteorite/packages/moment..... agregar en packages.js
		api.add_files('lib/moment/lang/es.js', 'client');


# INICIALIZAR VARIABLE GLOBAL MONGODB
en roo/.bashrc
agregar
# Declarar Variable GLOBAN METEOR - MONGOdb
export MONGO_URL="mongodb://SIPTAXI-admin:siptelco.08@127.0.0.1:27017/SIPTAXI"

# REPARAR MONGO DB
rm /var/lib/mongodb/mongod.lock
service mongodb restart

Crear archivo en /usr/sbin/SIPTAXI-FIXMONGODB.sh
rm /var/lib/mongodb/mongod.lock
service mongodb restart

# AUTO ARRANQUE AL INICIO
agregar en /etc/rc.local
/usr/sbin/SIPTAXI-FIXMONGODB.sh

# EJECUTAR VNC REMOTO
instalar linuxvnc
apt.get install linuxvnc

correr en Puerto 21222
linuxvnc 2 -rfbport 21222

abrir Puertos en router
