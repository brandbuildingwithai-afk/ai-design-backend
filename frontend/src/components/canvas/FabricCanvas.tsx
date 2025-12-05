import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useCanvasStore } from '../../store/canvasStore';
import { DesignResult } from '../../types/design';

interface FabricCanvasProps {
    initialDesign: DesignResult | null;
}

export const FabricCanvas: React.FC<FabricCanvasProps> = ({ initialDesign }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { setCanvas, setActiveObject, updateObject } = useCanvasStore();
    // We use a ref to track if canvas is initialized to avoid double init in strict mode
    const isInit = useRef(false);

    useEffect(() => {
        if (!canvasRef.current || isInit.current) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            width: 500,
            height: 500,
            backgroundColor: '#ffffff',
            preserveObjectStacking: true,
        });

        setCanvas(canvas);
        isInit.current = true;

        canvas.on('selection:created', (e) => setActiveObject(e.selected?.[0] || null));
        canvas.on('selection:updated', (e) => setActiveObject(e.selected?.[0] || null));
        canvas.on('selection:cleared', () => setActiveObject(null));
        canvas.on('object:modified', (e) => {
            if (e.target) updateObject(e.target);
        });

        return () => {
            canvas.dispose();
            isInit.current = false;
        };
    }, []);

    // Load initial design
    useEffect(() => {
        const { canvas } = useCanvasStore.getState();
        if (!canvas || !initialDesign) return;

        canvas.clear();
        canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));

        initialDesign.elements.forEach((el) => {
            let fabricObj;

            if (el.type === 'text') {
                fabricObj = new fabric.IText(el.text || 'Text', {
                    left: (el.x / 100) * 500,
                    top: (el.y / 100) * 500,
                    fontFamily: el.fontFamily,
                    fill: el.color,
                    fontSize: 24,
                });
            } else if (el.type === 'image' && el.src) {
                fabric.Image.fromURL(el.src, (img) => {
                    img.set({
                        left: (el.x / 100) * 500,
                        top: (el.y / 100) * 500,
                        scaleX: ((el.width / 100) * 500) / (img.width || 1),
                        scaleY: ((el.height / 100) * 500) / (img.height || 1),
                    });
                    canvas.add(img);
                }, { crossOrigin: 'anonymous' });
                return;
            }

            if (fabricObj) {
                canvas.add(fabricObj);
            }
        });

        canvas.renderAll();

    }, [initialDesign]);

    return (
        <div className="relative flex justify-center items-center bg-gray-800 p-8 rounded-xl shadow-2xl">
            <canvas ref={canvasRef} />
        </div>
    );
};
