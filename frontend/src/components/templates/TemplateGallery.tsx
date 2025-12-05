import React, { useEffect, useState } from 'react';
import { getTemplates } from '../../services/api';
import { TemplateCard } from './TemplateCard';
import type { WorkflowTemplate } from '../../types/template';

interface TemplateGalleryProps {
    onTemplateSelect: (template: WorkflowTemplate | null) => void;
    selectedTemplate: WorkflowTemplate | null;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onTemplateSelect, selectedTemplate }) => {
    const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTemplates = async () => {
            try {
                const data = await getTemplates();
                setTemplates(data);
            } catch (err) {
                console.error('Failed to load templates:', err);
                setError('Failed to load templates');
            } finally {
                setLoading(false);
            }
        };
        loadTemplates();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Choose a Template</h3>
                {selectedTemplate && (
                    <button
                        onClick={() => onTemplateSelect(null)}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Clear Selection
                    </button>
                )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {templates.map((template) => (
                    <TemplateCard
                        key={template.id}
                        template={template}
                        onSelect={onTemplateSelect}
                        isSelected={selectedTemplate?.id === template.id}
                    />
                ))}
            </div>
        </div>
    );
};
