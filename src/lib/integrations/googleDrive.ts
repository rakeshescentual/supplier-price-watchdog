
import { toast } from 'sonner';
import type { PriceItem } from '@/types/price';

/**
 * Initialize the Google Drive API for file operations
 */
export const initGoogleDriveAPI = async (apiKey: string = ''): Promise<boolean> => {
  try {
    console.log('Initializing Google Drive API...');
    
    return new Promise((resolve) => {
      // Load the Google API client library
      window.gapi.load('client:auth2', async () => {
        try {
          await window.gapi.client.init({
            apiKey: apiKey || 'mock-api-key',
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
            clientId: 'mock-client-id.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/drive.file'
          });
          
          console.log('Google Drive API initialized successfully');
          resolve(true);
        } catch (error) {
          console.error('Error initializing Google Drive API:', error);
          resolve(false);
        }
      });
    });
  } catch (error) {
    console.error('Error loading Google Drive API:', error);
    return false;
  }
};

/**
 * Check if user is authenticated with Google Drive
 */
export const isGoogleDriveAuthenticated = (): boolean => {
  try {
    if (!window.gapi?.auth2) return false;
    
    const authInstance = window.gapi.auth2.getAuthInstance();
    return authInstance && authInstance.isSignedIn.get();
  } catch (error) {
    console.error('Error checking Google authentication status:', error);
    return false;
  }
};

/**
 * Authenticate with Google Drive
 */
export const authenticateWithGoogleDrive = async (): Promise<boolean> => {
  try {
    if (!window.gapi?.auth2) {
      console.error('Google Auth API not loaded');
      return false;
    }
    
    const authInstance = window.gapi.auth2.getAuthInstance();
    await authInstance.signIn();
    
    const isSignedIn = authInstance.isSignedIn.get();
    if (isSignedIn) {
      toast.success('Authenticated with Google Drive', {
        description: 'You can now backup and restore your price lists.'
      });
    }
    
    return isSignedIn;
  } catch (error) {
    console.error('Error authenticating with Google Drive:', error);
    toast.error('Google Drive Authentication Failed', {
      description: 'Unable to authenticate with Google Drive. Please try again.'
    });
    return false;
  }
};

/**
 * Save price items to Google Drive as a backup
 */
export const savePriceItemsToGoogleDrive = async (
  items: PriceItem[],
  filename: string = `Price_Backup_${new Date().toISOString().slice(0, 10)}`
): Promise<{ success: boolean; fileId?: string; error?: string }> => {
  try {
    if (!window.gapi?.client?.drive?.files) {
      return { success: false, error: 'Google Drive API not initialized' };
    }
    
    // Prepare file content
    const fileContent = JSON.stringify(items, null, 2);
    const file = new Blob([fileContent], { type: 'application/json' });
    
    // Upload file to Google Drive
    const response = await window.gapi.client.drive.files.create({
      resource: {
        name: filename,
        mimeType: 'application/json',
        description: `Price backup containing ${items.length} items created by Escentual Price Manager`
      },
      media: {
        mimeType: 'application/json',
        body: file
      }
    });
    
    const result = response.result;
    
    if (result && result.id) {
      toast.success('Backup Saved to Google Drive', {
        description: `Successfully saved ${items.length} items to ${filename}`
      });
      return { success: true, fileId: result.id };
    } else {
      return { success: false, error: 'Failed to save backup: No file ID returned' };
    }
  } catch (error) {
    console.error('Error saving to Google Drive:', error);
    toast.error('Backup Failed', {
      description: 'Unable to save backup to Google Drive. Please try again.'
    });
    return { success: false, error: String(error) };
  }
};

/**
 * List all price backups from Google Drive
 */
export const listPriceBackupsFromGoogleDrive = async (): Promise<any[]> => {
  try {
    if (!window.gapi?.client?.drive?.files) {
      toast.error('Google Drive API not initialized', {
        description: 'Please authenticate with Google Drive first.'
      });
      return [];
    }
    
    const response = await window.gapi.client.drive.files.list({
      q: "mimeType='application/json' and name contains 'Price_Backup'",
      spaces: 'drive',
      fields: 'files(id, name, createdTime, size, webViewLink)',
      orderBy: 'createdTime desc'
    });
    
    const files = response.result.files || [];
    return files.map(file => ({
      id: file.id,
      name: file.name,
      createdAt: file.createdTime,
      size: file.size,
      url: file.webViewLink
    }));
  } catch (error) {
    console.error('Error listing backups from Google Drive:', error);
    toast.error('Failed to list backups', {
      description: 'Could not retrieve backups from Google Drive.'
    });
    return [];
  }
};

/**
 * Load a price backup from Google Drive
 */
export const loadPriceBackupFromGoogleDrive = async (
  fileId: string
): Promise<{ success: boolean; items?: PriceItem[]; error?: string }> => {
  try {
    if (!window.gapi?.client?.drive?.files) {
      return { success: false, error: 'Google Drive API not initialized' };
    }
    
    // First get the download URL
    const fileResponse = await window.gapi.client.drive.files.get({
      fileId: fileId,
      alt: 'media'
    });
    
    // Parse the response
    const items = JSON.parse(fileResponse.body);
    
    if (Array.isArray(items)) {
      toast.success('Backup Loaded Successfully', {
        description: `Loaded ${items.length} items from Google Drive backup`
      });
      return { success: true, items };
    } else {
      toast.error('Invalid Backup Format', {
        description: 'The backup file contains invalid data format.'
      });
      return { success: false, error: 'Invalid backup format' };
    }
  } catch (error) {
    console.error('Error loading backup from Google Drive:', error);
    toast.error('Failed to Load Backup', {
      description: 'Could not load the selected backup from Google Drive.'
    });
    return { success: false, error: String(error) };
  }
};

/**
 * Delete a price backup from Google Drive
 */
export const deletePriceBackupFromGoogleDrive = async (
  fileId: string
): Promise<boolean> => {
  try {
    if (!window.gapi?.client?.drive?.files) {
      toast.error('Google Drive API not initialized', {
        description: 'Please authenticate with Google Drive first.'
      });
      return false;
    }
    
    // Check if the delete method exists
    if (!window.gapi.client.drive.files.delete) {
      console.error('Drive API delete method not available');
      toast.error('Delete not supported', {
        description: 'The delete functionality is not available in this version.'
      });
      return false;
    }
    
    // Delete the file
    await window.gapi.client.drive.files.delete({
      fileId: fileId
    });
    
    toast.success('Backup Deleted', {
      description: 'The selected backup has been permanently deleted.'
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting backup from Google Drive:', error);
    toast.error('Failed to Delete Backup', {
      description: 'Could not delete the selected backup from Google Drive.'
    });
    return false;
  }
};
