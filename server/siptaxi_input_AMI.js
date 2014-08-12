// ADMINISTRACION DE LOS EVENTOS ENVIADOS POR AMI (asterisk Manager Interface)

//***************************************************************************************************
//---------------------------------------------------------------------------------------------------
// Escuchamos todos los Eventos del Asterisk
//ami.on('managerevent', printAllEvents);
ami.on('newchannel', Meteor.bindEnvironment(evaluateNewChannel, evaluateNewChannelErr));		// Manejo de llamadas Entrantes
ami.on('newstate', Meteor.bindEnvironment(evaluateNewState, evaluateNewStateErr));					// Manejo de los Estados de las Llamadas
ami.on('hangup', Meteor.bindEnvironment(evaluateHangupChannel, evaluateHangupChannelErr));	// Manejo de las Llamadas Colgadas
//ami.on('hangup', printAllEvents);
//---------------------------------------------------------------------------------------------------
//***************************************************************************************************


//***************************************************************************************************
//---------------------------------------------------------------------------------------------------
// Creamos una expresion regular para comparar con los eventos AMI de NEW CHANNEL y HANGUP
var trunkSIP = "^SIP/UNE-2486385-"; // Phone On Line Pruebas
//var trunkSIP = "^SIP/UNE-5207370-"; // Trunk SIP COOTRANSCEJA
var re = new RegExp(trunkSIP);
//---------------------------------------------------------------------------------------------------
//***************************************************************************************************


//***************************************************************************************************
//---------------------------------------------------------------------------------------------------
// Funcion de para Imprimir todos los eventos ami
function printAllEvents (evt){
	if(evt.channel){
		if (evt.channel.match(re) && evt.exten!=""){
			console.log ('\n------ >> EVENTO <<------');
			console.log (evt);
			console.log ('------------------------ \n');
		}
	}
};
//---------------------------------------------------------------------------------------------------
//***************************************************************************************************


//***************************************************************************************************
//---------------------------------- EVALUATE NEW CHANNEL -------------------------------------------
// Funcion para Evaluar las Llamadas Entrantes desde ami.on
function evaluateNewChannel(evt){
	if (evt.channel.match(re)&& evt.exten!=""){

		// --------- Variables de la Funcion ----------------
		var timeNow = new Date().getTime();
		var asteriskChannel = evt.channel;
		var asteriskPhone = parseInt(evt.calleridnum);
		var asteriskUniqueId = evt.uniqueid;
		var customer = null;
		var customerCod = asteriskPhone % 100;

		console.log('\n\n>>>>>> INGRESA UNA NUEVA LLAMADA DEL TELEFONO: ', asteriskPhone , ' <<<<<<');

		// Llamamos La Funcion siptaxiCallCount para saber cuantas llamadas a tenido el Telefono asteriskPhone
		var callCount = siptaxiCallCount(asteriskPhone);

		// Consultamos toda la Info de la Ultima LLamada del Telefono
		var callLast = siptaxiCallLast(asteriskPhone);




		// ----------------  Establecemos Un Nuevo Documento para siptaxiCalls  --------------------------------
		var newSiptaxiCall = {
			//_id : asteriskUniqueId,
			timestampIncoming : timeNow,
			timestampHangup : '',
			phone : asteriskPhone,
			asteriskChannel : asteriskChannel,
			asteriskUniqueId : asteriskUniqueId,
			agentId : '',
			agentName : '',
			agentExten : null,
			wasAnswer : false
		};

		// Llamamos A Funcion para Insertar los Datos en siptaxiCalls
		var siptaxiCallId = siptaxiCallsInsertNewCall(newSiptaxiCall);
//---------------------------------------------------------------------------------------------------------

		// ----------------  Establecemos Un Nuevo Documento para panelCalls  --------------------------------
		var newPanelCall ={
			//_id : asteriskUniqueId,
			agentExten : null,
			customerPhone : asteriskPhone,
			customerCod : customerCod,
			siptaxiCallId : siptaxiCallId,
			siptaxiCallAsteriskUniqueId : asteriskUniqueId
		};

		// Guardamos la Cantidad de Llamadas que ha Tenido el Telefono
		newPanelCall.siptaxiCallCount = callCount;

		// Consultamos la Info de la Ultima LLamada si existe.
		if (newPanelCall.siptaxiCallCount === 0 ){
			newPanelCall.siptaxiCallLast = null;
		}
		else {
			// Consultamos la Ultima LLamada del Telefono
			newPanelCall.siptaxiCallLast = callLast;
			// Marcamos TRUE/FALSE si es una Rellamada
			newPanelCall.isRecall = isReCall(newPanelCall.siptaxiCallLast.timestampHangup);
		}

		// -----Buscamos si existe un Cliente con el numero telefonico.
		customer = customerFind(asteriskPhone);

		// Validamos Si el Cliente EXISTE
		if (!customer){
			newPanelCall.isNewCustomer = true;
		}
		else{
			// Llenamos Los Datos de Customer en Panel Calls
			newPanelCall.isNewCustomer = false;
			newPanelCall.customerId = customer._id;
			newPanelCall.customerName = customer.name;
			newPanelCall.customerAddress = customer.address;
			newPanelCall.customerAddressReference = customer.addressReference;
			newPanelCall.customerComments = customer.comments;

			// Buscamos Cuantos Servicios ha Tenido el Numero Telefonico
			newPanelCall.serviceCount = serviceCount(asteriskPhone);

			// Consultamos Los ultimos 2 Servicios
			if (newPanelCall.serviceCount === 0) {
				newPanelCall.servicesLasts = null;
			}
			else{
				newPanelCall.servicesLast = servicesLast(asteriskPhone);
			}
		} // fin de la Validacion si Cliente Existe

//---------------------------------------------------------------------------------------------------------

		newPanelCall.state = 4;		// es estado 4 es Timbrando segun Asterisk, 6 = hablando;

		// Llamamos A Funcion para Insertar los Datos en panelCalls
		panelCallsInsertNewCall(newPanelCall);
	}// Fin del IF Pricipal

	// SI NO PASA LA EVALUACION DEL NEWCHANNEL
	else {
		console.log ("\n>>>>>> SE DETECTO UN NEW CHANNEL PERO NO ES LLAMADA ENTRANTE <<<<<<");
	}
};

