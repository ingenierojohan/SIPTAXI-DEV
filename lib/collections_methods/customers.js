// Coleccion de los Clientes
Customers = new Meteor.Collection('customers');

/*****************************************************************************************
MAPA de la Coleccion
------------------------------------------------------------------------------------------
_id : "string"	--->	id del documento
phone : "int32"	--->	Telefono del Cliente
name : "string"	--->	Nombre del Cliente
address : "string"	--->	Direccion del Cliente
addressReference : "string"	--->	Una Referencia de la Direccion (barrio, sitio)
cod : "int32"	--->	Codigo del Cliente, los 2 ultimos Digitos del Telefono
comments : "string"	---> Comentario Relacionado con el Cliente
createdAt	: "timestamp"	---> Hora y Fecha de Creacion del Documento 
------------------------------------------------------------------------------------------
******************************************************************************************/

/*****************************************************************************************
METODOS ASOCIADOS A LA COLECCION
------------------------------------------------------------------------------------------
******************************************************************************************/
Meteor.methods({
	// BUSCAR UN CLIENTE POR SU NUMERO TELEFONICO
	customersFindPhone : function (phone) {
		return customer = Customers.findOne({ phone : phone }, { sort : {createdAt : -1}});
	},

	// INSERTAMOS UN NUEVO DOCUMENTO
	customersInsert : function (data) {
		data.createdAt = new Date().getTime();
		data.updateAt = null;
		var insertCustomer = Customers.insert(data);
		return insertCustomer;
	},

	// ACTUALIZAR UN DOCUMENTO SABIENDO EL Id
	customersUpdate : function (phone, data){
		data.updateAt =	new Date().getTime();
		return Customers.update({phone : phone}, {$set: data});
	},
});

/*****************************************************************************************
FIXTURES ASOCIADOS A LA COLECCION
------------------------------------------------------------------------------------------
******************************************************************************************/
if(Meteor.isServer){
	Meteor.startup( function(){
		// Formato de Inicializacion de la Coleccion Customers Con el Phone 9999999
		if(Customers.find().count() === 0) {
			console.log('---------->>> CREANDO CUSTOMER MANUAL CON TEL 999 99 99 <<<----------');
			var customer = {
				phone : 9999999,
				cod : 99,
				createdAt : new Date().getTime()
			};
			var insertCustomer = Customers.insert(customer);
				console.log('---> [customers] --PRIMER CLIENTE 9999999 REGISTRADO id = ', insertCustomer, '<---\n');
		}
	});
}

