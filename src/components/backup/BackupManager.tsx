
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { 
  initGoogleDriveAPI, 
  savePriceItemsToGoogleDrive, 
  listPriceBackupsFromGoogleDrive,
  loadPriceBackupFromGoogleDrive,
  deletePriceBackupFromGoogleDrive,
  isGoogleDriveAuthenticated,
  authenticateWithGoogleDrive
} from "@/lib/integrations/googleDrive";
import { Database, CloudUpload, CloudDownload, RefreshCw, Trash2, AlertCircle, Calendar } from "lucide-react";

export const BackupManager = () => {
  const { items, setItems } = useFileAnalysis();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [recentBackups, setRecentBackups] = useState<{ id: string; name: string; url: string }[]>([]);
  
  useEffect(() => {
    const initialize = async () => {
      const initialized = await initGoogleDriveAPI();
      setIsInitialized(initialized);
      
      if (initialized) {
        fetchRecentBackups();
      }
    };
    
    initialize();
  }, []);
  
  const fetchRecentBackups = async () => {
    try {
      const backups = await listPriceBackupsFromGoogleDrive();
      if (backups.length > 0) {
        setRecentBackups(backups);
      }
    } catch (error) {
      console.error("Error fetching recent backups:", error);
    }
  };
  
  const handleCreateBackup = async () => {
    if (items.length === 0) {
      toast.error("No data to backup", {
        description: "Please upload and analyze a price list first."
      });
      return;
    }
    
    setIsLoading(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);
    
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `Price_Backup_${timestamp}`;
      
      const result = await savePriceItemsToGoogleDrive(items, fileName);
      
      if (result.success) {
        clearInterval(interval);
        setProgress(100);
        
        // Refresh the backup list
        await fetchRecentBackups();
        
        // Clean up old backups (just fetch the latest ones)
        if (recentBackups.length > 20 && recentBackups[20]?.id) {
          await deletePriceBackupFromGoogleDrive(recentBackups[20].id);
        }
      } else {
        throw new Error("Backup failed");
      }
    } catch (error) {
      console.error("Error creating backup:", error);
      toast.error("Backup failed", {
        description: "Could not create backup. Please try again."
      });
    } finally {
      clearInterval(interval);
      setProgress(100);
      
      // Reset progress after a short delay
      setTimeout(() => {
        setProgress(0);
        setIsLoading(false);
      }, 500);
    }
  };
  
  const handleLoadBackup = async (fileId: string) => {
    setIsLoading(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);
    
    try {
      const result = await loadPriceBackupFromGoogleDrive(fileId);
      
      if (result.success && result.items) {
        setItems(result.items);
        
        clearInterval(interval);
        setProgress(100);
        
        toast.success("Backup loaded", {
          description: "Successfully loaded price data from backup."
        });
      } else {
        throw new Error("Loading backup failed");
      }
    } catch (error) {
      console.error("Error loading backup:", error);
      toast.error("Loading failed", {
        description: "Could not load backup data. Please try again."
      });
    } finally {
      clearInterval(interval);
      setProgress(100);
      
      // Reset progress after a short delay
      setTimeout(() => {
        setProgress(0);
        setIsLoading(false);
      }, 500);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Backup Management
        </CardTitle>
        <CardDescription>
          Backup and restore your price data using Google Drive
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!isInitialized ? (
          <div className="bg-amber-50 p-3 rounded-md text-sm text-amber-800 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              Google Drive integration is not initialized. Please connect your Google account first.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Create Backup</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCreateBackup}
                  disabled={isLoading || items.length === 0}
                >
                  <CloudUpload className="mr-2 h-4 w-4" />
                  {isLoading ? "Creating..." : "Backup Now"}
                </Button>
              </div>
              
              {isLoading && (
                <Progress value={progress} className="h-2" />
              )}
              
              <p className="text-xs text-muted-foreground">
                Create a backup of your current price analysis data in Google Drive.
              </p>
            </div>
            
            <div className="space-y-2 pt-2 border-t">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Recent Backups</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchRecentBackups}
                  disabled={isLoading}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              
              {recentBackups.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No recent backups found.</p>
              ) : (
                <ul className="space-y-2 max-h-[200px] overflow-y-auto">
                  {recentBackups.map((backup) => (
                    <li key={backup.id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{backup.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleLoadBackup(backup.id)}
                          disabled={isLoading}
                        >
                          <CloudDownload className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground"
                          asChild
                        >
                          <a href={backup.url} target="_blank" rel="noopener noreferrer">
                            <CloudDownload className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Backups are stored in your Google Drive account and are accessible only to you.
        </p>
      </CardFooter>
    </Card>
  );
};
