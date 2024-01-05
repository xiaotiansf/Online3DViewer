import net from 'net'
const port = 9838;
const host = '127.0.0.1';
const timeout = 2000;
let retrying = false;

// Functions to handle socket events
function makeConnection (socket) {
   socket.connect(port, host);
}

export class ClientSocket
{
   constructor ()
   {
      this.socket = new net.Socket();
      this.filename = null;
      this.zoom = 1.0;
      this.panX = 0.0;
      this.panY = 0.0;
   }

   MakeConnection = () =>
   {
      this.socket.connect(port, host);
   }

   Init()
   {
      this.socket.on("connect", () => {
         console.log('connected');
         retrying = false;
      })
      this.socket.on("data", data => {
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
            this.filename = obj.filename;
         }
         else {
            console.log('received invalid string from palacio-display-server');
         }
      })
      this.socket.on("end", () => {
         console.log("Connection ended");
      })
      this.socket.on("timeout", () => {
         console.log('timeout');
      })
      this.socket.on("drain", () => {
         console.log('drain');
      })
      this.socket.on("error", () => {
         console.log('error');
      })
      this.socket.on("close", () => {
         console.log('close');
         if (!retrying) {
            retrying = true;
            console.log('Reconnecting...');
         }
         setTimeout(this.MakeConnection, timeout);
      })

      // Connect
      console.log('Connecting to ' + host + ':' + port + '...');
      this.MakeConnection();
   }
}
