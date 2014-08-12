//***************************************************************************************************
// *********************  FUNCIONES GENERALES DEL LADO DEL CLIENTE ***********************************
//***************************************************************************************************


//============================RELACIONADOS CON CUSTOMER =========================================
//-----------------------------------------------------------------------------------------------
// Funcion para Insertar un Nuevo Cliente
customersInsert = function(newCustomer){
	var data = null;
	Meteor.call('customersInsert', newCustomer, function (error, result){
		if (error){
			console.log('---> [customers]: UPSsss UN ERROR AL INSERTAR NUEVO CLIENTE EN CUSTOMERS', error);
			showNotifications(mapNotificationsError.customersInsert);
			return data = null;
		}
		showNotifications(mapNotificationsOk.customersInsert);
		console.log('---> [customers]: NEW CLIENT DOCUMENT, id = ', result, '<---');
		return data = result;
	});
	return data;
};
//***************************************************************************************************
//---------------------------------------------------------------------------------------------------
// Funcion Para Actualizar Datos de la Coleccion Customers
customersUpdate = function (customerData){
	// Organizamos solo los datos A Actualizar
	var data = {
		name : customerData.name,
		address : customerData.address,
		addressReference : customerData.addressReference,
		comments : customerData.comments
	}
	console.log('---> [customers]: SE VA ACTUALIZAR ', data, ', Telefono =', customerData.phone, '<---')
	Meteor.call('customersUpdate', customerData.phone, data, function(error, result){
		if(error){
			console.log('---> [customers]: UPSsss UN ERROR AL HACER UPDATE:',data, error);
			showNotifications(mapNotificationsError.customersUpdate);
			return;
		}
		if(result === 1){
			console.log ('---> [customers]: ACTUALIZACION EXITOSA = ', result, ', Telefono:', customerData.phone, ' <---');
			showNotifications(mapNotificationsOk.customersUpdate);
			return;
		}
		else{
			console.log ('---> [customers]: ERROR ACTUALIZACION = ', result, ', Telefono:', customerData.phone, ' <---');
			showNotifications(mapNotificationsError.customersUpdate);
			return;
		}
	});
};
//***************************************************************************************************

//---------------------------------------------------------------------------------------------------
// Funcion Para Buscar un Cliente sabiendo el phone en Customers, como parametros se recibe el callback y el id del servicio
customersFindPhone  = function(phone, callback, serviceId){

	var countPhone = phone.toString().length;
	// Si es Fijo o Celular
	if (countPhone == 7 || countPhone==10){
		// Buscamos el Numero en la DB
		Meteor.call('customersFindPhone', phone, function (error, result) {
			if(error){
				showNotifications(mapNotificationsError.customersFindPhone);
				console.log('---> [customers]: UPSsss UN ERROR AL BUSCAR EL CLIENTE CON TELEFONO:',phone, error);
				return;
			}
			if(result){
				showNotifications(mapNotificationsOk.customersFindPhoneSuccess);
				console.log('---> [customers]: CLIENTE ENCONTRADO CON TELEFONO:',phone, result);
				Session.set('isNewCustomer', false);
				//retornamos haciendo llamado al callback y le mandamos el resulatdo y el serviceId
				return callback(result, serviceId);
			}
			showNotifications(mapNotificationsOk.customersFindPhoneNew);
			Session.set('isNewCustomer', true);
			return null
		});
	}
	showNotifications(mapNotificationsError.customersFindPhoneValidate);
};

//***************************************************************************************************



//============================RELACIONADOS CON CUSTOMER_NAMES =========================================
//-----------------------------------------------------------------------------------------------
// Validacion de la coleccion de CUSTOMER_NAMES
customersNamesValidate = function(name){
	// Validamos que el name no este vacio
	if(!name==""){
		// Buscamos si existe el nombre
		var customerName = CustomersNames.findOne({name:name});
			if (!customerName){
				Meteor.call('customersNamesInsert', name, function (error, result) {
					if(error){
						console.log('---> [customersNames]: UPSsss UN ERROR AL INSERTAR',data, error);
						return;
					}
					console.log('---> [customersNames]: NEW CUSTOMERSNAMES, nombre = ', name, '<---');
				});
				return;
			}
			return console.log('---> [customersNames]: YA EXISTE EL NOMBRE : ',name,'<---');
		}
		return console.log('---> [customersNames]: CAMPO NOMBRE ESTA VACIO <---');
};

