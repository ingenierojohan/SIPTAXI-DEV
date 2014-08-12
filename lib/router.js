// CONFIGURACION ROUTER en IRON ROUTER
//***************************************************************************************************
//---------------------------------------------------------------------------------------------------
Router.configure({
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound'
});
//---------------------------------------------------------------------------------------------------
//***************************************************************************************************

//***************************************************************************************************
//---------------------------------------------------------------------------------------------------
// Filtros de autentificacion y otros Filtros
var filters = {
	authGeneral : function(pause){
		if (!Meteor.user()) {
			console.log('>>>> !!! NO ESTOY REGISTRADO !!! ... VAMOS PARA login.html <<<<');
			this.render('login');
			pause();
		}
	},

	authAgent : function(pause){
		var user = Meteor.user();
		if (user.profile.rol == "agent") {
			console.log('>>>> BIENVENIDO ',user,' ERES UN: ',user.profile.rol,' VAMOS PARA dashboardAgent.html<<<<');
			this.render('dashboardAgent');
			pause();
			return;
		}
		console.log('>>>> BIENVENIDO ',user,' ERES UN: ',user.profile.rol,' VAMOS PARA dashboardAdmin.html<<<<');
		this.render('dashboardAdmin');
		pause();
		return;
	},

	authAdmin : function(pause){
		var user = Meteor.user();
		if (user.profile.rol == "admin") {
			console.log('>>>> LO SIENTO.... NO TIENE PERMISO PARA ESTAR AQUI --- VAMOS para dashboardAdmin.html <<<<');
			this.render();
			pause();
			return;
		}
		console.log('>>>> LO SIENTO.... NO TIENE PERMISO PARA ESTAR AQUI --- VAMOS para dashboardAgent.html <<<<');
		this.render('dashboardAgent');
		pause();
	}
};
//---------------------------------------------------------------------------------------------------
//***************************************************************************************************


//***************************************************************************************************
//---------------------------------------------------------------------------------------------------
// MAPEADO DE RUTAS
Router.map(function() {
	this.route('login', {
		path: '/',
		onBeforeAction: [filters.authGeneral, filters.authAgent, filters.authAgent]
	});

	this.route('dashboardAgent', {
		onBeforeAction: [filters.authGeneral, filters.authAgent]
	});

	this.route('reporteGerencia',{
		onBeforeAction: [filters.authGeneral]
	});

	this.route('dashboardAdmin', {
		onBeforeAction: [filters.authGeneral, filters.authAdmin]
	});
});
//---------------------------------------------------------------------------------------------------
//***************************************************************************************************