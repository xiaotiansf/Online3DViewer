import net from 'net'
const port = 9838;
const host = '127.0.0.1';
const timeout = 5000;
let retrying = false;

// Functions to handle socket events
function makeConnection () {
   socket.connect(port, host);
}

function connectEventHandler() {
   console.log('connected');
   retrying = false;
}

function dataEventHandler() {
   console.log(data.toString());
   let cmd_string = data.toString();
   let hashtag_index = cmd_string.indexOf('#{');
   if (hashtag_index > 0) {
      let json = cmd_string.slice(hashtag_index+1);
      const obj = JSON.parse(json);
      console.log(obj.filename);
      console.log(obj.info);
      console.log(obj.direction);
      console.log(obj.device_orientation);
      console.log(obj.display_mode);
      console.log(obj.zoom);
      console.log(obj.assetDir);
   }
   else {
      console.log('received invalid string from palacio-display-server');
   }
}

function endEventHandler() {
   console.log('end');
}

function timeoutEventHandler() {
   console.log('timeout');
}

function drainEventHandler() {
   // console.log('drain');
}

function errorEventHandler() {
   console.log('error');
}

function closeEventHandler () {
   console.log('close');
   if (!retrying) {
       retrying = true;
       console.log('Reconnecting...');
   }
   setTimeout(makeConnection, timeout);
}

// Create socket and bind callbacks
let socket = new net.Socket();
socket.on('connect', connectEventHandler);
socket.on('data',    dataEventHandler);
socket.on('end',     endEventHandler);
socket.on('timeout', timeoutEventHandler);
socket.on('drain',   drainEventHandler);
socket.on('error',   errorEventHandler);
socket.on('close',   closeEventHandler);

// Connect
console.log('Connecting to ' + host + ':' + port + '...');
makeConnection();
