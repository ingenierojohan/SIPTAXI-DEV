// Coleccion para los Ingresos de Llamadas al Sistema SIPTAXI
SiptaxiCalls = new Meteor.Collection('siptaxiCalls');

/*****************************************************************************************
MAPA de la Coleccion
------------------------------------------------------------------------------------------
id : "string"	--->	id del documento
agentId : "string"	---> Id del Agente que contesto la LLamada
agentName : "string"	---> Nombre del Agente Que Contesto la LLamada
agentExten : "int32"	---> Extension de donde se contesto la Llamada

asteriskChannel : "string"	---> Nombre del Canal por donde Ingreso la LLamada
asteriskUniqueId : "string"	---> Id de la llamada En Asterisk
phone : "int32"	--->	Numero de telefono

timestampIncoming : "timestamp"	--->	hora y Fecha de Ingreso de la Llamada
timestampHangup : "timestamp"	--->	hora y Fecha de Colgado de la Llamada

wasAnswer : "bolean"	---> True si la Llamada Fue Contestada
------------------------------------------------------------------------------------------
******************************************************************************************/



/*****************************************************************************************
METODOS ASOCIADOS A LA COLECCION
------------------------------------------------------------------------------------------
******************************************************************************************/

Meteor.methods({
	// INSERTAR UN NUEVO DOCUMENTO A LA COLECCION
	siptaxiCallsInsertNewCall: function(dataCall){
		var insertCall = SiptaxiCalls.insert(dataCall);
		return insertCall;
	},

	// CONTAR EL NUMERO DE LLAMADAS DEL UN NUMERO TELEFONICO
	siptaxiCallsCount : function (phone){
		var count = SiptaxiCalls.find({phone:phone}).count();
		return count;
	},

	//OBTENER LOS DATOS DE LA ULTIMA LLAMADA DE UN TELEFONO
	siptaxiCallsLast : function (phone) {
		var last = SiptaxiCalls.findOne({ phone : phone },{ sort : {$natural: -1}});
		return last;
	},

	// ACTUALIZAR UN DOCUMENTO SABIENDO EL asteriskUniqueId
	siptaxiCallsUpdate : function (asteriskUniqueId, data){
		return SiptaxiCalls.update({asteriskUniqueId : asteriskUniqueId}, {$set: data});
	},

});