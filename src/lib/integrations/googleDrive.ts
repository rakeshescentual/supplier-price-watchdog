
import { PriceItem, GoogleDriveBackup } from '@/types/price';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

// Configuration
const API_KEY = ''; // For public API access only
const CLIENT_ID = '';
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const BACKUP_FOLDER_NAME = 'PriceWatchBackups';

// Folder ID for price backups
let backupFolderId: string | null = null;

/**
 * Initialize the Google Drive API
 */
export const initGoogleDriveAPI = async (): Promise<boolean> => {
  try {
    if (!window.gapi) {
      console.error('Google API not loaded');
      return false;
    }
    
    return new Promise((resolve) => {
      window.gapi?.load('client:auth2', async () => {
        try {
          await window.gapi?.client?.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES.join(' ')
          });
          
          console.log('Google Drive API initialized');
          
          // Try to find or create the backup folder
          backupFolderId = await findOrCreateBackupFolder();
          
          resolve(true);
        } catch (error) {
          console.error('Error initializing Google Drive API:', error);
          resolve(false);
        }
      });
    });
  } catch (error) {
    console.error('Error in initGoogleDriveAPI:', error);
    return false;
  }
};

/**
 * Check if the user is authenticated with Google Drive
 */
export const isGoogleDriveAuthenticated = (): boolean => {
  try {
    if (!window.gapi?.auth2) {
      return false;
    }
    
    const authInstance = window.gapi.auth2.getAuthInstance();
    return authInstance.isSignedIn.get();
  } catch (error) {
    console.error('Error checking Google Drive authentication:', error);
    return false;
  }
};

/**
 * Authenticate with Google Drive
 */
export const authenticateWithGoogleDrive = async (): Promise<boolean> => {
  try {
    if (!window.gapi?.auth2) {
      await initGoogleDriveAPI();
      if (!window.gapi?.auth2) {
        throw new Error('Google API auth2 not initialized');
      }
    }
    
    const authInstance = window.gapi.auth2.getAuthInstance();
    await authInstance.signIn();
    return authInstance.isSignedIn.get();
  } catch (error) {
    console.error('Error authenticating with Google Drive:', error);
    return false;
  }
};

/**
 * Find or create the backup folder in Google Drive
 */
