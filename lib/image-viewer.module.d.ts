import { ModuleWithProviders } from '@angular/core';
import { ImageViewerConfig } from './image-viewer-config.model';
import * as i0 from "@angular/core";
import * as i1 from "./image-viewer.component";
import * as i2 from "@angular/common";
import * as i3 from "@angular/material/button";
import * as i4 from "@angular/material/icon";
export declare class ImageViewerModule {
    static forRoot(config?: ImageViewerConfig): ModuleWithProviders<ImageViewerModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ImageViewerModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ImageViewerModule, [typeof i1.ImageViewerComponent], [typeof i2.CommonModule, typeof i3.MatButtonModule, typeof i4.MatIconModule], [typeof i1.ImageViewerComponent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ImageViewerModule>;
}
