declare module 'mongodb-uri' {
  interface MongoDbHost {
    host: string;
    port: number;
  }

  interface MongoDbUri {
    scheme: string;
    username?: string;
    password?: string;
    hosts: MongoDbHost[];
    database?: string;
    options?: Record<string, string>;
  }

  export function parse(uri: string): MongoDbUri;
  export function format(uriObject: MongoDbUri): string;
} 