import { create } from 'zustand';
import { fabric } from 'fabric';

interface CanvasState {
    canvas: fabric.Canvas | null;
    activeObject: fabric.Object | null;
    isDirty: boolean;
    setCanvas: (canvas: fabric.Canvas) => void;
    setActiveObject: (object: fabric.Object | null) => void;
    updateObject: (object: fabric.Object) => void;
    deleteActiveObject: () => void;
    markDirty: () => void;
    resetDirty: () => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
    canvas: null,
    activeObject: null,
    isDirty: false,

    setCanvas: (canvas) => set({ canvas }),

    setActiveObject: (object) => set({ activeObject: object }),

    updateObject: (object) => {
        const { canvas } = get();
        if (canvas) {
            canvas.renderAll();
            set({ isDirty: true });
        }
    },

    deleteActiveObject: () => {
        const { canvas, activeObject } = get();
        if (canvas && activeObject) {
            canvas.remove(activeObject);
            canvas.discardActiveObject();
            canvas.renderAll();
            set({ activeObject: null, isDirty: true });
        }
    },

    markDirty: () => set({ isDirty: true }),
    resetDirty: () => set({ isDirty: false }),
}));
