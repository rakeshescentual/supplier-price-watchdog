
export interface Webhook {
  id: string;
  topic: string;
  address: string;
  active: boolean;
  format: string;
  createdAt: string;
}

export interface WebhookDefinition {
  topic: string;
  description: string;
  recommended: boolean;
}
