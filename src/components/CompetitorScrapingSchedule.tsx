
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Clock, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrapingSchedule } from "@/types/price";

interface CompetitorScrapingScheduleProps {
  isLoading: boolean;
  schedules: ScrapingSchedule[];
}

export const CompetitorScrapingSchedule = ({ 
  isLoading, 
  schedules 
}: CompetitorScrapingScheduleProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [scheduleName, setScheduleName] = useState("");
  const [scheduleUrl, setScheduleUrl] = useState("");
  const [scheduleTime1, setScheduleTime1] = useState("");
  const [scheduleTime2, setScheduleTime2] = useState("");

  const handleToggleSchedule = (id: string, current: boolean) => {
    toast.success(`Schedule ${current ? 'paused' : 'activated'}`, {
      description: `The scraping schedule has been ${current ? 'paused' : 'activated'}.`
    });
  };

  const handleAddSchedule = () => {
    if (!scheduleName || !scheduleUrl || !scheduleTime1 || !scheduleTime2) {
      toast.error("Missing information", {
        description: "Please fill all fields to create a schedule."
      });
      return;
    }
    
    toast.success("Schedule added", {
      description: `New scraping schedule for ${scheduleName} has been created.`
    });
    
    // Reset form and close dialog
    setScheduleName("");
    setScheduleUrl("");
    setScheduleTime1("");
    setScheduleTime2("");
    setShowDialog(false);
  };

  const handleDeleteSchedule = (id: string) => {
    toast.success("Schedule deleted", {
      description: "The scraping schedule has been removed."
    });
  };

  const handleRunNow = (id: string, name: string) => {
    toast.info(`Manual scrape initiated`, {
      description: `Scraping ${name} data. This may take a few minutes.`
    });
    
    // Simulate scrape completion after 3 seconds
    setTimeout(() => {
      toast.success(`Scrape completed`, {
        description: `Data from ${name} has been updated.`
      });
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Scraping Schedules</h2>
          <Skeleton className="h-10 w-40" />
        </div>
        
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Scraping Schedules</h2>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Scraping Schedule</DialogTitle>
              <DialogDescription>
                Set up a twice-daily schedule to scrape competitor prices.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Competitor Name</Label>
                <Input 
                  id="name" 
                  value={scheduleName} 
                  onChange={(e) => setScheduleName(e.target.value)} 
                  placeholder="e.g. Boots"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="url">Website URL</Label>
                <Input 
                  id="url" 
                  value={scheduleUrl} 
                  onChange={(e) => setScheduleUrl(e.target.value)} 
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="time1">First Scrape (24h)</Label>
                  <Input 
                    id="time1" 
                    type="time" 
                    value={scheduleTime1} 
                    onChange={(e) => setScheduleTime1(e.target.value)} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time2">Second Scrape (24h)</Label>
                  <Input 
                    id="time2" 
                    type="time" 
                    value={scheduleTime2} 
                    onChange={(e) => setScheduleTime2(e.target.value)} 
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
              <Button onClick={handleAddSchedule}>Create Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {schedules.length > 0 ? (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Competitor</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">{schedule.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    <a 
                      href={schedule.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 hover:underline"
                    >
                      {schedule.url}
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{schedule.times.join(' & ')}</span>
                    </div>
                  </TableCell>
                  <TableCell>{schedule.lastRun ? new Date(schedule.lastRun).toLocaleString() : 'Never'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={schedule.active} 
                        onCheckedChange={() => handleToggleSchedule(schedule.id, schedule.active)} 
                      />
                      <span>{schedule.active ? 'Active' : 'Paused'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRunNow(schedule.id, schedule.name)}
                      >
                        Run Now
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleDeleteSchedule(schedule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Schedules</CardTitle>
            <CardDescription>
              You haven't created any scraping schedules yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Create a schedule to automatically scrape competitor prices twice daily.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Schedule
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
