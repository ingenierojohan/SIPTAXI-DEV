//***************************************************************************************************
// *********************  FUNCIONES GENERALES DEL LADO DEL SERVER ***********************************
//***************************************************************************************************


//============================RELACIONADOS CON SIPTAXICALLS =========================================
//---------------------------------------------------------------------------------------------------
// Funcion Para Consultar cuantas llamadas A Tenido un Numero Telefonico.
siptaxiCallCount = function (phone){
	var data = null;
	Meteor.call('siptaxiCallsCount', phone , function (error, result) {
		if (error){
			console.log('\n---> [siptaxiCalls]: UPSsss UN ERROR AL CONTAR LAS LLAMADS EN SIPTAXICALLS', error);
			return data = 0;
		}
		console.log ('---> [siptaxiCalls]: El Telefono : ', phone, ' ha llamadado ', result , ' veces. <---');
		return data = result;
	});
	return data;
};
//***************************************************************************************************

//---------------------------------------------------------------------------------------------------
// Funcion para Consultar la Ultima llamada del Numero Telefonico
siptaxiCallLast = function(phone){
	var data = null;
	Meteor.call('siptaxiCallsLast', phone, function (error, result) {
		if (error){
			console.log('\n---> [siptaxiCalls]: UPSsss UN ERROR AL LOCALIZAR LA ULTIMA LLAMADA EN SIPTAXICALLS', error);
			return null;
		}
		if(result){
		console.log ('---> [siptaxiCalls]: La Ultima LLamada fue :', result.timestampHangup, '<---');
		return data = result;
	}
	console.log ('---> [siptaxiCalls]: No Tiene Historial de Llamadas <---');
	return 0;
	});
	return data;
};
//***************************************************************************************************

//---------------------------------------------------------------------------------------------------
// Funcion Para Insertar Un Nuevo Documento en siptaxiCalls
siptaxiCallsInsertNewCall = function (newCall){
	var data = null;
	Meteor.call('siptaxiCallsInsertNewCall', newCall, function (error, result) {
		if (error) {
			console.log('\n---> [siptaxiCalls]: UPSsss UN ERROR AL INSERTAR NUEVA LLAMADA EN SIPTAXICALLS', error);
			return null;
		}
		else{
			console.log('---> [siptaxiCalls]: NEW DOCUMENT, id = ', result, '<---');
			return data = result;
		}
	});
	return data;
};
//***************************************************************************************************

//---------------------------------------------------------------------------------------------------
// Funcion Para Actualizar Datos de la Coleccion SIPTAXICALLS
siptaxiCallsUpdate = function (asteriskUniqueId, data){
	console.log('---> [siptaxiCalls]: SE VA ACTUALIZAR ', data, ', asteriskUniqueId =', asteriskUniqueId, '<---')
	Meteor.call('siptaxiCallsUpdate', asteriskUniqueId, data, function(error, result){
		if(error){
			return console.log('\n---> [siptaxiCalls]: UPSsss UN ERROR AL HACER UPDATE:',data, error);
		}
		if(result === 1){
			return console.log ('---> [siptaxiCalls]: ACTUALIZACION EXITOSA = ', result, ', asteriskUniqueId:', asteriskUniqueId, ' <---');

		}
		else{
			return console.log ('---> [siptaxiCalls]: ERROR ACTUALIZACION = ', result, ', asteriskUniqueId:', asteriskUniqueId, ' <---');
		}
	});
};
//***************************************************************************************************


//============================== RELACIONADOS CON CUSTOMERS ==============================
//---------------------------------------------------------------------------------------------------
// Funcion para Buscar si Existe Un Usuario con el Numero Telefonico.
customerFind = function(customerPhone){
	var data = null;
	console.log('---> [customers]: Buscando CLIENTE con Numero Telefonico: ',customerPhone,'<---');
		Meteor.call('customersFindPhone', customerPhone , function (error, result) {
			if (error){
				console.log('\n---> [customers]: UPSsss UN ERROR AL BUSCAR EL TELEFONO: ',customerPhone , error);
				return;
			}
			else {
				if (result){
					console.log ('---> [customers]: CLIENTE ENCONTRADO, SU DIRECCION ES: ', result.address,' <---');
					return data = result;
				}
				else{
					console.log ('---> [customers]: CLIENTE NO ENCONTRADO, Por TANTO ES UN CLIENTE NUEVO <---');
				return data = null;
				}
			}
		});
	return data;
};
//***************************************************************************************************


//============================== RELACIONADOS CON SERVICES ==============================
//---------------------------------------------------------------------------------------------------
// Funcion para Consultar el Numero de Servicios que ha Tenido el Numero Telefonico.
serviceCount = function(phone){
	var data = null;
	Meteor.call('servicesCount', phone , function (error, result) {
		if (error){
			console.log('\n---> [services]: UPSsss UN ERROR AL CONTAR LOS SERVICIOS EL TELEFONO: ',phone , error);
			return data = 0;
		}
		console.log ('---> [services]: El Telefono : ', phone, ' ha TENIDO ', result , ' servicios. <---');
		return data = result;
	});
	return data;
};
//***************************************************************************************************

