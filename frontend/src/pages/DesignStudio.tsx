import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FabricCanvas } from '../components/canvas/FabricCanvas';
import { CanvasControls } from '../components/canvas/CanvasControls';
import { ExportButton } from '../components/canvas/ExportButton';
import { TemplateGallery } from '../components/templates/TemplateGallery';
import { createDesign, savePost } from '../services/api';
import type { DesignResult } from '../types/design';
import type { WorkflowTemplate } from '../types/template';

export const DesignStudio: React.FC = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
    const [prompt, setPrompt] = useState('');
    const [dynamicInputs, setDynamicInputs] = useState<Record<string, string>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [design, setDesign] = useState<DesignResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleGenerate = async () => {
        const finalPrompt = selectedTemplate && selectedTemplate.requiredInputs.length > 0
            ? Object.entries(dynamicInputs).reduce(
                (p, [key, value]) => p.replace(`{${key}}`, value),
                selectedTemplate.promptTemplate
            )
            : prompt;

        if (!finalPrompt.trim()) return;

        setIsGenerating(true);
        setError(null);
        try {
            const result = await createDesign(finalPrompt, selectedTemplate?.id);
            setDesign(result);
        } catch (err) {
            console.error('Generation failed:', err);
            setError('Failed to generate design. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!design) return;
        setIsSaving(true);
        try {
            await savePost({
                elementsJson: design,
                promptUsed: prompt,
                platform: selectedTemplate?.platform || 'INSTAGRAM',
                templateId: selectedTemplate?.id,
                brandProfileId: null,
            });
            alert('Design saved to gallery!');
        } catch (err) {
            console.error('Save failed:', err);
            alert('Failed to save design');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <nav className="flex justify-between items-center mb-12">
                <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                    AI Design Platform
                </Link>
                <div className="flex gap-4">
                    <Link to="/gallery" className="text-gray-400 hover:text-white transition-colors">
                        Gallery
                    </Link>
                    <Link to="/brand-setup" className="text-gray-400 hover:text-white transition-colors">
                        Brand Setup
                    </Link>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel */}
                <div className="lg:col-span-1 space-y-6">
                    {!design && (
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <TemplateGallery
                                onTemplateSelect={(t) => {
                                    setSelectedTemplate(t);
                                    setDynamicInputs({});
                                }}
                                selectedTemplate={selectedTemplate}
                            />
                        </div>
                    )}

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <h2 className="text-xl font-semibold mb-4">
                            {selectedTemplate ? `Create ${selectedTemplate.name}` : 'Create New Design'}
                        </h2>
                        <div className="space-y-4">
                            {selectedTemplate && selectedTemplate.requiredInputs.length > 0 ? (
                                selectedTemplate.requiredInputs.map((input) => (
                                    <div key={input}>
                                        <label className="block text-sm text-gray-400 mb-2 capitalize">{input}:</label>
                                        <input
                                            type="text"
                                            value={dynamicInputs[input] || ''}
                                            onChange={(e) => setDynamicInputs({ ...dynamicInputs, [input]: e.target.value })}
                                            placeholder={`Enter ${input}...`}
                                            className="w-full bg-black/50 border border-white/20 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                ))
                            ) : (
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">What would you like to create?</label>
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="e.g., An Instagram post announcing our new summer coffee blend."
                                        className="w-full h-32 bg-black/50 border border-white/20 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                                    />
                                </div>
                            )}
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !prompt.trim()}
                                className={`w-full py-4 rounded-xl font-semibold ${isGenerating || !prompt.trim()
                                    ? 'bg-gray-800 text-gray-500'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
                                    }`}
                            >
                                {isGenerating ? 'Generating...' : 'Generate Design'}
                            </button>
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>

                    {design && (
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
                            <ExportButton />
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save to Gallery'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Panel */}
                <div className="lg:col-span-2">
                    {!design ? (
                        <div className="bg-gray-900 rounded-2xl border border-white/10 p-8 flex items-center justify-center min-h-[600px]">
                            <div className="text-center text-gray-500">
                                <p>Enter a prompt to generate your design</p>
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            <CanvasControls />
                            <FabricCanvas initialDesign={design} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