//***************************************************************************************************



//============================RELACIONADOS CON ADDRESS REFERENCES =========================================
//-----------------------------------------------------------------------------------------------

// Validacion de la coleccion de ADDRESS REFERENCES
addressReferencesValidate = function(reference){
	// Validamos que el addressREFERENCE no este vacio
	if(!reference==""){
		// Buscamos si existe el addressReference
		var addressReference = AddressReferences.findOne({addressReference:reference});
			if (!addressReference){
				Meteor.call('addressReferencesInsert', reference, function (error, result) {
					if(error){
						console.log('---> [addressReferences]: UPSsss UN ERROR AL INSERTAR',data, error);
						return;
					}
					console.log('---> [addressReferences]: NEW ADDRESS-REFERENCES = ', reference, '<---');
				});
				return;
			}
			return console.log('---> [addressReferences]: YA EXISTE LA REFERENCIA: ',reference,'<---');
		}
		return console.log('\n---> [addressReferences]: CAMPO REFERENCIA ESTA VACIO <---');
};
//***************************************************************************************************



//============================RELACIONADOS CON SERVICES =========================================
//-----------------------------------------------------------------------------------------------
// Funcion para Insertar un Nuevo Servicio
servicesInsert = function(newService){
	Meteor.call('servicesInsert', newService, function (error, result){
		if (error){
			console.log('---> [services]: UPSsss UN ERROR AL INSERTAR NUEVO SERVICIO EN SERVICES', error);
			showNotifications(mapNotificationsError.servicesInsert);
			return
		}
		console.log('---> [services]: NEW SERVICE DOCUMENT, id = ', result, '<---');
		showNotifications(mapNotificationsOk.servicesInsert);
		return;
	});
	return;
};
//***************************************************************************************************
//---------------------------------------------------------------------------------------------------
// Funcion Para Actualizar Datos de la Coleccion Services
servicesUpdate = function (id, serviceData){
	// Organizamos solo los datos A Actualizar
	console.log('---> [services]: SE VA ACTUALIZAR ', serviceData, ', id =', id, '<---')
	Meteor.call('servicesUpdate', id, serviceData, function(error, result){
		if(error){
			return console.log('---> [services]: UPSsss UN ERROR AL HACER UPDATE ID',id,'Telefono:',serviceData.customerPhone, error);
		}
		if(result === 1){
			showNotifications(mapNotificationsOk.servicesUpdate);
			return console.log ('---> [services]: ACTUALIZACION EXITOSA = ', result, ', Id:', id, 'Telefono:',serviceData.customerPhone, '<---');
		}
		else{
			showNotifications(mapNotificationsError.servicesUpdate);
			return console.log ('---> [services]: ERROR ACTUALIZACION = ', result, ', Id:', id, 'Telefono:',serviceData.customerPhone, '<---');
		}
	});
};
//***************************************************************************************************

//---------------------------------------------------------------------------------------------------
// Funcion para Llamar al Metdo de Finalizar Servcio, status = 2
servicesPickup = function(id, phone){

	Meteor.call('servicesPickup', id, function(error, result){
		if(error){
			return console.log('---> [services]: UPSsss UN ERROR AL HACER UPDATE x BTN OK ID',id,'Telefono:',phone, error);
		}
		if(result === 1){
			showNotifications(mapNotificationsOk.servicesPickup);
			return console.log ('---> [services]: SERVICIO FINALIZADO OK = ', result, ', Id:', id, 'Telefono:',phone, '<---');
		}
		else{
			showNotifications(mapNotificationsError.servicePickup);
			return console.log ('---> [services]: ERROR SERVICIO FINALIZADO = ', result, ', Id:', id, 'Telefono:',phone, '<---');
		}
	});
};
//***************************************************************************************************

//---------------------------------------------------------------------------------------------------
// Funcion para Remove el Documento de Services
servicesRemove = function(id, phone){
	Meteor.call('servicesRemove', id, function (error, result) {
		if(error){
			return console.log('---> [services]: UPSsss UN ERROR AL HACER REMOVE al id :',id,'con Telefono:',phone,  error);
		}
		return console.log ('---> [services]: Documento Borrado Id:', id,' , Telefono:',phone,' <---');
	});
};
//***************************************************************************************************

