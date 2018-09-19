var http = require('http');
var requests=0;
var podname= process.env.HOSTNAME;
var startTime;
var host;
var handleRequest = function(request, response) {
  response.setHeader('Content-Type', 'text/plain');
  response.writeHead(200);
  response.write("!!!!!!!Welcome to SGX Demo!!!!\n");
  response.write("This is a an app that gives your the current pod that is serving the request!!!!\n");
  response.write("The request is served by: ");
  response.write(host);
  response.write("\nThe Application Build Number is 27");
  response.end("\nThank you for visting this page!!!!!!!!!!\n");
  console.log("Running On:" ,host, "| Total Requests:", ++requests,"| App Uptime:", (new Date() - startTime)/1000 , "seconds", "| Log Time:",new Date());
}
var www = http.createServer(handleRequest);
www.listen(8080,function () {
    startTime = new Date();;
    host = process.env.HOSTNAME;
    console.log ("Kubernetes Bootcamp App Started At:",startTime, "| Running On: " ,host, "\n" );
});
