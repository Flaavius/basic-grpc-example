import { 
  rpc,
} from "simple-grpc";

export interface ILogin {
  login: rpc<ICredentials, IToken>;
}

export interface ICredentials {
  username: string;
  password: string;
}

export interface IToken {
  token: string;
}

