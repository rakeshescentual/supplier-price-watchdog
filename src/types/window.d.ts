
interface Window {
  gapi: {
    load: (libraries: string, callback: () => void) => void;
    client: {
      init: (config: any) => Promise<any>;
      drive: {
        files: {
          create: (params: any) => Promise<any>;
          list: (params: any) => Promise<any>;
          get: (params: any) => Promise<any>;
          delete?: (params: any) => Promise<any>;
        };
      };
    };
    auth2?: {
      getAuthInstance: () => {
        isSignedIn: {
          get: () => boolean;
        };
        signIn: () => Promise<any>;
        signOut: () => Promise<any>;
      };
    };
  };
}