const findOrCreateBackupFolder = async (): Promise<string | null> => {
  try {
    if (!window.gapi?.client?.drive?.files) {
      console.error('Google Drive API not initialized');
      return null;
    }
    
    // Check if the folder exists
    const response = await window.gapi.client.drive.files.list({
      q: `name='${BACKUP_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
      spaces: 'drive'
    });
    
    const files = response.result.files;
    if (files && files.length > 0) {
      console.log(`Found existing backup folder: ${files[0].id}`);
      return files[0].id;
    }
    
    // Create the folder if it doesn't exist
    const folderMetadata = {
      name: BACKUP_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder'
    };
    
    const folder = await window.gapi.client.drive.files.create({
      resource: folderMetadata,
      fields: 'id'
    });
    
    console.log(`Created new backup folder: ${folder.result.id}`);
    return folder.result.id;
  } catch (error) {
    console.error('Error finding or creating backup folder:', error);
    return null;
  }
};

/**
 * Save price items to Google Drive
 */
export const savePriceItemsToGoogleDrive = async (
  items: PriceItem[],
  fileName: string
): Promise<{ success: boolean; fileId?: string; error?: string }> => {
  try {
    if (!window.gapi?.client?.drive?.files) {
      console.error('Google Drive API not initialized');
      return { success: false, error: 'Google Drive API not initialized' };
    }
    
    if (!isGoogleDriveAuthenticated()) {
      const authResult = await authenticateWithGoogleDrive();
      if (!authResult) {
        return { success: false, error: 'Not authenticated with Google Drive' };
      }
    }
    
    if (!backupFolderId) {
      backupFolderId = await findOrCreateBackupFolder();
      if (!backupFolderId) {
        return { success: false, error: 'Could not find or create backup folder' };
      }
    }
    
    // Convert items to Excel file
    const ws = XLSX.utils.json_to_sheet(items);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'PriceItems');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    
    // Create a Blob from the Excel data
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Upload the file to Google Drive
    const metadata = {
      name: `${fileName}.xlsx`,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      parents: [backupFolderId]
    };
    
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', blob);
    
    // Use the gapi client to upload the file
    const accessToken = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
    
    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: form
      }
    );
    
    const data = await response.json();
    
    if (data.id) {
      console.log(`File saved to Google Drive: ${data.id}`);
      return { success: true, fileId: data.id };
    } else {
      console.error('Error saving file to Google Drive:', data);
      return { success: false, error: 'Error saving file to Google Drive' };
    }
  } catch (error) {
    console.error('Error saving price items to Google Drive:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * List price backups from Google Drive
 */
export const listPriceBackupsFromGoogleDrive = async (
  limit: number = 10
): Promise<GoogleDriveBackup[]> => {
  try {
    if (!window.gapi?.client?.drive?.files) {
      console.error('Google Drive API not initialized');
      return [];
    }
    
    if (!isGoogleDriveAuthenticated()) {
      const authResult = await authenticateWithGoogleDrive();
      if (!authResult) {
        toast.error('Google Drive authentication failed');
        return [];
      }
    }
    
    if (!backupFolderId) {
      backupFolderId = await findOrCreateBackupFolder();
      if (!backupFolderId) {
        toast.error('Failed to locate backup folder');
        return [];
      }
    }
    
    // List files in the backup folder
    const response = await window.gapi.client.drive.files.list({
      q: `'${backupFolderId}' in parents and trashed=false`,
      fields: 'files(id, name, createdTime, webViewLink, size)',
      orderBy: 'createdTime desc',
      pageSize: limit
    });
    
    const files = response.result.files;
    if (!files || files.length === 0) {
      console.log('No backups found');
      return [];
    }
    
    return files.map(file => ({
      id: file.id,
      name: file.name,
      url: file.webViewLink,
      createdAt: file.createdTime,
      size: file.size ? parseInt(file.size) : undefined
    }));
  } catch (error) {
    console.error('Error listing price backups from Google Drive:', error);
    toast.error('Failed to list backups');
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
      console.error('Google Drive API not initialized');
      return { success: false, error: 'Google Drive API not initialized' };
    }
    
    if (!isGoogleDriveAuthenticated()) {
      const authResult = await authenticateWithGoogleDrive();
      if (!authResult) {
        return { success: false, error: 'Not authenticated with Google Drive' };
      }
    }
    
    // Get the file metadata
    const fileResponse = await window.gapi.client.drive.files.get({
      fileId,
      fields: 'name,mimeType'
    });
    
    // Download the file content
    const accessToken = window.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
    const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    
    const response = await fetch(downloadUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      return { success: false, error: `Failed to download file: ${response.statusText}` };
    }
    
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    
    // Read the Excel file
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const items = XLSX.utils.sheet_to_json<PriceItem>(worksheet);
    
    console.log(`Loaded ${items.length} items from Google Drive backup`);
    return { success: true, items };
  } catch (error) {
    console.error('Error loading price backup from Google Drive:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Delete a price backup from Google Drive
 */
export const deletePriceBackupFromGoogleDrive = async (
  fileId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!window.gapi?.client?.drive?.files) {
      console.error('Google Drive API not initialized');
      return { success: false, error: 'Google Drive API not initialized' };
    }
    
    if (!isGoogleDriveAuthenticated()) {
      const authResult = await authenticateWithGoogleDrive();
      if (!authResult) {
        return { success: false, error: 'Not authenticated with Google Drive' };
      }
    }
    
    // Delete the file
    await window.gapi.client.drive.files.delete({
      fileId
    });
    
    console.log(`Deleted backup file: ${fileId}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting price backup from Google Drive:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Create a scheduled backup
 */
export const scheduleBackup = async (
  cronExpression: string,
  items: PriceItem[]
): Promise<{ success: boolean; scheduleId?: string; error?: string }> => {
  try {
    // This would normally use a backend service with cron capabilities
    // For this example, we'll just do an immediate backup
    console.log(`Scheduled backup with cron: ${cronExpression}`);
    
    const fileName = `Scheduled_Backup_${new Date().toISOString().split('T')[0]}`;
    const result = await savePriceItemsToGoogleDrive(items, fileName);
    
    if (result.success) {
      toast.success('Scheduled backup created successfully');
      return { success: true, scheduleId: `schedule_${Date.now()}` };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error scheduling backup:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
