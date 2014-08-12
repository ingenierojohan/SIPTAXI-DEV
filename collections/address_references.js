// Coleccion para almacer address References
AddressReferences = new Meteor.Collection('addressReferences');

/*****************************************************************************************
MAPA de la Coleccion
------------------------------------------------------------------------------------------
id : "string"	--->	id del documento
addressReference : "string"	--->	nombre de la Referencia
------------------------------------------------------------------------------------------
******************************************************************************************/

Meteor.methods({
	// INSERTAMOS UN NUEVO DOCUMENTO
	addressReferencesInsert:function(data){
		var addressReference = {addressReference:data}
		AddressReferences.insert(addressReference);
	},
});