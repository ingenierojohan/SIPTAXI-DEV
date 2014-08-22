Template.tabServicesDay.servicesDay = function(){
	return Services.find({}, {sort:{"serviceNum.total":-1}});
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