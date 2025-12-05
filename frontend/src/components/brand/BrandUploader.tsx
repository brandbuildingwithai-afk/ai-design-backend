import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadBrandImages } from '../../services/api';

interface BrandUploaderProps {
    onUploadComplete: (urls: string[]) => void;
}

export const BrandUploader: React.FC<BrandUploaderProps> = ({ onUploadComplete }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Limit to 5 files total
        setFiles((prev) => {
            const newFiles = [...prev, ...acceptedFiles];
            return newFiles.slice(0, 5);
        });
        setError(null);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        maxFiles: 5,
        disabled: uploading
    });

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setUploading(true);
        setError(null);

        try {
            const urls = await uploadBrandImages(files);
            onUploadComplete(urls);
            setFiles([]); // Clear files after successful upload
        } catch (err: any) {
            console.error('Upload failed', err);
            setError(err.response?.data?.error || 'Failed to upload images. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl">
            <div className="mb-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-2">Upload Brand Assets</h3>
                <p className="text-gray-400 text-sm">
                    Upload 3-5 images that represent your brand style (Instagram posts, website screenshots, etc.)
                </p>
            </div>

            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`
          relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300
          ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500 hover:bg-white/5'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div className="text-gray-300">
                        {isDragActive ? (
                            <p className="text-blue-400 font-medium">Drop the files here...</p>
                        ) : (
                            <>
                                <p className="font-medium">Drag & drop images here, or click to select</p>
                                <p className="text-xs text-gray-500 mt-2">Supports JPG, PNG, WEBP (Max 5 files)</p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}

            {/* File Previews */}
            {files.length > 0 && (
                <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {files.map((file, index) => (
                            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${index}`}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(index);
                                    }}
                                    disabled={uploading}
                                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-700">
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className={`
                px-6 py-2.5 rounded-lg font-medium text-white shadow-lg shadow-blue-500/20 transition-all duration-200
                ${uploading
                                    ? 'bg-blue-600/50 cursor-wait'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/40 hover:-translate-y-0.5'
                                }
              `}
                        >
                            {uploading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading...
                                </span>
                            ) : (
                                `Analyze ${files.length} Images`
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
