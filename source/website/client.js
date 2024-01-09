import WebSocket from 'ws';
import { Website } from './website';
const timeout = 5000;
let retrying = false;
const ws = new WebSocket('ws://127.0.0.1:9839');

// Functions to handle socket events
function MakeConnection () {
   ws.on('open', function open() {
      ws.send('Hello, server!');
      console.log('connected to palacio-display-server!');
      retrying = false;
   });
}

export class ClientSocket
{
   constructor (website)
   {
      this.filename = null;
      this.zoom = 1.0;
      this.panX = 0.0;
      this.panY = 0.0;
      this.website = website;
   }

   Init()
   {
      ws.on('message', function message(data) {
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
            this.website.LoadModelFromFileList(this.filename);
         }
         else {
            console.log('received invalid string from palacio-display-server');
         }
      })

      ws.on('close', function close() {
         console.log('Connection closed');
         if (!retrying) {
            retrying = true;
            console.log('Reconnecting...');
         }
         setTimeout(MakeConnection, timeout);
      })

      // Connect
      console.log('Connecting to ws://127.0.0.1:9839...');
      MakeConnection();
   }
}
