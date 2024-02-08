import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ImageViewerComponent } from './image-viewer.component';
import * as i0 from "@angular/core";
export class ImageViewerModule {
    static forRoot(config) {
        return {
            ngModule: ImageViewerModule,
            providers: [{ provide: 'config', useValue: config }]
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.7", ngImport: i0, type: ImageViewerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.1.7", ngImport: i0, type: ImageViewerModule, declarations: [ImageViewerComponent], imports: [CommonModule,
            MatButtonModule,
            MatIconModule], exports: [ImageViewerComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.1.7", ngImport: i0, type: ImageViewerModule, imports: [CommonModule,
            MatButtonModule,
            MatIconModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.7", ngImport: i0, type: ImageViewerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        MatButtonModule,
                        MatIconModule,
                    ],
                    declarations: [
                        ImageViewerComponent,
                    ],
                    exports: [
                        ImageViewerComponent,
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2Utdmlld2VyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2xhY3VuYS1pbWFnZS12aWV3ZXIvc3JjL2xpYi9pbWFnZS12aWV3ZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQXVCLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDM0QsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRXZELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDOztBQWdCaEUsTUFBTSxPQUFPLGlCQUFpQjtJQUM3QixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQTBCO1FBQ3hDLE9BQU87WUFDTixRQUFRLEVBQUUsaUJBQWlCO1lBQzNCLFNBQVMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUM7U0FDcEQsQ0FBQztJQUNILENBQUM7OEdBTlcsaUJBQWlCOytHQUFqQixpQkFBaUIsaUJBTjVCLG9CQUFvQixhQUxwQixZQUFZO1lBQ1osZUFBZTtZQUNmLGFBQWEsYUFNYixvQkFBb0I7K0dBR1QsaUJBQWlCLFlBWDVCLFlBQVk7WUFDWixlQUFlO1lBQ2YsYUFBYTs7MkZBU0YsaUJBQWlCO2tCQWI3QixRQUFRO21CQUFDO29CQUNULE9BQU8sRUFBRTt3QkFDUixZQUFZO3dCQUNaLGVBQWU7d0JBQ2YsYUFBYTtxQkFDYjtvQkFDRCxZQUFZLEVBQUU7d0JBQ2Isb0JBQW9CO3FCQUNwQjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1Isb0JBQW9CO3FCQUNwQjtpQkFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IE1hdEJ1dHRvbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2J1dHRvbic7XHJcbmltcG9ydCB7IE1hdEljb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pY29uJztcclxuXHJcbmltcG9ydCB7IEltYWdlVmlld2VyQ29tcG9uZW50IH0gZnJvbSAnLi9pbWFnZS12aWV3ZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgSW1hZ2VWaWV3ZXJDb25maWcgfSBmcm9tICcuL2ltYWdlLXZpZXdlci1jb25maWcubW9kZWwnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuXHRpbXBvcnRzOiBbXHJcblx0XHRDb21tb25Nb2R1bGUsXHJcblx0XHRNYXRCdXR0b25Nb2R1bGUsXHJcblx0XHRNYXRJY29uTW9kdWxlLFxyXG5cdF0sXHJcblx0ZGVjbGFyYXRpb25zOiBbXHJcblx0XHRJbWFnZVZpZXdlckNvbXBvbmVudCxcclxuXHRdLFxyXG5cdGV4cG9ydHM6IFtcclxuXHRcdEltYWdlVmlld2VyQ29tcG9uZW50LFxyXG5cdF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEltYWdlVmlld2VyTW9kdWxlIHtcclxuXHRzdGF0aWMgZm9yUm9vdChjb25maWc/OiBJbWFnZVZpZXdlckNvbmZpZyk6IE1vZHVsZVdpdGhQcm92aWRlcnM8SW1hZ2VWaWV3ZXJNb2R1bGU+IHtcclxuXHRcdHJldHVybiB7XHJcblx0XHRcdG5nTW9kdWxlOiBJbWFnZVZpZXdlck1vZHVsZSxcclxuXHRcdFx0cHJvdmlkZXJzOiBbeyBwcm92aWRlOiAnY29uZmlnJywgdXNlVmFsdWU6IGNvbmZpZyB9XVxyXG5cdFx0fTtcclxuXHR9XHJcbn1cclxuIl19