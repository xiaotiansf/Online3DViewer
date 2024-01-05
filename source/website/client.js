import net from 'net'
var client = net.connect({port: 9838}, function() {
   console.log('connected to palacio-display-server!');
});

client.on('data', function(data) {
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
});

client.on('end', function() {
   console.log('disconnected from palacio-display-server');
});
