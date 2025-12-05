export interface WorkflowTemplate {
    id: string;
    name: string;
    platform: 'INSTAGRAM' | 'LINKEDIN' | 'TWITTER' | 'FACEBOOK';
    iconUrl: string;
    promptTemplate: string;
    requiredInputs: string[];
    aiInstructions: string;
    previewImageUrl: string;
    dimensions: {
        width: number;
        height: number;
    };
    isActive: boolean;
}
