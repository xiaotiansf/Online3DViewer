import net from 'net'
var client = net.connect({port: 9838}, function() {
   console.log('connected to palacio-display-server!');
});

client.on('data', function(data) {
   console.log(data.toString());
   client.end();
});

client.on('end', function() {
   console.log('disconnected from palacio-display-server');
});
