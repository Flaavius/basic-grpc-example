import { createClient, createClientCreds } from "simple-grpc";
import { ILogin } from "../protos/login";
import { join } from "path";

((async () => {

  const protoLoaderOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  };

  // accepts and array of Buffers or strings (truple) [ rootCerts, cert_chain, private_key ] 
  // or it can create an insecure connection if nothing is passed
  const credentials = createClientCreds();

  const loginService = createClient<ILogin>({
    url: "localhost", // url of the gRPC Server 
    port: "50051", // port of the gRPC server 
    protoPath: join(__dirname, ".." , "protos", "login.proto"), // root folder of your .protoFiles
    packageName: "login",  // packageName (what is defined in the .proto file as package)
    serviceName: "Login", // serviceName (what is defined in the .proto file as Service)
    options: protoLoaderOptions, // if not passed it will use the default values
    credentials, // if not passed it will create an insecure connection
    calls: [ "login" ] // the available rpc calls to that service defined in the .proto file
  });


  try {
    // you can then call the login function for the loginService :)
    // it will return a promise with the data or it Will throw an RPCError with code and details.
    const data = await loginService.login({ username: "JohnDoe", password: "awesomeSecretPassword" });
    console.log(JSON.stringify(data, undefined, 2));
  } catch ({ code, details }) {
    console.log("ERR", code, details);
  }

})());