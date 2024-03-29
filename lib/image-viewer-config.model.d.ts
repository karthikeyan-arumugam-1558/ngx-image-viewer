export interface ImageViewerConfig {
    btnClass?: string;
    zoomFactor?: number;
    containerBackgroundColor?: string;
    allowCtrlWheelZoom?: boolean;
    allowFullscreen?: boolean;
    allowKeyboardNavigation?: boolean;
    allowDrag?: boolean;
    btnShow?: {
        zoomIn?: boolean;
        zoomOut?: boolean;
        rotateClockwise?: boolean;
        rotateCounterClockwise?: boolean;
        next?: boolean;
        prev?: boolean;
    };
    btnIcons?: {
        zoomIn?: string;
        zoomOut?: string;
        rotateClockwise?: string;
        rotateCounterClockwise?: string;
        next?: string;
        prev?: string;
        fullscreen?: string;
    };
    customBtns?: Array<{
        name: string;
        icon: string;
    }>;
}
export declare class CustomEvent {
    name: string;
    imageIndex: number;
    constructor(name: any, imageIndex: any);
}
