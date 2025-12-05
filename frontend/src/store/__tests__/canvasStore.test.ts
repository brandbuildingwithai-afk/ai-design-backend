import { useCanvasStore } from '../canvasStore';
import { fabric } from 'fabric';

// Mock fabric
jest.mock('fabric', () => ({
    fabric: {
        Canvas: jest.fn().mockImplementation(() => ({
            renderAll: jest.fn(),
            remove: jest.fn(),
            discardActiveObject: jest.fn(),
        })),
    },
}));

describe('Canvas Store', () => {
    beforeEach(() => {
        useCanvasStore.setState({
            canvas: null,
            activeObject: null,
            isDirty: false,
        });
    });

    it('should set canvas', () => {
        const mockCanvas = new fabric.Canvas('test');
        useCanvasStore.getState().setCanvas(mockCanvas);
        expect(useCanvasStore.getState().canvas).toBe(mockCanvas);
    });

    it('should set active object', () => {
        const mockObject = {} as fabric.Object;
        useCanvasStore.getState().setActiveObject(mockObject);
        expect(useCanvasStore.getState().activeObject).toBe(mockObject);
    });

    it('should mark dirty', () => {
        useCanvasStore.getState().markDirty();
        expect(useCanvasStore.getState().isDirty).toBe(true);
    });

    it('should delete active object', () => {
        const mockCanvas = new fabric.Canvas('test');
        const mockObject = {} as fabric.Object;

        useCanvasStore.setState({
            canvas: mockCanvas,
            activeObject: mockObject,
        });

        useCanvasStore.getState().deleteActiveObject();

        expect(mockCanvas.remove).toHaveBeenCalledWith(mockObject);
        expect(useCanvasStore.getState().activeObject).toBeNull();
        expect(useCanvasStore.getState().isDirty).toBe(true);
    });
});
