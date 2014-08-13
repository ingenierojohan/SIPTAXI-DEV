//********************************************************************************//
//+++++++++++++++=====TEMPLATE TAB SERVICES ACTUAL ROW =====++++++++++++++++++++++//
//********************************************************************************//

//******************************* EVENTS *****************************************
Template.tabServicesActualRow.events({
	// Cuando se Presiona Enter en los Inputs Nombre, Direccion, Reference, Notas Cliente y Notas Servicio, GUARDAMOS Cliente y Servicio
	'keyup :input.inputCustomer' : function(evt, temp){
		if (evt.which === 13){
			updateCustomerAndService(this);
		}
	},// FIN del Evento -----------
	//--------------------------------------------------------------------------

	// Cuando Hay un FocusOut en el Campo Address GUARADAMOS datos Cliente
	'focusout :input.inputCustomerAddress' : function(evt, temp){
			updateCustomerAndService(this);
	},// FIN del Evento -----------
	//--------------------------------------------------------------------------

	// Cuando Hay un ENTER en el Campo Phone si el Servicio es Manual, se Genera La Busqueda
	'keyup :input.inputCustomerPhone' : function(evt, temp){
		if (evt.which === 13){
			var currentServiceId = this._id;
			// Limpiamos la row
			cleanInputsForm(currentServiceId);
			var customerPhone = parseInt($("#customerPhone-"+currentServiceId).val());
			customersFindPhone(customerPhone, writeInputs, currentServiceId);
			return;
		}
	},// FIN del Evento -----------
	//--------------------------------------------------------------------------

	// Cuando Hay un FOCUSOUT en el Campo Phone si el Servicio es Manual, se Genera La Busqueda
	'focusout :input.inputCustomerPhone' : function(evt, temp){
		var currentServiceId = this._id;
		// Limpiamos la row
		cleanInputsForm(currentServiceId);
		var customerPhone = parseInt($("#customerPhone-"+currentServiceId).val());
		customersFindPhone(customerPhone, writeInputs, currentServiceId);
		return;
	},// FIN del Evento -----------
	//--------------------------------------------------------------------------

	// Cuando se Presiona ENTER en el Input Moviles
	'keyup .input-tab-services-actual-movil' : function(evt, temp){
		if (evt.which === 13){
			allocateService(this);
		}
	},// FIN del Evento -----------
	//--------------------------------------------------------------------------

	//EVENTO BTN ASIGNAR
	'click #btnAsignar' : function(evt, temp){
		evt.preventDefault();
		allocateService(this);
	},// FIN del Evento -----------
	//--------------------------------------------------------------------------

	// EVENTO BTN DELETE --- Solo en Estado Pendiente
	'click #btnDelete' : function(evt, temp){
		evt.preventDefault();
		btnDelete(this);
	},// FIN del Evento -----------
	//--------------------------------------------------------------------------


	// EVENTO BTN GUARDAR --- Cuando hay un CLICK en el BTN Guaradar, se Guarada Cliente y se borra Servicio
	'click #btnSaveCustomer' : function(evt, temp){
		evt.preventDefault();
		btnSave(this);
	},// FIN del Evento -----------
	//--------------------------------------------------------------------------

	// EVENTO CLICK BTN OK
	'click #btnFinalizar' : function(evt, temp){
		evt.preventDefault();
		var currentServiceId = this._id
		var phone = this.customerPhone;
		// Llamamos la Funcion para cambiar el estado a 2
		servicesPickup(currentServiceId, phone);
	},// FIN del Evento -----------
	//--------------------------------------------------------------------------

	// EVENTO BTN CANCELAR (abre Modal)
	'click #btnCancelar' : function(evt, temp){
		evt.preventDefault();


		var currentServiceId = this._id;
		var phone = this.customerPhone;

		$('#CAModal-'+currentServiceId).modal({
			keyboard: true,
		});

		$('#btnCAModal-'+currentServiceId).click(function(evt, temp){
			evt.preventDefault();
			var cancelServiceReason = $.trim($("#CAmodalReason-"+currentServiceId).val().toUpperCase());
			$('#CAModal-'+currentServiceId).modal('hide');
			// Llamamos a la Funcion general para cancelar el Servicio, (id, reason, phone)
			servicesCancel(currentServiceId, cancelServiceReason, phone);
		});
	},// FIN del Evento -----------
	//--------------------------------------------------------------------------

	//EVENTO BTN REASIGNAR
	'click #btnReasignar' : function(evt, temp){
		evt.preventDefault();

		// Limpiamos panel de Notificaciones
		Session.set('panelNotificaciones', null);

		var currentServiceId = this._id;
		var phone = this.customerPhone;
		//DATOS MOVIL REALLOCATE
		var reallocateService = {
					customerPhone : this.customerPhone,
					reallocateTaxiId : this.taxiId,
					reallocateMovil : this.taxiMovil,
					reallocatePlaca : this.taxiPlaca,
					wasReallocate : true
		};
		
		$('#RAModal-'+currentServiceId).modal({
			keyboard: true
		});

		// MOVIL MANUAL Click Al Boton Reasignar del MODAL
		$('#btnRAModal-'+currentServiceId).click(function(evt, temp){
			evt.preventDefault();
			fnReallocateService(currentServiceId, reallocateService, phone);
		});

		// Evento al Hacer ENTER en el input
		$('#inputRAmodalMovil-'+currentServiceId).keyup(function(evt, temp){
			if (evt.which === 13){
				fnReallocateService(currentServiceId, reallocateService, phone);
			}
		});
	},// FIN del Evento -----------
	//--------------------------------------------------------------------------

});

