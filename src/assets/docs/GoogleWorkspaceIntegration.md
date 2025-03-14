
# Google Workspace Integration

## Overview

The Supplier Price Watch application integrates with Google Workspace to provide enhanced functionality for customer communications and scheduling. This integration enables sending price increase notifications via Gmail and creating calendar events for price change effective dates.

## Authentication

The application uses OAuth 2.0 to authenticate with Google Workspace:

```typescript
interface GoogleAuthConfig {
  clientId: string;
  apiKey: string;
  scopes: string[];
  discoveryDocs: string[];
}

const DEFAULT_SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/drive.file'
];
```

## Key Integration Points

### 1. Gmail Integration

The Gmail integration enables sending price increase notifications to customers:

```typescript
interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  attachments?: {
    filename: string;
    content: string;
    contentType: string;
  }[];
}

const sendPriceNotification = async (
  notification: EmailNotification
): Promise<{success: boolean; messageId?: string}> => {
  // Create email with Gmail API
  // Send notification
  // Return success status and message ID
};
```

Notification templates are customizable and can include:
- Personalized customer information
- Lists of affected products
- Effective dates for price changes
- Supplier justification for changes
- HTML formatting for professional appearance

### 2. Calendar Integration

The Calendar integration allows scheduling events for price change effective dates:

```typescript
interface CalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  attendees?: {email: string}[];
  reminders?: {
    useDefault: boolean;
    overrides?: {method: string; minutes: number}[];
  };
}

const createEffectiveDateEvent = async (
  event: CalendarEvent
): Promise<{success: boolean; eventId?: string}> => {
  // Create calendar event
  // Set reminders and notifications
  // Return success status and event ID
};
```

Events can be configured with:
- Automatic reminders before price changes take effect
- Notification settings for relevant team members
- Links to relevant price change details
- Integration with Shopify scheduled price changes

### 3. Drive Integration

The Drive integration provides storage capabilities for price lists and analysis results:

```typescript
interface DriveFile {
  name: string;
  content: Blob | string;
  mimeType: string;
  parents?: string[]; // Folder IDs
}

const saveAnalysisToGoogleDrive = async (
  file: DriveFile
): Promise<{success: boolean; fileId?: string}> => {
  // Upload file to Google Drive
  // Set appropriate sharing permissions
  // Return success status and file ID
};
```

## Components

The Google Workspace integration includes several key components:

### 1. Authentication Component

The `GoogleShopifyAuth` component handles authentication with Google services:

```typescript
interface GoogleShopifyAuthProps {
  onGoogleAuthSuccess: (tokenResponse: any) => void;
  onGoogleAuthError: (error: Error) => void;
}
```

### 2. Gmail Integration Component

The `GmailIntegration` component provides the UI for email notification management:

```typescript
interface GmailIntegrationProps {
  priceChanges: PriceItem[];
  customerData?: CustomerData[];
  onNotificationSent: (result: {success: boolean; count: number}) => void;
}
```

### 3. Calendar Integration Component

The `GoogleCalendarIntegration` component handles scheduling of price-related events:

```typescript
interface GoogleCalendarIntegrationProps {
  priceChanges: PriceItem[];
  effectiveDate: Date;
  onEventCreated: (result: {success: boolean; eventId: string}) => void;
}
```

## Workflow Integration

The Google Workspace features are integrated into the main application workflow:

1. User uploads and analyzes a price list
2. User identifies significant price changes
3. User configures customer notifications via Gmail
4. User schedules effective date events in Calendar
5. Analysis results are optionally saved to Drive

## Error Handling

The integration includes comprehensive error handling:

- Authentication failures with clear error messages
- Retry logic for transient issues
- Graceful degradation when Google services are unavailable
- Detailed logging for troubleshooting

## Configuration

Google Workspace integration is configured through environment variables:

```
VITE_GOOGLE_CLIENT_ID=your_client_id_here
VITE_GOOGLE_API_KEY=your_api_key_here
VITE_GOOGLE_SCOPES=https://www.googleapis.com/auth/gmail.send,https://www.googleapis.com/auth/calendar
```

## Security Considerations

To ensure secure operation, the integration:

- Uses OAuth 2.0 with proper scope limitations
- Never stores Google credentials in application code
- Implements token refresh without requiring re-authentication
- Uses secure storage for temporary tokens
- Requests minimal permissions needed for functionality
