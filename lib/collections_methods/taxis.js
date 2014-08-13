// Coleccion de los Taxis
Taxis = new Meteor.Collection('taxis');

/*****************************************************************************************
MAPA de la Coleccion
------------------------------------------------------------------------------------------
id : "string"	--->	id del documento
createdAt : "timestamp"	--->	Hora y Fecha de  Creacion del Documeto
contac : "string"	--->	"celular o Direccion del Taxista"
drivers : "array"	--->	conductores del Taxi
features : "string"	-->	Caracteristicas del Taxi, con Maleta, etc
marca : "string"	--->	Marca del Taxi
movil : "string"	--->	Numero del Movil
ower : "string"	---> Dueño del Taxi
placa : "string"	---> Placa del Taxi
status : "int32"
	0 = habilitado
	1 = suspendido
descansar : "bolean"	---> Si el Movil esta en Descanso
tipo: "string"	--->	Tipo de movil[individual - colectivo]
------------------------------------------------------------------------------------------
******************************************************************************************/