//********************************************************************************

//******************************* HELPERS ****************************************
Template.tabServicesActualRow.helpers({
	//Llamamos a Funcion Que da color Y texto a los Estados de los Servicios (0=Pendiente, 1=Asignado, 2 = finalizado, 3=Cancelado, Reasigando )
	serviceRowStatus : function(){
		return serviceRowStatus(this);
	},

		// TYPEAHEAD MOVIL Y PLACA
	movilYplaca :function(){
		return Session.get('movilAndPlaca');
	},

	// SHOW BOTONES DEPENDIENDO DE SU ESTATUS
	btnPendiente : function(){
		if(this.status===0){
			return true;
		}
		return false;
	},

	countService : function(){
		return countService = {
			total : numeral(this.serviceNum.total).format('0,0'),
			day : numeral(this.serviceNum.day).format('0,0')
		}
	},

	panelNotificacionesModal: function () {
		return Session.get('panelNotificaciones');
	},

});
//********************************************************************************

//******************************* RENDERED ****************************************
Template.tabServicesActualRow.rendered= function (){
	$('.typeaheadCustomerName').typeahead({source:Session.get('typeaheadCustomerName')});
	$('.typeaheadAddressReference').typeahead({source:Session.get('typeaheadAddressReference')});
};
//********************************************************************************


//******************************* MANEJADORES **************************************
/*Template.panelIngreso.panelCalls = function (){
	return PanelCalls.find();
};*/
//********************************************************************************


//========================= FUNCIONES GENERALES ==================================
// Funcion para Actualizar Datos del Cliente y Datos en Services
function updateCustomerAndService (data){
	var currentServiceId = data._id;


	// Objeto con los Datos del Customer en Mayusculas de los diferentes INPUTS
	var customerData = {
		// la funcion trim elimina los espacios en blanco
		name : $.trim($("#customerName-"+currentServiceId).val().toUpperCase()),
		address : $.trim($("#customerAddress-"+currentServiceId).val().toUpperCase()),
		addressReference : $.trim($("#customerAddressReference-"+currentServiceId).val().toUpperCase()),
		comments : $.trim($("#customerComments-"+currentServiceId).val().toUpperCase())
	};
	//Validamos si es un Servicio Manual
	if (data.isManual && !data.customerPhone){
		var inputPhone = parseInt($("#customerPhone-"+currentServiceId).val());
		if(!data.customerPhone){
			if (!inputPhone){
				var customerPhone = 9999999;
				var cod = 99;
			}
			else{
				var customerPhone = inputPhone;
				var cod = customerPhone%100;
			}
		}
		else{
			var customerPhone = inputPhone;
			var cod = customerPhone%100;
		}

		// Validamos si el Phone es un Fijo o un Celular
		if (!validatePhone(customerPhone)){
			showNotifications(mapNotificationsEror.customersFindPhoneValidate);
			return
		}

		// validamos Si el Phone Existe o es Nuevo consultando una variable de Session que se pone true en la Funcion ValidatePhone
		if (Session.get('isNewCustomer')){
			customerData.phone = customerPhone;
			customerData.cod = cod;
			customersInsert(customerData);
			Session.set('isNewCustomer', false);
		}
		else{
			customerData.phone = customerPhone;
			customerData.cod = cod;
		}

	}
	// Si es un Servicio que Ingreso por Troncal SIP
	else{
		customerData.phone =data.customerPhone;
	}

	// Llamamos al la Funcion para actualizar en CUSTOMER los Datos sabiendo el phone
	customersUpdate(customerData);

	// validamos si es posible insertar El Nombre en la Typeahead CustomerNames
	customersNamesValidate(customerData.name);

	// validamos si es posible insertar laReferencia en la Typeahead AddressReferences
	addressReferencesValidate(customerData.addressReference);

	// Objeto con datos para Actualizar en Services
	var serviceData = {
		customerPhone : customerData.phone,
		customerName: customerData.name,
		customerAddress : customerData.address,
		customerAddressReference : customerData.addressReference,
		customerComments : customerData.comments,
		customerCod : customerData.cod,
		comments : $.trim($("#serviceComments-"+currentServiceId).val().toUpperCase())
	}

	// Llamamos al la Funcion para actualizar en SERVICES los Datos del Customer y Comments service sabiendo el Id
	servicesUpdate(currentServiceId, serviceData);
}
//********************************************************************************

