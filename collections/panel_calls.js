// Coleccion temporal del panel de Llamadas
PanelCalls = new Meteor.Collection('panelCalls');


/*****************************************************************************************
MAPA de la Coleccion
------------------------------------------------------------------------------------------
_id : "string"	---> Id del Documento

agentExten : "int32"	--->	Numero de la Extension que Contesto la LLamada, Null cuando no han contestando

customerAddress : "string"	--->	Direccion del Cliente, en Blanco Si no Exite
customerAddressReference : "string"	--->	Referencia de la Direccion del Cliente
customerComments : "string"	--->	Comentarios del Cliente
customerId : "string"	--->	Id del Documento del Clinte
customerName : "string"	--->	Nombre del Cliente
customerPhone : "int32"	--->	Telefono del Cliente
customerCod : "int32"	--->	Codigo del Cliente

isNewCustomer : "bolean"	---> True si existe el Cliente, false y no Existe
isRecall : "bolean"	---> True Cuando a Llamado antes de 10 minutos despues de la Ultima Llamada

servicesLast : "object"	--->	Objeto con La Info de los 2 Ultimos Servicios del Cliente

siptaxiCallAsteriskUniqueId : "string"	---> Id de la Llamada en Asterisk
siptaxiCallCount : "int32"	--->	Numero de Llamadas que ha Realizado el Cliente
siptaxiCallId : "string"	---> Id de la Llamada
siptaxiCallLast : "object"	--->	Objeto con TODA la Info del ultima LLamada.

state : "int32"	---> Estado de la LLamada en El Panel
	0 = Colgado
	4 = Timbrando
	6 = Hablando

------------------------------------------------------------------------------------------
******************************************************************************************/

/*****************************************************************************************
METODOS ASOCIADOS A LA COLECCION
------------------------------------------------------------------------------------------
******************************************************************************************/

Meteor.methods({
	// INSERTAMOS UN NUEVO DOCUMENTO
	panelCallsInsert : function (data) {
		var insertCall = PanelCalls.insert(data);
		return insertCall;
	},

	// ACTUALIZAR UN DOCUMENTO SABIENDO EL ID
	panelCallsUpdate : function (asteriskUniqueId, data){
		return PanelCalls.update({siptaxiCallAsteriskUniqueId : asteriskUniqueId}, {$set: data});
	},

	// Borramos el Registro de la coleccion PanelCalls cuando es state = 0 o cuando damos Click en BTN LANZAR
	panelCallsRemove : function (asteriskUniqueId) {
		PanelCalls.remove({siptaxiCallAsteriskUniqueId : asteriskUniqueId});
	},
});