//---------------------------------------------------------------------------------------------------
// Funcion Para Trer los ultimos 2 Servicios
servicesLast = function(phone){
	var data = null;
	Meteor.call('servicesLast', phone, function (error, result) {
		if (error){
			console.log('\n---> [services]: UPSsss UN ERROR AL TRAER LOS ULTIMOS 2 Servicios del Telefono: ',phone , error);
			return data = null;
		}
		console.log ('---> [services]: Se han Encontrado los Ultimos 2 servicios del Telefono :', phone, '<---');
		return data = result;
	});
	return data;
};
//***************************************************************************************************



//============================== RELACIONADOS CON PANELCALLS ==============================
//---------------------------------------------------------------------------------------------------
// Funcion para Insertar los Datos en la Coleccion Temporal de Panel Calls
panelCallsInsertNewCall = function(insertPanelCall){
	var data = null;
	Meteor.call('panelCallsInsert', insertPanelCall, function (error, result) {
		if (error){
				console.log('\n---> [panelCalls]: UPSsss UN ERROR AL INSERTAR NUEVA LLAMADA EN PANELCALLS', error);
				return data = null;
		}
		console.log('---> [panelCalls]: NEW DOCUMENT, id = ', result, '<---');
		return data = result;
	});
	return data;
}
//***************************************************************************************************

//---------------------------------------------------------------------------------------------------
// Funcion Para Actualizar Datos de la Coleccion PanelCalls
panelCallsUpdate = function (asteriskUniqueId, data){
	console.log('\n---> [panelCalls]: SE VA ACTUALIZAR ', data, ', asteriskUniqueId =', asteriskUniqueId, '<---')
	Meteor.call('panelCallsUpdate', asteriskUniqueId, data, function(error, result){
		if(error){
			return console.log('\n---> [panelCalls]: UPSsss UN ERROR AL HACER UPDATE:',data, error);
		}
		if(result === 1){
			return console.log ('---> [panelCalls]: ACTUALIZACION EXITOSA = ', result, ', asteriskUniqueId:', asteriskUniqueId, ' <---');

		}
		else{
			return console.log ('---> [panelCalls]: ERROR ACTUALIZACION = ', result, ', asteriskUniqueId:', asteriskUniqueId, ' <---');
		}
	});
};
//***************************************************************************************************


//---------------------------------------------------------------------------------------------------
// Funcion para Remove el Documento de PanelCalls
panelCallsRemove = function(asteriskUniqueId){
	Meteor.call('panelCallsRemove', asteriskUniqueId, function (error, result) {
		if(error){
			return console.log('\n---> [panelCalls]: UPSsss UN ERROR AL HACER REMOVE al asteriskUniqueId :',asteriskUniqueId, error);
		}
		return console.log ('---> [panelCalls]: Documento Borrado con asteriskUniqueId:', asteriskUniqueId, ' <---');
	});
};
//***************************************************************************************************



//============================RELACIONADOS CON ASTERISKCALLS =========================================
//---------------------------------------------------------------------------------------------------
// Funcion Para Actualizar Datos de la Coleccion AsteriskCalls
asteriskCallsUpdate = function (uniqueId, data){
	console.log('\n---> [asteriskCalls]: SE VA ACTUALIZAR ', data, ', uniqueId =', uniqueId, '<---')
	Meteor.call('asteriskCallsUpdate', uniqueId, data, function(error, result){
		if(error){
			return console.log('\n---> [asteriskCalls]: UPSsss UN ERROR AL HACER UPDATE:',data, error);
		}
		if(result === 1){
			return console.log ('---> [asteriskCalls]: ACTUALIZACION EXITOSA = ', result, ', uniqueId:', uniqueId, ' <---');

		}
		else{
			return console.log ('---> [asteriskCalls]: ERROR ACTUALIZACION = ', result, ', uniqueId:', uniqueId, ' <---');
		}
	});
};
//***************************************************************************************************





//============================== OTRAS FUNCIONES ==============================
//---------------------------------------------------------------------------------------------------
// Funcion Para Saber si es una Rellamada conociendo la fecha de la Ultima Llamada
isReCall = function(timestampHangup){
	if(!timestampHangup){
		return null;
	}
	var now = new Date().getTime();
	var diff = (now - timestampHangup)/1000;

	if (diff < 600){ // Tiempo para establecer rellamada ( 10 min Aprox )
		console.log('\n---> [SI ES UNA RELLAMADA] : La Diferencia en Tiempo con la Utima Llamada es = ', diff, ' sg <---');
		return true;
	}
	console.log('\n---> [NO ES UNA RELLAMADA] : La Diferencia en Tiempo con la Utima Llamada es = ', diff, ' sg <---');
	return false;
};
//***************************************************************************************************








