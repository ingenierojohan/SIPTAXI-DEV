/*ServicesDayFilter = new Meteor.FilterCollections(Services,{
	name : 'servicesDay',
	template : 'tabServicesDay',
	sort : {
		order : ['desc', 'asc'],
		defaults : [ 
			['serviceNum.day', 'desc']
		]
	},
	filters:{}
});*/

/*mrt var page = new Pagination("myFirstPagination");

page.go(2);
Template.tabServicesDay.servicesDay = function(){
	return Services.find({}, {sort:{"serviceNum.total":-1}}, page.skip() );
}

Template.tabServicesDay.pager = function(){
	return page.create(Services.find().count());
}

Template.tabServicesDay.destroyed = function () {
	page.destroy();
};*/

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
		return countService = {
			total : numeral(this.serviceNum.total).format('0,0'),
			day : numeral(this.serviceNum.day).format('0,0')
		}
	},
})