//---------------------------------------------------------------------------------------------------
// Funcion Para Asignar el Numero del Servicio, tanto del Dia como General
servicesAllocate = function (id, serviceData){
	// Organizamos solo los datos A Actualizar
	console.log('---> [services]: ASIGNANDO SERVICIO: ', serviceData, ', id =', id, '<---')

	// Obtenemos los Servicios Del Dia
	serviceData.serviceNum.day = Session.get('countServicesDay')+1;
	Meteor.call('servicesAllocate', id, serviceData, function(error, result){
		if(error){
			return console.log('---> [services]: UPSsss UN ERROR AL HACER UPDATE x BTN ALLOCATE ID',id,'Telefono:',serviceData.customerPhone, error);
		}
		if(result === 1){
			showNotifications(mapNotificationsOk.servicesAllocate);
			return console.log ('---> [services]: ACTUALIZACION EXITOSA x BTN ALLOCATE = ', result, ', Id:', id, 'Telefono:',serviceData.customerPhone, '<---');
		}
		else{
			showNotifications(mapNotificationsError.servicesAllocate);
			return console.log ('---> [services]: ERROR ACTUALIZACION x BTN ALLOCATE = ', result, ', Id:', id, 'Telefono:',serviceData.customerPhone, '<---');
		}
	});
};
//***************************************************************************************************

//---------------------------------------------------------------------------------------------------
// Funcion Para Asignar el Numero del Servicio, tanto del Dia como General
servicesReAllocate = function (id, serviceData, phone){
	// Organizamos solo los datos A Actualizar
	console.log('---> [services]: RE-ASIGNANDO SERVICIO: ', phone, ', id =', id, '<---');

	Meteor.call('servicesReAllocate', id, serviceData, function(error, result){
		if(error){
			return console.log('---> [services]: UPSsss UN ERROR AL HACER UPDATE x BTN RE-ALLOCATE ID',id,'Telefono:', phone, error);
		}
		if(result === 1){
			showNotifications(mapNotificationsOk.servicesReAllocate);
			return console.log ('---> [services]: ACTUALIZACION EXITOSA x BTN RE-ALLOCATE = ', result, ', Id:', id, 'Telefono:',phone, '<---');
		}
		else{
			showNotifications(mapNotificationsError.servicesReAllocate);
			return console.log ('---> [services]: ERROR ACTUALIZACION x BTN RE-ALLOCATE = ', result, ', Id:', id, 'Telefono:',phone, '<---');
		}
	});
};
//***************************************************************************************************



//---------------------------------------------------------------------------------------------------
// Funcion Cancelar Un Servicio Cambiando su Estado
servicesCancel = function(id, reason, phone){
	Meteor.call('servicesCancel', id, reason, function(error, result){
		if(error){
			return console.log('---> [services]: UPSsss UN ERROR AL HACER CANCEL x BTN CANCEL ID',id,'Telefono:',phone, error);
		}
		if(result === 1){
			showNotifications(mapNotificationsOk.servicesCancel);
			return console.log ('---> [services]: ACTUALIZACION EXITOSA x BTN CANCEL = ', result, ', Id:', id, 'Telefono:',phone, '<---');
		}
		else{
			showNotifications(mapNotificationsError.servicesCancel);
			return console.log ('---> [services]: ERROR ACTUALIZACION x BTN CANCEL = ', result, ', Id:', id, 'Telefono:',phone, '<---');
		}
	});
};



//============================== RELACIONADOS CON PANELCALLS ==============================
//---------------------------------------------------------------------------------------------------
// Funcion para Remove el Documento de PanelCalls
panelCallsRemove = function(asteriskUniqueId){
	Meteor.call('panelCallsRemove', asteriskUniqueId, function (error, result) {
		if(error){
			return console.log('---> [panelCalls]: UPSsss UN ERROR AL HACER REMOVE al asteriskUniqueId :',asteriskUniqueId, error);
		}
		return console.log ('---> [panelCalls]: Documento Borrado con asteriskUniqueId:', asteriskUniqueId, ' <---');
	});
};
//***************************************************************************************************



//==================================== OTRAS FUNCIONES =========================================

