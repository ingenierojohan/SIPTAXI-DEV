// Inicializamos Los Usuaris del Sistema si no existen en la base de datos
if (Meteor.users.find().count() === 0) {
	console.log('---------->>> CREANDO USUARIOS DEL SISTEMA <<<----------');

	Accounts.createUser({
		username: 'johan',
		password: 'johan123',
		profile: {
			name: 'Johan Ramirez',
			rol: 'agent'
		}
	});

	Accounts.createUser({
		username: 'tobias',
		password: 'tob123',
		profile: {
			name: 'Tobias',
			rol: 'agent'
		}
	});

	Accounts.createUser({
		username: 'maricela',
		password: 'mar123',
		profile: {
			name: 'Maricela Giraldo',
			rol: 'agent'
		}
	});

	Accounts.createUser({
		username: 'leidy',
		password: 'lei123',
		profile: {
			name: 'Leidy Lopez',
			rol: 'agent'
		}
	});

	Accounts.createUser({
		username: 'kelly',
		password: 'kel123',
		profile: {
			name: 'Kelly Moreno',
			rol: 'agent'
		}
	});

	Accounts.createUser({
		username: 'bibiana',
		password: 'bib123',
		profile: {
			name: 'Bibiana Quintero',
			rol: 'agent'
		}
	});

	Accounts.createUser({
		username: 'admin',
		password: 'cootransceja123',
		profile: {
			name: 'Administrador',
			rol: 'admin'
		}
	});
}