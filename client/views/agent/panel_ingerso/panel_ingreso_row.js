//********************************************************************************//
//++++++++++=====TEMPLATE PANEL INGRESO ROW  =====++++++++++++++++++++++++++++++//
//********************************************************************************//

//******************************* EVENTS *****************************************
Template.panelIngresoRow.events({

	// Evento Click Boton LANZAR 
	'click #btnLanzar': function(evt, temp) {
		evt.preventDefault();
		launchService(this);
	},

	// Evento pulsar ENTER En Cualquier INPUT
	'keyup :input' : function(evt, temp){
		if (evt.which === 13){
			launchService(this);
		}
	},

	// Evento para ver info de La Ultima Llamada (hover)
	'mouseenter .lastCall': function (e,t) {
		e.preventDefault();
		var lastCall = '#lastCall-'+this._id;
		var data = null;
		if(this.siptaxiCallLast){
			data = moment(this.siptaxiCallLast.timestampHangup).calendar();
		}
		else{
			data = "No hay Historial"
		}
		$(lastCall).tooltip({
			title: data,
			placement: 'bottom'
		});
	},

	// Evento para ver Info de los Ultimos Servicios (hover)
	'mouseenter .lastServices': function (e,t) {
		e.preventDefault();
		var lastServices = "#lastServices-"+this._id;
		var services = this.servicesLast;
		var statusInfo={}
		var html = '<div class="row-fluid">';
		var evaluateStatus= function(status){
			switch (status){
			case 0 : // Lanzado o Pendiente
				statusInfo.desc = 'Pendiente';
				statusInfo.color = 'warning';
				break;
			case 1 : // Asignado
				statusInfo.desc = 'Asignado';
				statusInfo.color = 'info';
				break;
			case 2 : // Finalizado
				statusInfo.desc = 'Finalizado';
				statusInfo.color = 'success';
				break;
			default : //Cancelado
				statusInfo.desc = 'Cancelado';
				statusInfo.color = 'important';
				break;
			}
		return statusInfo
		}
		// Forma de encabezado Ultimo y Penultimo
		var ultimoOpenultimo = ['>>> ULTIMO <<<', '>>> PENULTIMO <<<'];
		for (var key in services){
			// Validamos si existe un timeAllocate, esto es para los servicios que quedaron en status pendiente.
			if(services[key].timeAllocate == null){
				var time = services[key].timeLaunch;
			}
			else{
				var time = services[key].timeAllocate;
			}

			// Validamos Si existe el ServiceNum
			if(!services[key].serviceNum){
				var serviceNumero="????";
			}
			else{
				var serviceNumero = services[key].serviceNum.total
			}

			var timeFormat = moment(time).format("ddd DD MMM [de] YYYY hh:mm a");
			var estado = evaluateStatus(services[key].status);
			html += '<div class="span6">\
				<div class="panel-body">\
					<table class ="table table-bordered table-condensed">\
						<tr><td><strong>'+ultimoOpenultimo[key]+'</strong></td></tr>\
						<tr><td>'+ timeFormat +'</td></tr>\
						<tr><td><strong>SERVICIO</strong>: '+ serviceNumero +'</td></tr>\
						<tr><td><strong>MOVIL</strong>: '+ services[key].taxiMovil +'</td></tr>\
						<tr><td><strong>PLACA</strong>: '+ services[key].taxiPlaca +'</td></tr>\
						<tr><td><strong>Agente</strong>: '+ services[key].agentName +'</td></tr>\
						<tr><td><strong><span class="label label-'+estado.color+'">'+estado.desc+'</span></strong></td></tr>\
					</table>\
				</div>\
			</div>';
		}
		html += '</div>';
		$(lastServices).popover({
			trigger: 'hover',
			placement: 'bottom',
			html : true,
			content: html
		});
	}
});

//********************************************************************************

//******************************* HELPERS ****************************************
/*Template.navbarAgent.helpers({

});*/
//********************************************************************************

