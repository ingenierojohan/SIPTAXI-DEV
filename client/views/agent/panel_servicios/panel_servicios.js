//********************************************************************************//
//+++++++++++++++++++++++++=====TEMPLATE PANEL SERVICIOS =====++++++++++++++++++++++++++++++//
//********************************************************************************//

//******************************* EVENTS *****************************************
Template.panelServicios.events({
	'click #btnNewService': function (event) {
		event.preventDefault();
		// Objeto con los Datos del Nuevo Servicio
		var newService = {
			customerId : null,
			customerPhone : null,
			customerAddress : "",
			customerAddressReference : "",
			customerComments : "",
			customerCod : null,
			customerName : "",
			siptaxiCallId : null,
			siptaxiCallAsteriskUniqueId : null,
			taxiId : "",
			taxiMovil : "",
			taxiPlaca : "",
			agentId : Meteor.userId(),
			agentName : Meteor.user().username,
			comments : "",
			isManual : true,
			serviceNum :{
				total : null,
				day : null
			},
			status : 0			//status :0 = servicio Lanzado, 1 = servicio Asignado,	2 = servicio Finalizado,	3 = servicio Cancelado
		};

		// Llamamos a Funcion que Inserta Nuevo Servicio
		servicesInsert(newService);
	},
});

//********************************************************************************

//******************************* HELPERS ****************************************
Template.panelServicios.helpers({
	// Obtiene los la cantidad de servicios del Agente, definada en autorun en Main.js
	countServicesAgent : function(){
		return Session.get('countServicesAgent');
	},

	// Obtiene los la cantidad de servicios del Dia, definada en autorun en Main.js
	countServicesDay : function(){
		return Session.get('countServicesDay');
	},

});
//********************************************************************************

//******************************* MANEJADORES **************************************
/*Template.panelIngreso.panelCalls = function (){
	return PanelCalls.find();
};*/
//********************************************************************************


//========================= FUNCIONES GENERALES ==================================

//--------------------------------------------------------------------------------
