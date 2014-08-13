// PUBLICACION COLECCION panelCalls (Todos los docuemntos)
Meteor.publish('panelCalls', function() {
	console.log ('\n----------------------------------------------------------------');
	console.log('---> SE HAN SUSCRITO A PanelCalls <---');
	return PanelCalls.find();
});
//---------------------------------------------------------------------------------------------------

// PUBLICACION COLECCION addressReferences (Todos los Documentos), Para el typeHead
Meteor.publish('addressReferences', function() {
	console.log('---> SE HAN SUSCRITO A AddressReferences <---');
	return AddressReferences.find();
});
//---------------------------------------------------------------------------------------------------

// PUBLICACION COLECCION customersNames (Todos los Documentos), Para el typeHead
Meteor.publish('customersNames', function() {
	console.log('---> SE HAN SUSCRITO A CustomersNames <---');
	return CustomersNames.find();
});
//---------------------------------------------------------------------------------------------------

// Publicamos solo los Moviles y las Placas
Meteor.publish('movilAndPlaca', function(){
	console.log('---> SE HAN SUSCRITO A Taxis <---');
	return Taxis.find( { status:0 }, { fields : { movil:1, placa:1 } } );
});

//---------------------------------------------------------------------------------------------------

// Publicamos los servicios del Dia, contados desde las 00:00 del dia en curso
Meteor.publish('servicesDay', function(){
	// Hora Actual
	var now = new Date().getTime();

	// Hora a las 10 pm del dia en curso
	var day = moment(now).format('YYYY-MM-DD 22:00:00');
	var dayTimestamp = new Date(day).getTime();

	// Si la hora actual Ha pasado de las 10 pm se toma el day timestamp
	if (now > dayTimestamp){
		var setDay = dayTimestamp;
	}
	// si no, se toma desde las 10pm del dia anterior
	else{
		var setDay = dayTimestamp - (1000*60*60*24);
	}
	console.log('---> SE HAN SUSCRITO A Services Day INICIA a las :',moment(setDay).format('YYYY-MM-DD HH:mm:ss'),'<---');
	return Services.find( { timeLaunch : { $gt: setDay } } );
});
//---------------------------------------------------------------------------------------------------

// Publicamos los servicios cuyo status es 0=pendiente, 1=asigando
Meteor.publish('servicesActual', function(){
	console.log('---> SE HAN SUSCRITO A Services Actual, Status 0,1 <---');
	console.log('----------------------------------------------------------------\n');
	return Services.find({ status: { $in:[0,1] } } );
});
//---------------------------------------------------------------------------------------------------

/*// Publicamos La Busqueda de los Clientes
Meteor.publish('customersFindPhone', function(phone){
	console.log('---> SE HAN SUSCRITO A Customers Find Phone <---');
	return Customers.find({ phone : phone }, { sort : {updateAt : -1}});
});*/



//---------------------------------------------------------------------------------------------------
console.log ('\n----------------------------------------------------------------');
console.log ('---> Cantidad de Usuarios Creados =', Meteor.users.find().count());
console.log ('---> Numero de Documentos en la Coleccion asteriskCalls =', AsteriskCalls.find().count());
console.log ('---> Numero de Documentos en la Coleccion customers =', Customers.find().count());
console.log ('---> Numero de Documentos en la Coleccion customersNames =', CustomersNames.find().count());
console.log ('---> Numero de Documentos en la Coleccion addressReference =', AddressReferences.find().count());
console.log ('---> Numero de Documentos en la Coleccion taxis =', Taxis.find().count());
console.log ('---> Numero de Documentos en la Coleccion services =', Services.find().count());
console.log ('---> Numero de Documentos en la Coleccion panelCalls =', PanelCalls.find().count());
console.log ('---> Numero de Documentos en la Coleccion siptaxiCalls =', SiptaxiCalls.find().count());
console.log ('----------------------------------------------------------------\n');
//---------------------------------------------------------------------------------------------------