//******************************* RENDERED ****************************************
Template.panelIngresoRow.rendered= function (){
	$('.typeaheadCustomerName').typeahead({source:Session.get('typeaheadCustomerName')});
	$('.typeaheadAddressReference').typeahead({source:Session.get('typeaheadAddressReference')});
};
//********************************************************************************


//******************************* MANEJADORES **************************************
// Manejador del Color de la Fila (customerNew= red, ReCall=yellow,  customer=green)
Template.panelIngresoRow.rowColor= function (){
	if(this.isNewCustomer) {
		return rowColor={row : "error",badge:"important"}
	}
	if (this.isRecall){
		return rowColor={row : "warning",badge:"warning"}
	}
	return rowColor={row : "success",badge:"success"}
};

// Manejador de los Estados en los Iconos de la llamada
Template.panelIngresoRow.stateCalls = function(){
	var state = this.state;
	var exten = ' : '+this.agentExten;
	var stateCalls = {};
		switch (state){
			case 4 : // Timbrando
				stateCalls.desc = '';
				stateCalls.state = 'state-ring';
				stateCalls.icon	= 'icon-bell-alt';
				break;
			case 6 : // Hablando
				stateCalls.desc = exten;
				stateCalls.state = 'state-answer';
				stateCalls.icon	= 'icon-aling-left icon-phone';
				break;
			default : //Colgando
				stateCalls.desc = '';
				stateCalls.state = 'state-hangup';
				stateCalls.icon	= 'icon-circle-arrow-down';
				break;
		}
	return stateCalls;
};
//********************************************************************************


//========================= FUNCIONES GENERALES ==================================
//--------------------------------------------------------------------------------
// Funcion para Lanzar la llamada al Panel de Servicios
function launchService (data){

	var currentPanelId = data._id;	// id de la Fila Actual
	// Objeto con los Datos del Customer en Mayusculas de los diferentes INPUTS
	var customerData = {
		// la funcion trim elimina los espacios en blanco
		name : $.trim($("#customerName-"+currentPanelId).val().toUpperCase()),
		address : $.trim($("#customerAddress-"+currentPanelId).val().toUpperCase()),
		addressReference : $.trim($("#customerAddressReference-"+currentPanelId).val().toUpperCase()),
		comments : $.trim($("#customerComments-"+currentPanelId).val().toUpperCase())
	};
		customerData.phone = data.customerPhone;
		customerData.cod = data.customerCod;

	// Si es un Cliente Nuevo Creamos Documento, si No, solo Actualiazamos campos
	if(data.isNewCustomer){
		// Llamamos al funcion para Insertar new Customer
		customerData.id = customersInsert(customerData);
	}
	else{
		// Llamamos al la Funcion para actualizar el customer sabiendo el phone
		customerData.id = data.customerId;
		customersUpdate(customerData);
	}

	// validamos si es posible insertar El Nombre en la Typeahead CustomerNames
	customersNamesValidate(customerData.name);

	// validamos si es posible insertar laReferencia en la Typeahead AddressReferences
	addressReferencesValidate(customerData.addressReference);

	// Objeto con los Datos del Nuevo Servicio
	var newService = {
		customerId : customerData.id,
		customerPhone : customerData.phone,
		customerAddress : customerData.address,
		customerAddressReference : customerData.addressReference,
		customerComments : customerData.comments,
		customerCod : customerData.cod,
		customerName : customerData.name,
		siptaxiCallId : data.siptaxiCallId,
		siptaxiCallAsteriskUniqueId : data.siptaxiCallAsteriskUniqueId,
		taxiId : "",
		taxiMovil : "",
		taxiPlaca : "",
		agentId : Meteor.userId(),
		agentName : Meteor.user().username,
		comments : "",
		serviceNum :{
			total : null,
			day : null
		},
		status : 0			//status :0 = servicio Lanzado, 1 = servicio Asignado,	2 = servicio Finalizado,	3 = servicio Cancelado
	};

	// Llamamos a Funcion que Inserta Nuevo Servicio
	servicesInsert(newService);

	// Borramos el Registro en PanelCalls
	panelCallsRemove(data.siptaxiCallAsteriskUniqueId);

}