//--------------------------------------------------------------------------------
// Funcion para Guaradar el Cliente y Borrar de Services
function btnSave(data){
	var currentServiceId = data._id;
	// Objeto con los Datos del Customer en Mayusculas de los diferentes INPUTS
	var customerData = {
		// la funcion trim elimina los espacios en blanco
		name : $.trim($("#customerName-"+currentServiceId).val().toUpperCase()),
		address : $.trim($("#customerAddress-"+currentServiceId).val().toUpperCase()),
		addressReference : $.trim($("#customerAddressReference-"+currentServiceId).val().toUpperCase()),
		comments : $.trim($("#customerComments-"+currentServiceId).val().toUpperCase()),
		phone : data.customerPhone
	};

		// Llamamos al la Funcion para actualizar en CUSTOMER los Datos sabiendo el phone
	customersUpdate(customerData);

	// validamos si es posible insertar El Nombre en la Typeahead CustomerNames
	customersNamesValidate(customerData.name);

	// validamos si es posible insertar laReferencia en la Typeahead AddressReferences
	addressReferencesValidate(customerData.addressReference);

	// Borramos del panel de Servicios, el Servicio del Cliente Guardado Mandando el Id
	servicesRemove(data._id, data.customerPhone);
};
//********************************************************************************


//--------------------------------------------------------------------------------
// Funcion para Quitar el Registro de Pendientes
function btnDelete (data){
	servicesRemove(data._id, data.customerPhone);
}
//********************************************************************************


//--------------------------------------------------------------------------------
// Funcion para ASIGANR EL SERVICIO
function allocateService (data){
	var currentServiceId = data._id;
	var inputMovil = $.trim($("#movil-"+currentServiceId).val());
	// Llamamos la Funcion Validate movil donde nos devuelve si el movil existe y otras validaciones
	var currentMovil = validateMovil(inputMovil);
	if (currentMovil){
		// Actualizamos los Datos del cliente
		updateCustomerAndService(data);

		// Organizamos el Docuento Service
		var allocateService = {
			agentId : Meteor.userId(),
			agentName : Meteor.user().username,
			customerPhone : data.customerPhone,
			taxiId : currentMovil._id,
			taxiMovil : currentMovil.movil,
			taxiPlaca : currentMovil.placa,
			status : 1,
			serviceNum :{
				total : null,
				day : null
			}
		};
		// Llamamos al la Funcion para actualizar en SERVICES los Datos del Customer y Comments service sabiendo el Id
		servicesAllocate(currentServiceId, allocateService);
		return;
	}
	return;
};

//********************************************************************************

//--------------------------------------------------------------------------------
// Funcion para Escribir los Values de los Inputs cuando se encuentra un Cliente
function writeInputs (data, currentServiceId){
	$("#customerName-"+currentServiceId).val(data.name);
	$("#customerAddress-"+currentServiceId).val(data.address);
	$("#customerAddressReference-"+currentServiceId).val(data.addressReference);
	$("#customerComments-"+currentServiceId).val(data.comments);

	//return console.log('-------RETURN DATA------',data, serviceId);
}
//********************************************************************************

//--------------------------------------------------------------------------------
// Funcion para Limpiar Formularios
function cleanInputsForm(currentServiceId){
	$("#customerName-"+currentServiceId).val(null);
	$("#customerAddress-"+currentServiceId).val(null);
	$("#customerAddressReference-"+currentServiceId).val(null);
	$("#customerComments-"+currentServiceId).val(null);
};
//********************************************************************************

//--------------------------------------------------------------------------------
// Funcion para Reasiganar el Movil
function fnReallocateService (currentServiceId, reallocateService, phone){
	// Movil Manual
	var inputMovil = $.trim($("#inputRAmodalMovil-"+currentServiceId).val());
	var reallocateReason = $.trim($("#RAmodalReason-"+currentServiceId).val().toUpperCase());

	// Llamamos la Funcion Validate movil donde nos devuelve si el movil existe y otras validaciones
	var currentMovil = validateMovil(inputMovil);
	if (currentMovil){
		// Objeto con los Datos del Servicio Asignado
		reallocateService.taxiId = currentMovil._id;
		reallocateService.taxiMovil = currentMovil.movil;
		reallocateService.taxiPlaca = currentMovil.placa;
		reallocateService.reallocateReason = reallocateReason;

		// Llamamos al la Funcion para actualizar en SERVICES los Datos sabiendo el Id
		$('#RAModal-'+currentServiceId).modal('hide');
		servicesReAllocate(currentServiceId, reallocateService, phone);
	}
	return;
};
//********************************************************************************

//--------------------------------------------------------------------------------
