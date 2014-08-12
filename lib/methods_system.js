// Metedos Generales del Sistema
Meteor.methods({
	// Metodo para Obtener la Hora del Sistema
	getServerTime: function () {
		var time =  moment().format('H:mm:ss');
		return time;
	}
});