// Funcion Callback de error cuando falla el bind.Environment Fiber
function evaluateNewChannelErr(err){
	console.log('\n***** FALLO TO BIND ENVIRONMENT EN evaluateNewChannel', err);
};

//***************************************************************************************************
//---------------------------------------------------------------------------------------------------




//***************************************************************************************************
//---------------------------------- EVALUATE NEW STATE ---------------------------------------------
//---------------------------------------------------------------------------------------------------
//------ Evaluamos Los Nuevos ESTADOS desde ami.ON
function evaluateNewState(evt){
	// Comparamos si el Channel pasa la expresion Regular y si no es una llamada saliente
	if (evt.channel.match(re)&& evt.exten!=""){
		var newState = {};
		var asteriskUniqueId = evt.uniqueid;
		var asteriskChannelStateDesc = evt.channelstatedesc;
		newState.state =  parseInt(evt.channelstate);
		newState.agentExten = parseInt(evt.connectedlinenum);

		console.log('\n>>>>>> NEWSTATE del TEL:',evt.calleridnum,' [',newState.state, '=', asteriskChannelStateDesc, '] <<<<<<');
		// Evaluamos el Estado 6 = Contestado  STATUS : 0=Colgado, 4=Timbrando, 6=Hablando
		if(newState.state === 6){
			console.log(">>>>>> CONTESTO LA EXTENSION [",newState.agentExten,'] <<<<<<');

			//Actualizamos panelCalls
			panelCallsUpdate(asteriskUniqueId, newState);

			// Actualizamos SiptaxiCall
			var siptaxiCallData = {
				wasAnswer : true,
				agentExten : newState.agentExten
			};
			siptaxiCallsUpdate(asteriskUniqueId, siptaxiCallData);
		}
		return;
	}
	else{
		console.log ("\n>>>>>> SE DETECTO UN NEW STATE PERO NO ES DE LA LLAMADA ENTRANTE <<<<<<");
	return;
	}
};

function evaluateNewStateErr(err){
	console.log('\n\n***** FALLO TO BIND ENVIRONMENT en evaluateNewState', err);
};
//---------------------------------------------------------------------------------------------------
//***************************************************************************************************



//***************************************************************************************************
//---------------------------------- EVALUATE HANGUP ---------------------------------------------
//---------------------------------------------------------------------------------------------------
function evaluateHangupChannel(evt){
	if (evt.channel.match(re)){
		var timestampHangup = new Date().getTime();
		var asteriskchannel = evt.channel;
		var phone = evt.calleridnum;
		var asteriskUniqueId = evt.uniqueid;
		console.log('\n>>>>>> SE HA COLGADO LA LLAMADA DEL TEL: ', phone, '<<<<<<');

		//Datos para Actualizar documentos en la Coleccion asteriskCalls por HANGUP
		var asteriskCallsData= {
			timestampHangup: timestampHangup,
			status : '2'
		};
		asteriskCallsUpdate(asteriskUniqueId, asteriskCallsData);

		//Datos para Actualizar documentos en la Coleccion siptaxiCalls por HANGUP
		var siptaxiCallData = {
			timestampHangup : timestampHangup,
		};
		siptaxiCallsUpdate(asteriskUniqueId, siptaxiCallData);

		//Datos para Actualizar documentos en la Coleccion siptaxiCalls por HANGUP
		var panelCallData = {state : 0}
		panelCallsUpdate(asteriskUniqueId, panelCallData);

		// Retrasamos el Remove del Documento en el panelCalls.
		Meteor.setTimeout(function(){panelCallsRemove(asteriskUniqueId);}, 2000);
	}
};

// Funcion Callback de error cuando falla el bind.Environment Fiber
function evaluateHangupChannelErr(err){
	console.log('\n\n***** FALLO TO BIND ENVIRONMENT EN evaluateHangupChannel', err);
};

//***************************************************************************************************
//---------------------------------------------------------------------------------------------------