export interface DesignElement {
    id?: string;
    type: 'text' | 'image' | 'shape';
    x: number;
    y: number;
    width: number;
    height: number;
    text?: string;
    src?: string;
    fontFamily?: string;
    color?: string;
}

export interface DesignResult {
    elements: DesignElement[];
    brand: {
        name: string;
        colors: {
            primary: string;
            secondary: string;
            accent: string;
        };
        fonts: {
            primary: string;
            secondary: string;
        };
        tone: string;
    };
}
