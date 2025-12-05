import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';

export const CanvasControls: React.FC = () => {
    const { activeObject, deleteActiveObject, canvas } = useCanvasStore();

    if (!activeObject) return null;

    const handleBringToFront = () => {
        if (activeObject && canvas) {
            activeObject.bringToFront();
            canvas.renderAll();
        }
    };

    const handleSendToBack = () => {
        if (activeObject && canvas) {
            activeObject.sendToBack();
            canvas.renderAll();
        }
    };

    return (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded-full shadow-lg flex gap-4 z-10 animate-fade-in">
            <button onClick={handleBringToFront} className="hover:text-blue-600 font-medium text-sm transition-colors">
                Bring Front
            </button>
            <button onClick={handleSendToBack} className="hover:text-blue-600 font-medium text-sm transition-colors">
                Send Back
            </button>
            <div className="w-px bg-gray-300 mx-2" />
            <button onClick={deleteActiveObject} className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors">
                Delete
            </button>
        </div>
    );
};
