import * as i0 from '@angular/core';
import { EventEmitter, Component, Inject, Optional, Input, Output, ViewChild, HostListener, NgModule } from '@angular/core';
import * as i1 from '@angular/common';
import { DOCUMENT, CommonModule } from '@angular/common';
import * as i2 from '@angular/material/button';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

class CustomEvent {
    constructor(name, imageIndex) {
        this.name = name;
        this.imageIndex = imageIndex;
    }
}

const DEFAULT_CONFIG = {
    btnClass: 'mat-mini-fab',
    zoomFactor: 0.1,
    containerBackgroundColor: '#ccc',
    allowCtrlWheelZoom: true,
    allowFullscreen: true,
    allowKeyboardNavigation: true,
    allowDrag: true,
    btnShow: {
        zoomIn: true,
        zoomOut: true,
        rotateClockwise: true,
        rotateCounterClockwise: true,
        next: true,
        prev: true
    },
    btnIcons: {
        zoomIn: 'material-icons zoom-in',
        zoomOut: 'material-icons zoom-out',
        rotateClockwise: 'material-icons rotate-clockwise',
        rotateCounterClockwise: 'material-icons rotate-counterclock',
        next: 'material-icons next',
        prev: 'material-icons prev',
        fullscreen: 'material-icons fullscreen',
    }
};
class ImageViewerComponent {
    constructor(document, moduleConfig) {
        this.document = document;
        this.moduleConfig = moduleConfig;
        this.index = 0;
        this.indexChange = new EventEmitter();
        this.configChange = new EventEmitter();
        this.customEvent = new EventEmitter();
        this.style = { transform: '', msTransform: '', oTransform: '', webkitTransform: '' };
        this.fullscreen = false;
        this.loading = true;
        this.scale = 1;
        this.rotation = 0;
        this.translateX = 0;
        this.translateY = 0;
        this.hovered = false;
    }
    ngOnInit() {
        const merged = this.mergeConfig(DEFAULT_CONFIG, this.moduleConfig);
        this.config = this.mergeConfig(merged, this.config);
        this.triggerConfigBinding();
    }
    checkFullscreenmode(e) {
        if (document.fullscreenElement) {
            this.fullscreen = true;
        }
        else {
            this.fullscreen = false;
        }
    }
    nextImage(event) {
        if (this.canNavigate(event) && this.index < this.src.length - 1) {
            this.loading = true;
            this.index++;
            this.triggerIndexBinding();
            this.reset();
        }
    }
    prevImage(event) {
        if (this.canNavigate(event) && this.index > 0) {
            this.loading = true;
            this.index--;
            this.triggerIndexBinding();
            this.reset();
        }
    }
    zoomIn() {
        this.scale *= (1 + this.config.zoomFactor);
        this.updateStyle();
    }
    zoomOut() {
        if (this.scale > this.config.zoomFactor) {
            this.scale /= (1 + this.config.zoomFactor);
        }
        this.updateStyle();
    }
    scrollZoom(evt) {
        if (this.config.allowCtrlWheelZoom && evt.ctrlKey) {
            evt.deltaY > 0 ? this.zoomOut() : this.zoomIn();
            return false;
        }
    }
    rotateClockwise() {
        this.rotation += 90;
        this.updateStyle();
    }
    rotateCounterClockwise() {
        this.rotation -= 90;
        this.updateStyle();
    }
    onLoad() {
        this.loading = false;
    }
    onLoadStart() {
        this.loading = true;
    }
    onDragOver(evt) {
        if (this.config.allowDrag) {
            this.translateX += (evt.clientX - this.prevX);
            this.translateY += (evt.clientY - this.prevY);
            this.prevX = evt.clientX;
            this.prevY = evt.clientY;
            this.updateStyle();
        }
    }
    onDragStart(evt) {
        if (this.config.allowDrag) {
            if (evt.dataTransfer && evt.dataTransfer.setDragImage) {
                evt.dataTransfer.setDragImage(evt.target.nextElementSibling, 0, 0);
            }
            this.prevX = evt.clientX;
            this.prevY = evt.clientY;
        }
    }
    toggleFullscreen() {
        if (!this.fullscreen) {
            this.openFullscreen();
        }
        else {
            this.closeFullscreen();
        }
    }
    openFullscreen() {
        if (this.fullscreenElement.nativeElement.requestFullscreen) {
            this.fullscreenElement.nativeElement.requestFullscreen();
        }
        else if (this.fullscreenElement.nativeElement.mozRequestFullScreen) {
            /* Firefox */
            this.fullscreenElement.nativeElement.mozRequestFullScreen();
        }
        else if (this.fullscreenElement.nativeElement.webkitRequestFullscreen) {
            /* Chrome, Safari and Opera */
            this.fullscreenElement.nativeElement.webkitRequestFullscreen();
        }
        else if (this.fullscreenElement.nativeElement.msRequestFullscreen) {
            /* IE/Edge */
            this.fullscreenElement.nativeElement.msRequestFullscreen();
        }
        else {
            console.error("Unable to open in fullscreen");
        }
    }
    closeFullscreen() {
        if (this.document.exitFullscreen) {
            this.document.exitFullscreen();
        }
        else if (this.document.mozCancelFullScreen) {
            /* Firefox */
            this.document.mozCancelFullScreen();
        }
        else if (this.document.webkitExitFullscreen) {
            /* Chrome, Safari and Opera */
            this.document.webkitExitFullscreen();
        }
        else if (this.document.msExitFullscreen) {
            /* IE/Edge */
            this.document.msExitFullscreen();
        }
        else {
            console.error("Unable to close fullscreen");
        }
    }
    triggerIndexBinding() {
        this.indexChange.emit(this.index);
    }
    triggerConfigBinding() {
        this.configChange.next(this.config);
    }
    fireCustomEvent(name, imageIndex) {
        this.customEvent.emit(new CustomEvent(name, imageIndex));
    }
    reset() {
        this.scale = 1;
        this.rotation = 0;
        this.translateX = 0;
        this.translateY = 0;
        this.updateStyle();
    }
    onMouseOver() {
        this.hovered = true;
    }
    onMouseLeave() {
        this.hovered = false;
    }
    canNavigate(event) {
        return event == null || (this.config.allowKeyboardNavigation && this.hovered);
    }
    updateStyle() {
        this.style.transform = `translate(${this.translateX}px, ${this.translateY}px) rotate(${this.rotation}deg) scale(${this.scale})`;
        this.style.msTransform = this.style.transform;
        this.style.webkitTransform = this.style.transform;
        this.style.oTransform = this.style.transform;
    }
    mergeConfig(defaultValues, overrideValues) {
        let result = { ...defaultValues };
        if (overrideValues) {
            result = { ...defaultValues, ...overrideValues };
            if (overrideValues.btnIcons) {
                result.btnIcons = { ...defaultValues.btnIcons, ...overrideValues.btnIcons };
            }
        }
        return result;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.7", ngImport: i0, type: ImageViewerComponent, deps: [{ token: DOCUMENT }, { token: 'config', optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.1.7", type: ImageViewerComponent, selector: "ngx-image-viewer", inputs: { src: "src", index: "index", config: "config" }, outputs: { indexChange: "indexChange", configChange: "configChange", customEvent: "customEvent" }, host: { listeners: { "document:fullscreenchange": "checkFullscreenmode($event)", "document:webkitfullscreenchange": "checkFullscreenmode($event)", "document:mozfullscreenchange": "checkFullscreenmode($event)", "document:MSFullscreenChange": "checkFullscreenmode($event)", "window:keyup.ArrowRight": "nextImage($event)", "window:keyup.ArrowLeft": "prevImage($event)", "mouseover": "onMouseOver()", "mouseleave": "onMouseLeave()" } }, viewQueries: [{ propertyName: "fullscreenElement", first: true, predicate: ["fullscreenElement"], descendants: true, static: true }], ngImport: i0, template: "<div #fullscreenElement class=\"img-container\" [style.backgroundColor]=\"config.containerBackgroundColor\"\r\n\t(wheel)=\"scrollZoom($event)\" (dragover)=\"onDragOver($event)\">\r\n\t<img [src]=\"src[index]\" [ngStyle]=\"style\" alt=\"Image not found...\" (dragstart)=\"onDragStart($event)\"\r\n\t\t(load)=\"onLoad()\" (loadstart)=\"onLoadStart()\" />\r\n\t<!-- Div below will be used to hide the 'ghost' image when dragging -->\r\n\t<div></div>\r\n\t<div class=\"spinner-container\" *ngIf=\"loading\">\r\n\t\t<div class=\"spinner\"></div>\r\n\t</div>\r\n\r\n\t<button type=\"button\" mat-mini-fab [class]=\"config.btnClass\" *ngIf=\"config.btnShow.rotateCounterClockwise\"\r\n\t\t(click)=\"rotateCounterClockwise()\">\r\n\t\t<span [class]=\"config.btnIcons.rotateCounterClockwise\"></span>\r\n\t</button>\r\n\t<button type=\"button\" mat-mini-fab [class]=\"config.btnClass\" *ngIf=\"config.btnShow.rotateClockwise\" (click)=\"rotateClockwise()\">\r\n\t\t<span [class]=\"config.btnIcons.rotateClockwise\"></span>\r\n\t</button>\r\n\r\n\t<button type=\"button\" mat-mini-fab [class]=\"config.btnClass\" *ngIf=\"config.btnShow.zoomOut\" (click)=\"zoomOut()\">\r\n\t\t<span [class]=\"config.btnIcons.zoomOut\"></span>\r\n\t</button>\r\n\t<button type=\"button\" mat-mini-fab [class]=\"config.btnClass\" *ngIf=\"config.btnShow.zoomIn\" (click)=\"zoomIn()\">\r\n\t\t<span [class]=\"config.btnIcons.zoomIn\"></span>\r\n\t</button>\r\n\r\n\t<button type=\"button\" mat-mini-fab [class]=\"config.btnClass\" *ngFor=\"let cBtn of config.customBtns\"\r\n\t\t(click)=\"fireCustomEvent(cBtn.name, index)\">\r\n\t\t<span [class]=\"cBtn.icon\"></span>\r\n\t</button>\r\n\r\n\t<button type=\"button\" id=\"ngx-fs-btn\" mat-mini-fab [class]=\"config.btnClass\" (click)=\"toggleFullscreen()\"\r\n\t\t*ngIf=\"config.allowFullscreen\">\r\n\t\t<span [class]=\"config.btnIcons.fullscreen\"></span>\r\n\t</button>\r\n\r\n\t<div class=\"nav-button-container\" *ngIf=\"src.length > 1\">\r\n\t\t<button type=\"button\" mat-mini-fab [class]=\"config.btnClass\" (click)=\"prevImage($event)\" [disabled]=\"index === 0\">\r\n\t\t\t<span [class]=\"config.btnIcons.prev\"></span>\r\n\t\t</button>\r\n\t\t<button type=\"button\" mat-mini-fab [class]=\"config.btnClass\" (click)=\"nextImage($event)\"\r\n\t\t\t[disabled]=\"index === src.length - 1\">\r\n\t\t\t<span [class]=\"config.btnIcons.next\"></span>\r\n\t\t</button>\r\n\t</div>\r\n</div>\r\n", styles: [".img-container{height:100%;width:100%;min-height:300px;overflow:hidden;position:relative}.img-container img{z-index:2;margin:0 auto;display:block;max-width:100%;max-height:100%}.img-container button{z-index:99;position:absolute;right:15px}.img-container button:not(:disabled){cursor:pointer}.img-container>button:nth-of-type(1):not(#ngx-fs-btn){bottom:15px}.img-container>button:nth-of-type(2):not(#ngx-fs-btn){bottom:65px}.img-container>button:nth-of-type(3):not(#ngx-fs-btn){bottom:115px}.img-container>button:nth-of-type(4):not(#ngx-fs-btn){bottom:165px}.img-container>button:nth-of-type(5):not(#ngx-fs-btn){bottom:215px}.img-container>button:nth-of-type(6):not(#ngx-fs-btn){bottom:265px}.img-container>button:nth-of-type(7):not(#ngx-fs-btn){bottom:315px}#ngx-fs-btn{top:15px}button.default{height:40px;width:40px;border:1px solid #555;border-radius:50%;background-color:#fff;opacity:.7;transition:opacity .2s}button.default:hover{opacity:1}button.default:disabled{opacity:.25}.nav-button-container>button{position:relative;right:0;margin:0 10px}.nav-button-container{text-align:center;position:absolute;z-index:98;bottom:10px;left:0;right:0}.spinner-container{position:absolute;inset:0;width:60px;height:60px;margin:auto;padding:10px;background-color:#0006;border-radius:25%}.spinner{border-width:7px;border-style:solid;border-color:#ccc;border-bottom-color:#222;border-radius:50%;height:100%;width:100%;box-sizing:border-box;animation:rotation 2s linear infinite}@keyframes rotation{0%{-webkit-transform:rotate(0deg)}to{-webkit-transform:rotate(359deg)}}.zoom-in:after{content:\"zoom_in\"}.zoom-out:after{content:\"zoom_out\"}.rotate-clockwise:after{content:\"rotate_right\"}.rotate-counterclock:after{content:\"rotate_left\"}.next:after{content:\"keyboard_arrow_right\"}.prev:after{content:\"keyboard_arrow_left\"}.fullscreen:after{content:\"fullscreen\"}\n"], dependencies: [{ kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: i2.MatMiniFabButton, selector: "button[mat-mini-fab]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.7", ngImport: i0, type: ImageViewerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-image-viewer', template: "<div #fullscreenElement class=\"img-container\" [style.backgroundColor]=\"config.containerBackgroundColor\"\r\n\t(wheel)=\"scrollZoom($event)\" (dragover)=\"onDragOver($event)\">\r\n\t<img [src]=\"src[index]\" [ngStyle]=\"style\" alt=\"Image not found...\" (dragstart)=\"onDragStart($event)\"\r\n\t\t(load)=\"onLoad()\" (loadstart)=\"onLoadStart()\" />\r\n\t<!-- Div below will be used to hide the 'ghost' image when dragging -->\r\n\t<div></div>\r\n\t<div class=\"spinner-container\" *ngIf=\"loading\">\r\n\t\t<div class=\"spinner\"></div>\r\n\t</div>\r\n\r\n\t<button type=\"button\" mat-mini-fab [class]=\"config.btnClass\" *ngIf=\"config.btnShow.rotateCounterClockwise\"\r\n\t\t(click)=\"rotateCounterClockwise()\">\r\n\t\t<span [class]=\"config.btnIcons.rotateCounterClockwise\"></span>\r\n\t</button>\r\n\t<button type=\"button\" mat-mini-fab [class]=\"config.btnClass\" *ngIf=\"config.btnShow.rotateClockwise\" (click)=\"rotateClockwise()\">\r\n\t\t<span [class]=\"config.btnIcons.rotateClockwise\"></span>\r\n\t</button>\r\n\r\n\t<button type=\"button\" mat-mini-fab [class]=\"config.btnClass\" *ngIf=\"config.btnShow.zoomOut\" (click)=\"zoomOut()\">\r\n\t\t<span [class]=\"config.btnIcons.zoomOut\"></span>\r\n\t</button>\r\n\t<button type=\"button\" mat-mini-fab [class]=\"config.btnClass\" *ngIf=\"config.btnShow.zoomIn\" (click)=\"zoomIn()\">\r\n\t\t<span [class]=\"config.btnIcons.zoomIn\"></span>\r\n\t</button>\r\n\r\n\t<button type=\"button\" mat-mini-fab [class]=\"config.btnClass\" *ngFor=\"let cBtn of config.customBtns\"\r\n\t\t(click)=\"fireCustomEvent(cBtn.name, index)\">\r\n\t\t<span [class]=\"cBtn.icon\"></span>\r\n\t</button>\r\n\r\n\t<button type=\"button\" id=\"ngx-fs-btn\" mat-mini-fab [class]=\"config.btnClass\" (click)=\"toggleFullscreen()\"\r\n\t\t*ngIf=\"config.allowFullscreen\">\r\n\t\t<span [class]=\"config.btnIcons.fullscreen\"></span>\r\n\t</button>\r\n\r\n\t<div class=\"nav-button-container\" *ngIf=\"src.length > 1\">\r\n\t\t<button type=\"button\" mat-mini-fab [class]=\"config.btnClass\" (click)=\"prevImage($event)\" [disabled]=\"index === 0\">\r\n\t\t\t<span [class]=\"config.btnIcons.prev\"></span>\r\n\t\t</button>\r\n\t\t<button type=\"button\" mat-mini-fab [class]=\"config.btnClass\" (click)=\"nextImage($event)\"\r\n\t\t\t[disabled]=\"index === src.length - 1\">\r\n\t\t\t<span [class]=\"config.btnIcons.next\"></span>\r\n\t\t</button>\r\n\t</div>\r\n</div>\r\n", styles: [".img-container{height:100%;width:100%;min-height:300px;overflow:hidden;position:relative}.img-container img{z-index:2;margin:0 auto;display:block;max-width:100%;max-height:100%}.img-container button{z-index:99;position:absolute;right:15px}.img-container button:not(:disabled){cursor:pointer}.img-container>button:nth-of-type(1):not(#ngx-fs-btn){bottom:15px}.img-container>button:nth-of-type(2):not(#ngx-fs-btn){bottom:65px}.img-container>button:nth-of-type(3):not(#ngx-fs-btn){bottom:115px}.img-container>button:nth-of-type(4):not(#ngx-fs-btn){bottom:165px}.img-container>button:nth-of-type(5):not(#ngx-fs-btn){bottom:215px}.img-container>button:nth-of-type(6):not(#ngx-fs-btn){bottom:265px}.img-container>button:nth-of-type(7):not(#ngx-fs-btn){bottom:315px}#ngx-fs-btn{top:15px}button.default{height:40px;width:40px;border:1px solid #555;border-radius:50%;background-color:#fff;opacity:.7;transition:opacity .2s}button.default:hover{opacity:1}button.default:disabled{opacity:.25}.nav-button-container>button{position:relative;right:0;margin:0 10px}.nav-button-container{text-align:center;position:absolute;z-index:98;bottom:10px;left:0;right:0}.spinner-container{position:absolute;inset:0;width:60px;height:60px;margin:auto;padding:10px;background-color:#0006;border-radius:25%}.spinner{border-width:7px;border-style:solid;border-color:#ccc;border-bottom-color:#222;border-radius:50%;height:100%;width:100%;box-sizing:border-box;animation:rotation 2s linear infinite}@keyframes rotation{0%{-webkit-transform:rotate(0deg)}to{-webkit-transform:rotate(359deg)}}.zoom-in:after{content:\"zoom_in\"}.zoom-out:after{content:\"zoom_out\"}.rotate-clockwise:after{content:\"rotate_right\"}.rotate-counterclock:after{content:\"rotate_left\"}.next:after{content:\"keyboard_arrow_right\"}.prev:after{content:\"keyboard_arrow_left\"}.fullscreen:after{content:\"fullscreen\"}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: ['config']
                }] }]; }, propDecorators: { src: [{
                type: Input
            }], index: [{
                type: Input
            }], config: [{
                type: Input
            }], indexChange: [{
                type: Output
            }], configChange: [{
                type: Output
            }], customEvent: [{
                type: Output
            }], fullscreenElement: [{
                type: ViewChild,
                args: ['fullscreenElement', { static: true }]
            }], checkFullscreenmode: [{
                type: HostListener,
                args: ['document:fullscreenchange', ['$event']]
            }, {
                type: HostListener,
                args: ['document:webkitfullscreenchange', ['$event']]
            }, {
                type: HostListener,
                args: ['document:mozfullscreenchange', ['$event']]
            }, {
                type: HostListener,
                args: ['document:MSFullscreenChange', ['$event']]
            }], nextImage: [{
                type: HostListener,
                args: ['window:keyup.ArrowRight', ['$event']]
            }], prevImage: [{
                type: HostListener,
                args: ['window:keyup.ArrowLeft', ['$event']]
            }], onMouseOver: [{
                type: HostListener,
                args: ['mouseover']
            }], onMouseLeave: [{
                type: HostListener,
                args: ['mouseleave']
            }] } });

class ImageViewerModule {
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

/*
 * Public API Surface of lacuna-image-viewer
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CustomEvent, ImageViewerComponent, ImageViewerModule };
//# sourceMappingURL=lacuna-image-viewer.mjs.map
