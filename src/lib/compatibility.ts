
/**
 * This file contains compatibility fixes for third-party libraries
 * and type declarations that need global modifications
 */

// Ensure window.gapi is always valid
if (typeof window !== 'undefined') {
  window.gapi = window.gapi || {
    load: (libraries, callback) => {
      console.warn('Mock gapi.load called - Google API not actually loaded');
      setTimeout(callback, 0);
    },
    client: {
      init: (config) => {
        console.warn('Mock gapi.client.init called - Google API not actually initialized');
        return Promise.resolve();
      },
      drive: {
        files: {
          create: (params) => {
            console.warn('Mock gapi.client.drive.files.create called');
            return Promise.resolve({ result: { id: 'mock-file-id', name: params?.resource?.name } });
          },
          list: (params) => {
            console.warn('Mock gapi.client.drive.files.list called');
            return Promise.resolve({ result: { files: [] } });
          },
          get: (params) => {
            console.warn('Mock gapi.client.drive.files.get called');
            return Promise.resolve({ result: { id: params?.fileId } });
          }
        }
      }
    }
  };
}

export const ensureCompatibility = () => {
  // This function can be called from main.tsx to ensure compatibility fixes are applied
  console.log('Compatibility fixes applied');
};
