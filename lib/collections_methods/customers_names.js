// Coleccion para almacer nombres de ususarios para usar el Autocomplete
CustomersNames = new Meteor.Collection('customersNames');

/*****************************************************************************************
MAPA de la Coleccion
------------------------------------------------------------------------------------------
id : "string"	--->	id del documento
name : "string"	--->	nombre de clientes
------------------------------------------------------------------------------------------
******************************************************************************************/

/*****************************************************************************************
METODOS ASOCIADOS A LA COLECCION
------------------------------------------------------------------------------------------
******************************************************************************************/

Meteor.methods({
	// INSERTAMOS UN NUEVO DOCUMENTO
	customersNamesInsert:function(data){
		var name = {name:data}
		CustomersNames.insert(name);
	},
});