import { 
  createServer, 
  ISetup,
  IProtoService, 
  RPCError, 
  createServerCreds
} from "basic-grpc";

import { join } from "path";
import { ILogin } from "../protos/login";
import { 
  createError, 
  ErrorType 
} from "./errors";


((async () => {

  const generateToken = (data: any): string => {
    // generate a token
    return `superAwesomeGeneratedTokenFor: ${data}`;
  };
  
  const loginService: IProtoService<ILogin> = {
    protoFile: "login.proto", // the .proto fileName
    packageName: "login", // packageName (what is defined in the .proto file as package)
    serviceName: "Login",  // serviceName (what is defined in the .proto file as Service)
    handlers: { // the function handlers for every rpc call
      login: async ({ username, password }) => {

        if(!username || !password) {
          console.log(`Invalid Data`);
          throw new RPCError(createError(ErrorType.INVALID_BODY));
        }

        console.log(`Login Request for: ${username} with password: ${password}`);
        if(password === "awesomeSecretPassword") 
          return  {
            token: generateToken(username)
          };
          
        // you can throw an RPCError  with a code and details for the error 
        // the first 15 are gRPC generic you can add custom errors from 15+
        // see: https://github.com/grpc/grpc/blob/master/doc/statuscodes.md
        throw new RPCError(createError(ErrorType.INVALID_PASSWORD));
      }
    },
  };

  const gRPCSetup: ISetup = {
    protoRoot: join(__dirname, "..", "protos"), // root folder where all your .proto files live
    services: [ // a list of services for this particular server
      loginService
    ]
  };

  // options for the protoloader
  const protoLoaderOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  };

  // the host of your gRPC server
  const domain = "localhost:50051";

  // accepts and array of Buffers or strings (truple) [ rootCerts, cert_chain, private_key ] 
  // or it can create an insecure connection if nothing is passed
  const credentials = createServerCreds();

  // returns a gRPC server instance 
  const server = createServer({
    gRPCSetup,
    domain,
    options: protoLoaderOptions, // if not passed it will use the default values
    credentials, // if not passed it will create an insecure connection
  });
  
  // starts the server :)
  server.start();
  console.log("Server Started");
})());