Template.dashboardAdmin.events({
	'click #btnSalir': function(e) {
		e.preventDefault();
		Meteor.logout();
		Router.go('/');
	}
});