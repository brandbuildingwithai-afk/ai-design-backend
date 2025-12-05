import React, { useState } from 'react';
import { useCanvasStore } from '../../store/canvasStore';

export const ExportButton: React.FC = () => {
    const { canvas } = useCanvasStore();
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = (format: 'png' | 'jpg', quality: number = 1) => {
        if (!canvas) return;

        setIsExporting(true);
        try {
            // Generate image data URL
            const dataURL = canvas.toDataURL({
                format: format === 'jpg' ? 'jpeg' : 'png',
                quality: quality,
                multiplier: 2, // 2x resolution for better quality
            });

            // Create download link
            const link = document.createElement('a');
            link.download = `design-${Date.now()}.${format}`;
            link.href = dataURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={() => handleExport('png', 1)}
                disabled={!canvas || isExporting}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isExporting ? 'Exporting...' : 'Download PNG'}
            </button>
            <button
                onClick={() => handleExport('jpg', 0.9)}
                disabled={!canvas || isExporting}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Download JPG
            </button>
        </div>
    );
};
