
/**
 * AI Model Deployment Service
 * Tracks deployment status of AI models in Azure AI Foundry
 */

export interface DeploymentStatus {
  modelId: string;
  status: 'pending' | 'deployed' | 'failed';
  deployedAt?: Date;
  tokensPerMinute?: number;
  contentFilterLevel?: string;
  endpoint?: string;
  lastChecked: Date;
}

// In-memory store of deployment statuses
const deploymentStatuses: Record<string, DeploymentStatus> = {
  'gpt-4o': {
    modelId: 'gpt-4o',
    status: 'deployed',
    deployedAt: new Date('2024-11-25'),
    tokensPerMinute: 450000,
    contentFilterLevel: 'DefaultV2',
    endpoint: 'https://fb-consulting-ai.openai.azure.com/',
    lastChecked: new Date()
  }
};

/**
 * Get deployment status for a model
 */
export const getDeploymentStatus = (modelId: string): DeploymentStatus | null => {
  return deploymentStatuses[modelId] || null;
};

/**
 * Update deployment status for a model
 */
export const updateDeploymentStatus = (status: DeploymentStatus): void => {
  deploymentStatuses[status.modelId] = {
    ...status,
    lastChecked: new Date()
  };
};

/**
 * Check if model is ready for use
 */
export const isModelReady = (modelId: string): boolean => {
  const status = getDeploymentStatus(modelId);
  return status?.status === 'deployed';
};

/**
 * Get all deployment statuses
 */
export const getAllDeploymentStatuses = (): DeploymentStatus[] => {
  return Object.values(deploymentStatuses);
};
