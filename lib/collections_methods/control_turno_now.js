// Coleccion para almacer el Control de Turno ACTUAL
ControlTurnoNow = new Meteor.Collection('controlTurnoNow');

/*****************************************************************************************
MAPA de la Coleccion
------------------------------------------------------------------------------------------
id : "string"	--->	id del documento
fecha : "string"	--->	Dia y Fecha Correspondiente a la Plantilla de Control
nro : "int"		---> Numero de la Plantilla
movilData : Objeto Con la Info de Cada Movil
		{
			nroTurno : "int" ---> Numero del Turno en el Dia
			movil : "string" ---> Numero del Movil
			Placa : "string" 	---> Placa del Movil
			isResting : Bolean	---> T/F si esta descansando
			isSuspended : Bolean	---> T/F si esta Suspendido
			suspendedReason : "string" ---> Razon de la suspencion
			TimeIni : "timestamp"	---> Hora y Fecha de Inicio de Turno
			TimeTer : "tiemstamp" ---> Hora y Fecha de Finalizacion de Turno
			vueltas : Array de Objetos 	--> Info de Cada Vuelta  cada item del array es el Nro de Vuelta
				[
					{
						nro : "int"		--> Nuemro de la Vuelta
						status : "string"	---> Aceptado, Rechazado
						time : "timestamp" ---> Hora y Fecha del status
					}
				]
			isActive : Bolean ---> T/F indica si esta disponible para recibir Servicios
			isNext : Bolean ---> T/F Indica si es el Siguiente en la Lista
		}


------------------------------------------------------------------------------------------
******************************************************************************************/

Meteor.methods({

});