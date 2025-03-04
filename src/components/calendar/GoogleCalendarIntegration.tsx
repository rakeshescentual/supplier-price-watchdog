
import { useState } from "react";
import { useFileAnalysis } from "@/contexts/FileAnalysisContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CalendarClock, BellRing, Plus, Check, Users, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const GoogleCalendarIntegration = () => {
  const { items, priceIncreaseEffectiveDate } = useFileAnalysis();
  const [isCreating, setIsCreating] = useState(false);
  const [eventTitle, setEventTitle] = useState("Price Update Effective Date");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState<Date>(priceIncreaseEffectiveDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [reminderTime, setReminderTime] = useState("1-week");
  const [addAttendees, setAddAttendees] = useState(false);
  const [attendees, setAttendees] = useState("");
  const [createdEvents, setCreatedEvents] = useState(0);
  
  const increasedItems = items.filter(item => item.status === 'increased');
  
  // Generate default description
  useState(() => {
    if (items.length > 0) {
      setEventDescription(`Price changes will take effect on this date. 
      
${increasedItems.length} items will increase in price.
${items.filter(item => item.status === 'decreased').length} items will decrease in price.
${items.filter(item => item.status === 'unchanged').length} items will have no price change.

Please ensure all systems and notifications are updated accordingly.`);
    }
  });
  
  const handleCreateEvent = async () => {
    if (!eventTitle.trim()) {
      toast.error("Event title required", {
        description: "Please enter a title for the calendar event.",
      });
      return;
    }
    
    setIsCreating(true);
    
    try {
      // In a real implementation, this would:
      // 1. Connect to Google Calendar API using OAuth
      // 2. Create the calendar event with reminders
      // 3. Add attendees if specified
      // 4. Return the created event details
      
      // For this demo, we'll simulate the API call
      console.log(`Creating calendar event "${eventTitle}" for ${format(eventDate, "PPP")}`);
      console.log(`Description: ${eventDescription}`);
      console.log(`Reminder: ${reminderTime}`);
      
      if (addAttendees && attendees.trim()) {
        console.log(`Attendees: ${attendees}`);
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCreatedEvents(prev => prev + 1);
      
      toast.success("Calendar event created", {
        description: `Event "${eventTitle}" has been added to your Google Calendar.`,
      });
    } catch (error) {
      console.error("Error creating calendar event:", error);
      toast.error("Failed to create event", {
        description: "There was an error connecting to Google Calendar. Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5" />
          Google Calendar Reminder
        </CardTitle>
        <CardDescription>
          Create calendar events for price update milestones
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!items.length ? (
          <div className="flex items-center justify-center py-6 text-center text-muted-foreground">
            <div>
              <AlertCircle className="mx-auto h-8 w-8 mb-2" />
              <p>Upload a price list first to use Calendar integration</p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-blue-50 p-3 rounded-md text-sm flex items-start gap-2 text-blue-700">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>
                To use Google Calendar integration, you'll need to authorize the app with your Google account.
                This allows creating calendar events with reminders.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="eventTitle">Event Title</Label>
                <Input
                  id="eventTitle"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Price Update Effective Date"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eventDate">Event Date</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarClock className="mr-2 h-4 w-4" />
                      {format(eventDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={eventDate}
                      onSelect={(date) => {
                        if (date) {
                          setEventDate(date);
                          setCalendarOpen(false);
                        }
                      }}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reminderTime">Reminder</Label>
                <Select 
                  value={reminderTime} 
                  onValueChange={setReminderTime}
                >
                  <SelectTrigger id="reminderTime">
                    <SelectValue placeholder="Select reminder time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30-min">30 minutes before</SelectItem>
                    <SelectItem value="1-hour">1 hour before</SelectItem>
                    <SelectItem value="1-day">1 day before</SelectItem>
                    <SelectItem value="1-week">1 week before</SelectItem>
                    <SelectItem value="2-week">2 weeks before</SelectItem>
                    <SelectItem value="1-month">1 month before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eventDescription">Description</Label>
                <Textarea
                  id="eventDescription"
                  className="min-h-[150px] resize-y"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="add-attendees"
                  checked={addAttendees}
                  onCheckedChange={setAddAttendees}
                />
                <Label htmlFor="add-attendees" className="cursor-pointer">Add attendees</Label>
              </div>
              
              {addAttendees && (
                <div className="space-y-2 pt-2">
                  <Label htmlFor="attendees" className="flex items-center justify-between">
                    Attendees
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 gap-1 text-xs"
                      onClick={() => {
                        toast.success("Address book opened", {
                          description: "Select contacts from your Google Contacts.",
                        });
                      }}
                    >
                      <Users className="h-3 w-3" />
                      Add from Contacts
                    </Button>
                  </Label>
                  <Input
                    id="attendees"
                    placeholder="email@example.com, another@example.com"
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple email addresses with commas
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {createdEvents > 0 && (
          <Badge variant="outline" className="flex gap-1.5 items-center">
            <Check className="h-3.5 w-3.5 text-green-500" />
            {createdEvents} event{createdEvents !== 1 ? 's' : ''} created
          </Badge>
        )}
        
        <Button
          onClick={handleCreateEvent}
          disabled={isCreating || !items.length || !eventTitle.trim()}
          className="ml-auto w-full sm:w-auto"
        >
          {isCreating ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin inline-block rounded-full border-2 border-current border-t-transparent"></span>
              Creating...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
