import React, { useState } from 'react';
import { BrandUploader } from '../components/brand/BrandUploader';
import { Link, useNavigate } from 'react-router-dom';
import { analyzeBrand, type BrandAnalysis, saveBrandProfile } from '../services/api';

export const BrandSetup: React.FC = () => {
    const navigate = useNavigate();
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [analysis, setAnalysis] = useState<BrandAnalysis | null>(null);

    const handleUploadComplete = (urls: string[]) => {
        setUploadedUrls(urls);
    };

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            const result = await analyzeBrand(uploadedUrls);
            setAnalysis(result);
        } catch (error) {
            console.error('Analysis failed:', error);
            alert('Failed to analyze brand. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSave = async () => {
        if (!analysis) return;
        setIsSaving(true);
        try {
            await saveBrandProfile({ ...analysis, imageUrls: uploadedUrls });
            // Redirect to dashboard or next step (e.g., create first design)
            // For now, let's just alert and maybe go home or to a "dashboard" placeholder
            alert('Brand Profile Saved Successfully!');
            navigate('/');
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save brand profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center">
                    <Link to="/" className="inline-block mb-8 text-gray-400 hover:text-white transition-colors">
                        ← Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mb-4">
                        Let's Learn Your Brand
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Our AI needs to understand your visual style. Upload a few examples of your best social media posts.
                    </p>
                </div>

                {/* Main Content */}
                <div className="space-y-12">
                    {!analysis ? (
                        uploadedUrls.length === 0 ? (
                            <BrandUploader onUploadComplete={handleUploadComplete} />
                        ) : (
                            <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 text-center animate-fade-in">
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Upload Successful!</h3>
                                <p className="text-gray-400 mb-8">
                                    We've securely stored your brand assets. The AI is now ready to analyze them.
                                </p>

                                <div className="grid grid-cols-5 gap-4 mb-8 max-w-2xl mx-auto">
                                    {uploadedUrls.map((url, i) => (
                                        <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-700">
                                            <img src={url} alt={`Uploaded ${i}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className={`
                                        px-8 py-3 rounded-lg font-medium text-white shadow-lg transition-all
                                        ${isAnalyzing
                                            ? 'bg-blue-600/50 cursor-wait'
                                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/40 hover:-translate-y-0.5'
                                        }
                                    `}
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing}
                                >
                                    {isAnalyzing ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Analyzing Brand DNA...
                                        </span>
                                    ) : (
                                        'Start Brand Analysis'
                                    )}
                                </button>
                            </div>
                        )
                    ) : (
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 animate-slide-up">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 mb-4">
                                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">Analysis Complete!</h2>
                                <p className="text-gray-400">Here's what we learned about {analysis.brandName}</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Colors */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-700 pb-2">Brand Colors</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <div className="h-20 rounded-lg shadow-lg" style={{ backgroundColor: analysis.colors.primary }}></div>
                                            <p className="text-xs text-center font-mono text-gray-400">{analysis.colors.primary}</p>
                                            <p className="text-xs text-center text-gray-500">Primary</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-20 rounded-lg shadow-lg" style={{ backgroundColor: analysis.colors.secondary }}></div>
                                            <p className="text-xs text-center font-mono text-gray-400">{analysis.colors.secondary}</p>
                                            <p className="text-xs text-center text-gray-500">Secondary</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-20 rounded-lg shadow-lg" style={{ backgroundColor: analysis.colors.accent }}></div>
                                            <p className="text-xs text-center font-mono text-gray-400">{analysis.colors.accent}</p>
                                            <p className="text-xs text-center text-gray-500">Accent</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Typography & Voice */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-700 pb-2 mb-3">Typography</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400">Primary Font</span>
                                                <span className="font-medium text-white">{analysis.fonts.primary}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400">Secondary Font</span>
                                                <span className="font-medium text-white">{analysis.fonts.secondary}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-700 pb-2 mb-3">Brand Voice</h3>
                                        <div className="bg-white/5 rounded-lg p-4">
                                            <p className="text-lg font-medium text-blue-300 mb-2">{analysis.toneOfVoice}</p>
                                            <p className="text-sm text-gray-400 italic">"{analysis.styleDescription}"</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-700 flex justify-end">
                                <button
                                    className={`
                                        px-8 py-3 rounded-lg font-bold transition-colors
                                        ${isSaving
                                            ? 'bg-gray-600 cursor-wait text-gray-300'
                                            : 'bg-white text-black hover:bg-gray-200'
                                        }
                                    `}
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving Profile...' : 'Save Brand Profile'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
