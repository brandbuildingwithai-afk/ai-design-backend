import React from 'react';
import type { WorkflowTemplate } from '../../types/template';

interface TemplateCardProps {
    template: WorkflowTemplate;
    onSelect: (template: WorkflowTemplate) => void;
    isSelected: boolean;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect, isSelected }) => {
    const platformColors: Record<string, string> = {
        INSTAGRAM: 'from-pink-500 to-purple-500',
        LINKEDIN: 'from-blue-600 to-blue-700',
        TWITTER: 'from-sky-400 to-blue-500',
        FACEBOOK: 'from-blue-500 to-indigo-600',
    };

    return (
        <button
            onClick={() => onSelect(template)}
            className={`relative group overflow-hidden rounded-2xl transition-all duration-300 ${isSelected
                    ? 'ring-4 ring-blue-500 scale-105 shadow-2xl'
                    : 'hover:scale-105 hover:shadow-xl'
                }`}
        >
            {/* Preview Image */}
            <div className="relative aspect-square bg-gray-900">
                <img
                    src={template.previewImageUrl}
                    alt={template.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                {/* Platform Badge */}
                <div
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${platformColors[template.platform] || 'from-gray-600 to-gray-700'
                        }`}
                >
                    {template.platform}
                </div>
                {/* Selected Badge */}
                {isSelected && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>
            {/* Card Footer */}
            <div className="bg-white/5 backdrop-blur-sm p-4 border-t border-white/10">
                <h3 className="text-white font-semibold text-sm">{template.name}</h3>
                <p className="text-gray-400 text-xs mt-1">
                    {template.dimensions.width} × {template.dimensions.height}
                </p>
            </div>
        </button>
    );
};
