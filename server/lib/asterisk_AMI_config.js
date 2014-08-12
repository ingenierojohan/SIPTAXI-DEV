/*****************************************************************************************
CONFIGURACION ASTERISK MANAGER INTERFACE
------------------------------------------------------------------------------------------
******************************************************************************************/
// Inicializacion del Asterisk Manager
ami = new (Meteor.require('asterisk-manager'))
	('5038'			// port
	,'localhost'		// host
//	,'admin_mgr'	// username COOTRANSCEJA
//	,'L7J6N7'		// password COOTRANSCEJA
	,'admin_mgr'	// username VM
	,'QE6HRM'		// password VM
	,true );			// This parameter determines whether events are emited.