//----------------------------------------------------------------------------------------------
// Funcion para Validar el Numero Telefonico
validatePhone = function (phone){
	var countPhone = phone.toString().length;
	// Si es Fijo o Celular
	if (countPhone == 7 || countPhone==10){
		console.log ('---> [validatePhone]: El Telefono paso Validacion:', phone, ' <---');
		return true;
	}
	else{
		console.log ('---> [validatePhone]: El Telefono NO PASO LA Validacion:', phone, ' <---');
		showNotifications(mapNotificationsError.customersFindPhoneValidate);
		return false;
	}
};
//**********************************************************************************************
//----------------------------------------------------------------------------------------------
// Funcion para Validar el formato del Movil [131 -- SKR630]
validateMovil = function(formatMovil){
	// Validamos que el Formato no este Vacio
	if(formatMovil !=''){
		var movil = formatMovil.substring(3,0);
		var placa = formatMovil.substring(7);
		// Buscamos el Movil en la Base de Datos Taxis
		var currentTaxi = Taxis.findOne({movil:movil});

		// Se valida si el Movil Existe
		if (!currentTaxi){
			console.log('---> [validateFormatMovil]: el MOVIL no Existe en la Coleccion Taxis :', currentTaxi,' <---');
				showNotifications(mapNotificationsError.movilNoEncontrado);
				return null;
		}
		console.log('---> [validateFormatMovil]: el MOVIL Encontrado: ', currentTaxi,' <---');
		//Espacion para Validar COSAS
		//
		//
		return currentTaxi;
	}
	console.log('---> [validateFormatMovil]: NO se ha Seleccionado un Movil de la Lista  <---');
	showNotifications(mapNotificationsError.movilNoSelecionado);
	return null;
};
//**********************************************************************************************

//----------------------------------------------------------------------------------------------
// Funcion para Mostrar los Mensajes de Notificaciones
showNotifications = function (data){
	Session.set('panelNotificaciones', {
		classAlert : data.classAlert,
		classLabel : data.classLabel,
		mensaje : data.mensaje
	});
	$('#divPanelNotificaciones').fadeIn("fast");
	Meteor.setTimeout(function(){
		$('#divPanelNotificaciones').fadeOut("slow");
	}, 5000);
};
//***************************************************************************************************

//---------------------------------------------------------------------------------------------------
serviceRowStatus = function(data) {
	var status = {};
	//Hora de Lanzado
	status.timeLaunch = moment(data.timeLaunch).format('HH:mm:ss');
	// REASIGNADO
	if(data.wasReallocate){
		status.rowColor = '';
		status.estadoColor = 'label-inverse';
		status.estadoText	= 'REASIGNADO';

		// Time Reasigando
		status.timeAllocate = moment(data.timeReallocate).format('HH:mm:ss');

		// Validamos si el Servicio Finalizo
		if (data.status==2){
			status.timeFinal = moment(data.timePickup).format('HH:mm:ss');
		}
		else{
			status.timeFinal = "";
		}
		return status;
	}

	// Case con los Diferentes Estados y sus Tiempos
	switch(data.status){
		case 0:
			// PENDIENTE
			status.rowColor = 'warning';
			status.estadoColor = 'label-warning';
			status.estadoText	= 'PENDIENTE';
			status.timeAllocate = "";
			status.timeFinal = "";
			break;

		case 1:
			// ASIGNADO
			status.rowColor = 'info';
			status.estadoColor = 'label-info';
			status.estadoText	= 'ASIGNADO';
			status.timeAllocate = moment(data.timeAllocate).format('HH:mm:ss');
			status.timeFinal = "";
			break;

		case 2:
			// FINALIZADO
			status.rowColor = 'success';
			status.estadoColor = 'label-success';
			status.estadoText = 'FINALIZADO';
			status.timeAllocate = moment(data.timeAllocate).format('HH:mm:ss');
			status.timeFinal = moment(data.timePickup).format('HH:mm:ss');
			break;

			case 3:
			// CANCELADO
			status.rowColor = 'error';
			status.estadoColor = 'label-important';
			status.estadoText = 'CANCELADO';
			status.timeAllocate = moment(data.timeAllocate).format('HH:mm:ss');
			status.timeFinal = moment(data.timeCancel).format('HH:mm:ss');
			break;

		default:
			// Error en el Status
			status.rowColor = 'error';
			status.estadoColor = 'label-important';
			status.estadoText = 'ERROR';
			status.timeAllocate = '';
			status.timeFinal = '';
			break;
		}
		return status;
};

//***************************************************************************************************
//---------------------------------------------------------------------------------------------------