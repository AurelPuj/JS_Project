const R = require('ramda');

const {marketEvent,launchEmitter} =require ('./Event');
const {transporterHandler,initTrucks} = require ('./Transporter');

initTrucks(2);
marketEvent.on('New Offer', transporterHandler);
launchEmitter();