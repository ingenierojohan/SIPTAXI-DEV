i18n.setLanguage('es');

Template.tabServicesDay.servicesDay = function(){
	return Services.find({}, {sort:{"serviceNum.total":-1}});
}

Template.tabServicesDay.tableSettings = function () {
	return{
		rowsPerPage: 6,
		showFilter: true,
		showNavigation: 'auto',
		rowClass : function(data){
			if (data.wasReallocate){
				return;
			}
			var status = data.status;
			switch (status){
				case 0 :
					return 'warning';
				case 1 :
					return 'info';
				case 2 :
					return 'sucess';
				default :
					return 'error';
			}
		},
		useFontAwesome: true,
		fields: [
			// SERVICES NUM TOTAL
			{	key : 'serviceNum.total',
				label : 'NRO',
				sort: 'descending',
				sortByValue : true,
				fn: function (value, object) { return numeral(value).format('0,0');} // Numeral No genera Orden
			},

			// SERVICES NUM DIA
			{	key : 'serviceNum.day',
				label : 'DIA',
				sortByValue : true,
				fn: function (value, object) { return numeral(value).format('0,0');}
			},

			// AGENTE
			{	key : 'agentName',
				label : 'AGENTE',
			},

			// STATUS
			{ key : 'status',
				label : 'ESTADO',
				tmpl : Template.tabServicesDayStatus
			},

			// TIME ALLOCATE
			{ key : 'timeAllocate',
				label : 'H-ASIG',
				tmpl : Template.tabServicesDayTimeAllocate
			},

			// TIME FINAL
			{ key : 'timeFinal',
				label : 'H-Final',
				tmpl : Template.tabServicesDayTimeFinal
			},

			// PHONE
			{ key : 'telefono',
				label : 'TELEFONO',
				/*tmpl : Template.tabServicesDayPhone,*/
				fn: function (value, object) { 
					/*return console.log('TO STRING', value.toString());*/
					var tel = object.customerPhone;
					if (!tel) return
					return object.customerPhone.toString();
				},
			},

			// NOMBRE
			{ key : 'customerName',
				label : 'NOMBRE'
			},

			// DIRECCION
			{ key : 'customerAddres',
				label : 'DIRECCION'
			},

			// REFERENCE
			{ key : 'customerReference',
				label : 'REFERENCIA'
			},

			// NOTAS CLIENTE
			{ key : 'customerComments',
				label : 'NOTAS CLIENTE'
			},

			// COD
			{ key : 'customerCod',
				label : 'NOMBRE',
				tmpl : Template.tabServicesDayCod
			},

			// TAXI MOVIL
			{ key : 'taxiMovil',
				label : 'MOVIL',
				tmpl : Template.tabServicesDayTaxiMovil
			},

			// NOTAS CLIENTE
			{ key : 'taxiPlaca',
				label : 'PLACA'
			},

			// NOTAS SERVICE
			{ key : 'comments',
				label : 'NOTAS SERVICIO'
			},

		]


	}
}



//******************************* HELPERS ****************************************
Template.tabServicesDay.helpers({
	//Llamamos a Funcion Que da color Y texto a los Estados de los Servicios (0=Pendiente, 1=Asignado, 2 = finalizado, 3=Cancelado, Reasigando )
	serviceRowStatus : function(){
		return serviceRowStatus(this);
	},

	countService : function(){
		if(!this.serviceNum){
			return;
		}
		return countService = {
			total : numeral(this.serviceNum.total).format('0,0'),
			day : numeral(this.serviceNum.day).format('0,0')
		}
	},
})