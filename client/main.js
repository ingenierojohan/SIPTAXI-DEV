//********************************************************************************//
//+++++++++++++++++++++++++++++++ MAIN +++++++++++++++++++++++++++++++++++++++++++//
//********************************************************************************//

Meteor.startup( function () {

	//----------------------SUBSCRIPTIONS------------------------------------------
	// Subscripccion a todos documentos de PANELCALLS
	Meteor.subscribe('panelCalls');

	// Subscripcion a las Coleccions typeahead
	Meteor.subscribe('addressReferences');
	Meteor.subscribe('customersNames');
	Meteor.subscribe('movilAndPlaca');

	// Subscripcion Solo a los Servicios del Dia
	Meteor.subscribe('servicesDay');

	// Subscripcion Solo a los servicios cuyo status es 0=pendiente, 1=asigando
	Meteor.subscribe('servicesActual');

	//Meteor.subscribe('customersFindPhone',phone);

	//-------------------------------------------------------------------------

	//-------------------------------------------------------------------------
	// Metodo para Obtener la Hora del Server
	Meteor.setInterval( function (){
		Meteor.call('getServerTime', function (error, result) {
			Session.set('horaSistema', result);
		});
	},1000);
	//-------------------------------------------------------------------------

	// ------ TYPEAHEAD CUSTOMER NAMES
	Deps.autorun(function () {
		var customersNames = CustomersNames.find().fetch();
		var customerNamesTypeahead = _.pluck(customersNames, 'name');
		var typeaheadCustomerName = $('.typeaheadCustomerName').data('typeahead');
		if (typeaheadCustomerName){
			typeaheadCustomerName.source = customerNamesTypeahead;
		}
		else{
			$('.typeaheadCustomerName').typeahead({source:customerNamesTypeahead});
		}
		Session.set('typeaheadCustomerName', customerNamesTypeahead);
	});

	// ------ TYPEAHEAD CUSTOMER ADDRESS REFERENCE
	Deps.autorun(function () {
		var addressReference = AddressReferences.find().fetch();
		var customerAddressReferenceTypeahead = _.pluck(addressReference, 'addressReference');
		var typeaheadCustomerAddressReference = $('.typeaheadCustomerAddressReference').data('typeahead');
		if (typeaheadCustomerAddressReference){
			typeaheadCustomerAddressReference.source = customerAddressReferenceTypeahead;
			typeaheadCustomerAddressReference
		}
		else{
			$('.typeaheadCustomerAddressReference').typeahead({source:customerAddressReferenceTypeahead});
		}
	});

	//-------------------------------------------------------------------------
	// TYPEAHEAD MOVIL y PLACA
	Deps.autorun(function () {
		var taxis = Taxis.find().fetch();
		var typeaheadMovil = _.map(taxis, function(data){
			var movilyPlaca = '"'+data.movil+" -- "+data.placa+'"';
			return movilyPlaca;
		});
		Session.set('movilAndPlaca', typeaheadMovil);
	});
});

	// Funcion para Contar los Servicios del Dia y del Agente
	Deps.autorun(function () {
		// Contamos los Servicios mayores a 0 o sea diferente de PENDIENTE
		var countServicesDay = Services.find({ status: { $gt:0 } }).count();
		Session.set('countServicesDay', countServicesDay);

		// Contamos Los servicios del USUARIO Mayores a 0 o sea Diferentes a PENDIENTE
		var countServicesAgent = Services.find( { agentId:Meteor.userId(), status:{$gt:0} }).count();
		Session.set('countServicesAgent', countServicesAgent);
	});



//======================== FUNCIONES GENERALES ASOCIADAS A TEMPLATES==================================

// Obtener el Username del Agente
UI.registerHelper('usernameAgent', function() {
		return Meteor.user().profile.name
});
//-----------------------------------------------------------------------------------------------------

// Formato espacial al Telefono fijo (XXX XX XX), CEL (XXX)XXX XX XX
UI.registerHelper('formatCustomerPhone', function(phone) {
	var telefono = phone.toString();

	if (telefono.length==7){
		var primera = telefono.substring(3,0);
		var segunda = telefono.substring(5,3);
		var tercera = telefono.substring(5);
		var formatPhone = primera+' '+segunda+' '+tercera;
		return formatPhone;
	}
	if (telefono.length==10){
		var primera = telefono.substring(3,0);
		var segunda = telefono.substring(6,3);
		var tercera = telefono.substring(8,6);
		var cuarta = telefono.substring(8);
		var formatPhone = '('+primera+')'+segunda+' '+tercera +' '+cuarta;
		return formatPhone;
	}
	return phone;
});
//--------------------------------------------------------------------------------



//--------------------------------------------------------------------------------