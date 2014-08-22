// Coleccion de los Clientes
Services = new Meteor.Collection('services');

/*****************************************************************************************
MAPA de la Coleccion
------------------------------------------------------------------------------------------
_id : Id del documento

agentId : Id del agente que despacho el Servicio
agentName : Nombre del agente

comments : Observaciones del Servicio

customerAddressComments : Notas de la Direccion
customerAddress : Direccion del Cliente
customerAddressReference : Referencia de la Direccion
customerCod : Codigo del Cliente
customerId : Id del Cliente
customerPhone : Telefono del Cliente
customerName : Nombre del Cliente

siptaxiCallasteriskUniqueId : Id de la Llamada en asterisk
siptaxiCallId : id de la Llamada

taxiId : id del Taxi
taxiMovil : Numero del Movil del taxi
taxiPlaca : Placa del Taxi

timeLaunch : Hora en que fue Lazado del Servicio (presionado el Boton Lanzar)
timeAllocate : Hora en que Fue Asignado el Servicio
timePickup : Hora en que Fue recogido el Servicio
timeCancel : Hora en que Fue Cancelado el Servicio
timeReallocate : Hora en que Fue ReAsignado el Servicio

status :
	0 = servicio Lanzado
	1 = servicio Asignado
	2 = servicio Finalizado
	3 = servicio Cancelado

wasReallocate : boleano

		si hay una reasigancion
reallocateTaxiId : id del Taxi
reallocateTaxiMovil : Numero del Movil del taxi
reallocateTaxiPlaca : Placa del Taxi
reallocateReason : Motivo de la reasigancion

cancelReason : motivo de la Cancelacion

serviceNum : {
	total : Numero del Servicio
	day : Numero servicio en el Dia
}
------------------------------------------------------------------------------------------
******************************************************************************************/

/*****************************************************************************************
METODOS ASOCIADOS A LA COLECCION
------------------------------------------------------------------------------------------
******************************************************************************************/

Meteor.methods({
	// SABER LA CANTIDAD DE SERVICIOS QUE HA TENIDO UN NUMERO TELEFONICO
	servicesCount : function (phone){
		var count = Services.find({customerPhone:phone}).count();
		return count;
	},

	// BUSCAR LOS ULTIMOS 2 SERVICIOS DEL TELEFONO Y ALMACENARLOS EN UN ARRAY
	servicesLast : function (phone) {
		var lastServices = [];
		Services.find({customerPhone:phone},{sort:{timeLaunch: -1}, limit:2}).forEach(function (doc) {
			lastServices.push(doc)
		});
		return lastServices;
	},

	// INSERTAR UN NUEVO SERVICIO
	servicesInsert : function (serviceData) {
		serviceData.timeLaunch = new Date().getTime();
		var idNewService = Services.insert(serviceData);
		return idNewService;
	},

	// ACTUALIZAR DATOS DEL CLIENTE y DEL SERVICIO
	servicesUpdate : function (id, data){
		return Services.update({_id : id}, {$set:data});
	},

	// REMOVE SERVICE
	servicesRemove : function (id){
		return Services.remove({_id : id});
	},

	// CAMBIA STATUA a 2 por BTN FINALIZADO
	servicesPickup : function(id){
		var pickupService = {};
		pickupService.timePickup = new Date().getTime();
		pickupService.status = 2;
		return Services.update({_id:id}, {$set:pickupService});
	},

	// SERVICES ALLOCATE
	servicesAllocate : function(id, data){
		// Agregamos el timepo Allocate
		data.timeAllocate = new Date().getTime();
		// Contamos cuantos servicios Hay hasta el Momento, con status Mayor a 0 (Asiganodo, Finalizado, Reasignado, Cancelado)
		data.serviceNum.total = Services.find({ status: { $gt:0 } }).count()+1;
		// Actualizamos el Documento.
		return Services.update({_id:id}, {$set:data});
	},

	// SERVICES REALLOCATE
	servicesReAllocate : function(id, data){
		data.timeReallocate = new Date().getTime();
		return Services.update({_id:id}, {$set:data});
	},

	// SERVICES CANCEL
	servicesCancel : function(id, reason){
		var cancelService = {};
		//Agregamos el Tiempo de Cancelacion
		cancelService.timeCancel = new Date().getTime();
		cancelService.cancelReason = reason;
		// Ponemos status en 3
		cancelService.status = 3;
		return Services.update({_id : id}, {$set:cancelService});
	}

//***************************************************************************************************

});
