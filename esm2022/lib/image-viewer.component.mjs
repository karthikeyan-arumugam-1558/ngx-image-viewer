import { Component, Input, Optional, Inject, Output, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { CustomEvent } from './image-viewer-config.model';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/material/button";
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
export class ImageViewerComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2Utdmlld2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2xhY3VuYS1pbWFnZS12aWV3ZXIvc3JjL2xpYi9pbWFnZS12aWV3ZXIuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vcHJvamVjdHMvbGFjdW5hLWltYWdlLXZpZXdlci9zcmMvbGliL2ltYWdlLXZpZXdlci5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFjLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0SSxPQUFPLEVBQXFCLFdBQVcsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRTdFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7OztBQUUzQyxNQUFNLGNBQWMsR0FBc0I7SUFDekMsUUFBUSxFQUFFLGNBQWM7SUFDeEIsVUFBVSxFQUFFLEdBQUc7SUFDZix3QkFBd0IsRUFBRSxNQUFNO0lBQ2hDLGtCQUFrQixFQUFFLElBQUk7SUFDeEIsZUFBZSxFQUFFLElBQUk7SUFDckIsdUJBQXVCLEVBQUUsSUFBSTtJQUM3QixTQUFTLEVBQUUsSUFBSTtJQUNmLE9BQU8sRUFBRTtRQUNSLE1BQU0sRUFBRSxJQUFJO1FBQ1osT0FBTyxFQUFFLElBQUk7UUFDYixlQUFlLEVBQUUsSUFBSTtRQUNyQixzQkFBc0IsRUFBRSxJQUFJO1FBQzVCLElBQUksRUFBRSxJQUFJO1FBQ1YsSUFBSSxFQUFFLElBQUk7S0FDVjtJQUNELFFBQVEsRUFBRTtRQUNULE1BQU0sRUFBRSx3QkFBd0I7UUFDaEMsT0FBTyxFQUFFLHlCQUF5QjtRQUNsQyxlQUFlLEVBQUUsaUNBQWlDO1FBQ2xELHNCQUFzQixFQUFFLG9DQUFvQztRQUM1RCxJQUFJLEVBQUUscUJB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bnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBPcHRpb25hbCwgSW5qZWN0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgSG9zdExpc3RlbmVyLCBFbGVtZW50UmVmLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgSW1hZ2VWaWV3ZXJDb25maWcsIEN1c3RvbUV2ZW50IH0gZnJvbSAnLi9pbWFnZS12aWV3ZXItY29uZmlnLm1vZGVsJztcclxuaW1wb3J0IHsgU2FmZVJlc291cmNlVXJsLCBTYWZlVXJsIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XHJcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuXHJcbmNvbnN0IERFRkFVTFRfQ09ORklHOiBJbWFnZVZpZXdlckNvbmZpZyA9IHtcclxuXHRidG5DbGFzczogJ21hdC1taW5pLWZhYicsIC8vIHdlIG9ic2VydmVkIHRoYXQgaXQgd2FzIHRyaWNreSB0byBvdmVycmlkZSB0aGUgYnJvd3NlciBidXR0b25cclxuXHR6b29tRmFjdG9yOiAwLjEsXHJcblx0Y29udGFpbmVyQmFja2dyb3VuZENvbG9yOiAnI2NjYycsXHJcblx0YWxsb3dDdHJsV2hlZWxab29tOiB0cnVlLFxyXG5cdGFsbG93RnVsbHNjcmVlbjogdHJ1ZSxcclxuXHRhbGxvd0tleWJvYXJkTmF2aWdhdGlvbjogdHJ1ZSxcclxuXHRhbGxvd0RyYWc6IHRydWUsXHJcblx0YnRuU2hvdzoge1xyXG5cdFx0em9vbUluOiB0cnVlLFxyXG5cdFx0em9vbU91dDogdHJ1ZSxcclxuXHRcdHJvdGF0ZUNsb2Nrd2lzZTogdHJ1ZSxcclxuXHRcdHJvdGF0ZUNvdW50ZXJDbG9ja3dpc2U6IHRydWUsXHJcblx0XHRuZXh0OiB0cnVlLFxyXG5cdFx0cHJldjogdHJ1ZVxyXG5cdH0sXHJcblx0YnRuSWNvbnM6IHtcclxuXHRcdHpvb21JbjogJ21hdGVyaWFsLWljb25zIHpvb20taW4nLFxyXG5cdFx0em9vbU91dDogJ21hdGVyaWFsLWljb25zIHpvb20tb3V0JyxcclxuXHRcdHJvdGF0ZUNsb2Nrd2lzZTogJ21hdGVyaWFsLWljb25zIHJvdGF0ZS1jbG9ja3dpc2UnLFxyXG5cdFx0cm90YXRlQ291bnRlckNsb2Nrd2lzZTogJ21hdGVyaWFsLWljb25zIHJvdGF0ZS1jb3VudGVyY2xvY2snLFxyXG5cdFx0bmV4dDogJ21hdGVyaWFsLWljb25zIG5leHQnLFxyXG5cdFx0cHJldjogJ21hdGVyaWFsLWljb25zIHByZXYnLFxyXG5cdFx0ZnVsbHNjcmVlbjogJ21hdGVyaWFsLWljb25zIGZ1bGxzY3JlZW4nLFxyXG5cdH1cclxufTtcclxuXHJcbkBDb21wb25lbnQoe1xyXG5cdHNlbGVjdG9yOiAnbmd4LWltYWdlLXZpZXdlcicsXHJcblx0dGVtcGxhdGVVcmw6ICcuL2ltYWdlLXZpZXdlci5jb21wb25lbnQuaHRtbCcsXHJcblx0c3R5bGVVcmxzOiBbJy4vaW1hZ2Utdmlld2VyLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIEltYWdlVmlld2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcblx0QElucHV0KClcclxuXHRzcmM6IChzdHJpbmcgfCBTYWZlUmVzb3VyY2VVcmwgfCBTYWZlVXJsKVtdO1xyXG5cclxuXHRASW5wdXQoKVxyXG5cdGluZGV4ID0gMDtcclxuXHJcblx0QElucHV0KClcclxuXHRjb25maWc6IEltYWdlVmlld2VyQ29uZmlnO1xyXG5cclxuXHRAT3V0cHV0KClcclxuXHRpbmRleENoYW5nZTogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBPdXRwdXQoKVxyXG5cdGNvbmZpZ0NoYW5nZTogRXZlbnRFbWl0dGVyPEltYWdlVmlld2VyQ29uZmlnPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcblx0QE91dHB1dCgpXHJcblx0Y3VzdG9tRXZlbnQ6IEV2ZW50RW1pdHRlcjxDdXN0b21FdmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG5cdEBWaWV3Q2hpbGQoJ2Z1bGxzY3JlZW5FbGVtZW50JywgeyBzdGF0aWM6IHRydWUgfSlcclxuXHRmdWxsc2NyZWVuRWxlbWVudDogRWxlbWVudFJlZjtcclxuXHJcblx0cHVibGljIHN0eWxlID0geyB0cmFuc2Zvcm06ICcnLCBtc1RyYW5zZm9ybTogJycsIG9UcmFuc2Zvcm06ICcnLCB3ZWJraXRUcmFuc2Zvcm06ICcnIH07XHJcblx0cHJpdmF0ZSBmdWxsc2NyZWVuID0gZmFsc2U7XHJcblx0cHVibGljIGxvYWRpbmcgPSB0cnVlO1xyXG5cdHByaXZhdGUgc2NhbGUgPSAxO1xyXG5cdHByaXZhdGUgcm90YXRpb24gPSAwO1xyXG5cdHByaXZhdGUgdHJhbnNsYXRlWCA9IDA7XHJcblx0cHJpdmF0ZSB0cmFuc2xhdGVZID0gMDtcclxuXHRwcml2YXRlIHByZXZYOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBwcmV2WTogbnVtYmVyO1xyXG5cdHByaXZhdGUgaG92ZXJlZCA9IGZhbHNlO1xyXG5cclxuXHRjb25zdHJ1Y3RvcihcclxuXHRcdEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IGFueSxcclxuXHRcdEBPcHRpb25hbCgpIEBJbmplY3QoJ2NvbmZpZycpIHB1YmxpYyBtb2R1bGVDb25maWc6IEltYWdlVmlld2VyQ29uZmlnLFxyXG5cdCkgeyB9XHJcblxyXG5cdG5nT25Jbml0KCkge1xyXG5cdFx0Y29uc3QgbWVyZ2VkID0gdGhpcy5tZXJnZUNvbmZpZyhERUZBVUxUX0NPTkZJRywgdGhpcy5tb2R1bGVDb25maWcpO1xyXG5cdFx0dGhpcy5jb25maWcgPSB0aGlzLm1lcmdlQ29uZmlnKG1lcmdlZCwgdGhpcy5jb25maWcpO1xyXG5cdFx0dGhpcy50cmlnZ2VyQ29uZmlnQmluZGluZygpO1xyXG5cdH1cclxuXHJcblx0QEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6ZnVsbHNjcmVlbmNoYW5nZScsIFsnJGV2ZW50J10pXHJcblx0QEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6d2Via2l0ZnVsbHNjcmVlbmNoYW5nZScsIFsnJGV2ZW50J10pXHJcblx0QEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6bW96ZnVsbHNjcmVlbmNoYW5nZScsIFsnJGV2ZW50J10pXHJcblx0QEhvc3RMaXN0ZW5lcignZG9jdW1lbnQ6TVNGdWxsc2NyZWVuQ2hhbmdlJywgWyckZXZlbnQnXSlcclxuXHRjaGVja0Z1bGxzY3JlZW5tb2RlKGU6IGFueSl7XHJcblx0XHRpZihkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCl7XHJcblx0XHRcdHRoaXMuZnVsbHNjcmVlbiA9IHRydWU7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0dGhpcy5mdWxsc2NyZWVuID0gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRASG9zdExpc3RlbmVyKCd3aW5kb3c6a2V5dXAuQXJyb3dSaWdodCcsIFsnJGV2ZW50J10pXHJcblx0bmV4dEltYWdlKGV2ZW50KSB7XHJcblx0XHRpZiAodGhpcy5jYW5OYXZpZ2F0ZShldmVudCkgJiYgdGhpcy5pbmRleCA8IHRoaXMuc3JjLmxlbmd0aCAtIDEpIHtcclxuXHRcdFx0dGhpcy5sb2FkaW5nID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5pbmRleCsrO1xyXG5cdFx0XHR0aGlzLnRyaWdnZXJJbmRleEJpbmRpbmcoKTtcclxuXHRcdFx0dGhpcy5yZXNldCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0QEhvc3RMaXN0ZW5lcignd2luZG93OmtleXVwLkFycm93TGVmdCcsIFsnJGV2ZW50J10pXHJcblx0cHJldkltYWdlKGV2ZW50KSB7XHJcblx0XHRpZiAodGhpcy5jYW5OYXZpZ2F0ZShldmVudCkgJiYgdGhpcy5pbmRleCA+IDApIHtcclxuXHRcdFx0dGhpcy5sb2FkaW5nID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5pbmRleC0tO1xyXG5cdFx0XHR0aGlzLnRyaWdnZXJJbmRleEJpbmRpbmcoKTtcclxuXHRcdFx0dGhpcy5yZXNldCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0em9vbUluKCkge1xyXG5cdFx0dGhpcy5zY2FsZSAqPSAoMSArIHRoaXMuY29uZmlnLnpvb21GYWN0b3IpO1xyXG5cdFx0dGhpcy51cGRhdGVTdHlsZSgpO1xyXG5cdH1cclxuXHJcblx0em9vbU91dCgpIHtcclxuXHRcdGlmICh0aGlzLnNjYWxlID4gdGhpcy5jb25maWcuem9vbUZhY3Rvcikge1xyXG5cdFx0XHR0aGlzLnNjYWxlIC89ICgxICsgdGhpcy5jb25maWcuem9vbUZhY3Rvcik7XHJcblx0XHR9XHJcblx0XHR0aGlzLnVwZGF0ZVN0eWxlKCk7XHJcblx0fVxyXG5cclxuXHRzY3JvbGxab29tKGV2dDogV2hlZWxFdmVudCkge1xyXG5cdFx0aWYgKHRoaXMuY29uZmlnLmFsbG93Q3RybFdoZWVsWm9vbSAmJiBldnQuY3RybEtleSkge1xyXG5cdFx0XHRldnQuZGVsdGFZID4gMCA/IHRoaXMuem9vbU91dCgpIDogdGhpcy56b29tSW4oKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cm90YXRlQ2xvY2t3aXNlKCkge1xyXG5cdFx0dGhpcy5yb3RhdGlvbiArPSA5MDtcclxuXHRcdHRoaXMudXBkYXRlU3R5bGUoKTtcclxuXHR9XHJcblxyXG5cdHJvdGF0ZUNvdW50ZXJDbG9ja3dpc2UoKSB7XHJcblx0XHR0aGlzLnJvdGF0aW9uIC09IDkwO1xyXG5cdFx0dGhpcy51cGRhdGVTdHlsZSgpO1xyXG5cdH1cclxuXHJcblx0b25Mb2FkKCkge1xyXG5cdFx0dGhpcy5sb2FkaW5nID0gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRvbkxvYWRTdGFydCgpIHtcclxuXHRcdHRoaXMubG9hZGluZyA9IHRydWU7XHJcblx0fVxyXG5cclxuXHRvbkRyYWdPdmVyKGV2dCkge1xyXG5cdFx0aWYodGhpcy5jb25maWcuYWxsb3dEcmFnKXtcclxuXHRcdFx0dGhpcy50cmFuc2xhdGVYICs9IChldnQuY2xpZW50WCAtIHRoaXMucHJldlgpO1xyXG5cdFx0XHR0aGlzLnRyYW5zbGF0ZVkgKz0gKGV2dC5jbGllbnRZIC0gdGhpcy5wcmV2WSk7XHJcblx0XHRcdHRoaXMucHJldlggPSBldnQuY2xpZW50WDtcclxuXHRcdFx0dGhpcy5wcmV2WSA9IGV2dC5jbGllbnRZO1xyXG5cdFx0XHR0aGlzLnVwZGF0ZVN0eWxlKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRvbkRyYWdTdGFydChldnQpIHtcclxuXHRcdGlmKHRoaXMuY29uZmlnLmFsbG93RHJhZyl7XHJcblx0XHRcdGlmIChldnQuZGF0YVRyYW5zZmVyICYmIGV2dC5kYXRhVHJhbnNmZXIuc2V0RHJhZ0ltYWdlKSB7XHJcblx0XHRcdFx0ZXZ0LmRhdGFUcmFuc2Zlci5zZXREcmFnSW1hZ2UoZXZ0LnRhcmdldC5uZXh0RWxlbWVudFNpYmxpbmcsIDAsIDApO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMucHJldlggPSBldnQuY2xpZW50WDtcclxuXHRcdFx0dGhpcy5wcmV2WSA9IGV2dC5jbGllbnRZO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dG9nZ2xlRnVsbHNjcmVlbigpIHtcclxuXHRcdGlmICghdGhpcy5mdWxsc2NyZWVuKSB7XHJcblx0XHRcdHRoaXMub3BlbkZ1bGxzY3JlZW4oKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuY2xvc2VGdWxsc2NyZWVuKCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRvcGVuRnVsbHNjcmVlbigpIHtcclxuXHRcdGlmICh0aGlzLmZ1bGxzY3JlZW5FbGVtZW50Lm5hdGl2ZUVsZW1lbnQucmVxdWVzdEZ1bGxzY3JlZW4pIHtcclxuXHRcdFx0dGhpcy5mdWxsc2NyZWVuRWxlbWVudC5uYXRpdmVFbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKCk7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuZnVsbHNjcmVlbkVsZW1lbnQubmF0aXZlRWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbikge1xyXG5cdFx0XHQvKiBGaXJlZm94ICovXHJcblx0XHRcdHRoaXMuZnVsbHNjcmVlbkVsZW1lbnQubmF0aXZlRWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbigpO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLmZ1bGxzY3JlZW5FbGVtZW50Lm5hdGl2ZUVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4pIHtcclxuXHRcdFx0LyogQ2hyb21lLCBTYWZhcmkgYW5kIE9wZXJhICovXHJcblx0XHRcdHRoaXMuZnVsbHNjcmVlbkVsZW1lbnQubmF0aXZlRWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbigpO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLmZ1bGxzY3JlZW5FbGVtZW50Lm5hdGl2ZUVsZW1lbnQubXNSZXF1ZXN0RnVsbHNjcmVlbikge1xyXG5cdFx0XHQvKiBJRS9FZGdlICovXHJcblx0XHRcdHRoaXMuZnVsbHNjcmVlbkVsZW1lbnQubmF0aXZlRWxlbWVudC5tc1JlcXVlc3RGdWxsc2NyZWVuKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKFwiVW5hYmxlIHRvIG9wZW4gaW4gZnVsbHNjcmVlblwiKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNsb3NlRnVsbHNjcmVlbigpIHtcclxuXHRcdGlmICh0aGlzLmRvY3VtZW50LmV4aXRGdWxsc2NyZWVuKSB7XHJcblx0XHRcdHRoaXMuZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4oKTtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy5kb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKSB7XHJcblx0XHRcdC8qIEZpcmVmb3ggKi9cclxuXHRcdFx0dGhpcy5kb2N1bWVudC5tb3pDYW5jZWxGdWxsU2NyZWVuKCk7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuZG9jdW1lbnQud2Via2l0RXhpdEZ1bGxzY3JlZW4pIHtcclxuXHRcdFx0LyogQ2hyb21lLCBTYWZhcmkgYW5kIE9wZXJhICovXHJcblx0XHRcdHRoaXMuZG9jdW1lbnQud2Via2l0RXhpdEZ1bGxzY3JlZW4oKTtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy5kb2N1bWVudC5tc0V4aXRGdWxsc2NyZWVuKSB7XHJcblx0XHRcdC8qIElFL0VkZ2UgKi9cclxuXHRcdFx0dGhpcy5kb2N1bWVudC5tc0V4aXRGdWxsc2NyZWVuKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKFwiVW5hYmxlIHRvIGNsb3NlIGZ1bGxzY3JlZW5cIik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR0cmlnZ2VySW5kZXhCaW5kaW5nKCkge1xyXG5cdFx0dGhpcy5pbmRleENoYW5nZS5lbWl0KHRoaXMuaW5kZXgpO1xyXG5cdH1cclxuXHJcblx0dHJpZ2dlckNvbmZpZ0JpbmRpbmcoKSB7XHJcblx0XHR0aGlzLmNvbmZpZ0NoYW5nZS5uZXh0KHRoaXMuY29uZmlnKTtcclxuXHR9XHJcblxyXG5cdGZpcmVDdXN0b21FdmVudChuYW1lLCBpbWFnZUluZGV4KSB7XHJcblx0XHR0aGlzLmN1c3RvbUV2ZW50LmVtaXQobmV3IEN1c3RvbUV2ZW50KG5hbWUsIGltYWdlSW5kZXgpKTtcclxuXHR9XHJcblxyXG5cdHJlc2V0KCkge1xyXG5cdFx0dGhpcy5zY2FsZSA9IDE7XHJcblx0XHR0aGlzLnJvdGF0aW9uID0gMDtcclxuXHRcdHRoaXMudHJhbnNsYXRlWCA9IDA7XHJcblx0XHR0aGlzLnRyYW5zbGF0ZVkgPSAwO1xyXG5cdFx0dGhpcy51cGRhdGVTdHlsZSgpO1xyXG5cdH1cclxuXHJcblx0QEhvc3RMaXN0ZW5lcignbW91c2VvdmVyJylcclxuXHRvbk1vdXNlT3ZlcigpIHtcclxuXHRcdHRoaXMuaG92ZXJlZCA9IHRydWU7XHJcblx0fVxyXG5cclxuXHRASG9zdExpc3RlbmVyKCdtb3VzZWxlYXZlJylcclxuXHRvbk1vdXNlTGVhdmUoKSB7XHJcblx0XHR0aGlzLmhvdmVyZWQgPSBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgY2FuTmF2aWdhdGUoZXZlbnQ6IGFueSkge1xyXG5cdFx0cmV0dXJuIGV2ZW50ID09IG51bGwgfHwgKHRoaXMuY29uZmlnLmFsbG93S2V5Ym9hcmROYXZpZ2F0aW9uICYmIHRoaXMuaG92ZXJlZCk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIHVwZGF0ZVN0eWxlKCkge1xyXG5cdFx0dGhpcy5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7dGhpcy50cmFuc2xhdGVYfXB4LCAke3RoaXMudHJhbnNsYXRlWX1weCkgcm90YXRlKCR7dGhpcy5yb3RhdGlvbn1kZWcpIHNjYWxlKCR7dGhpcy5zY2FsZX0pYDtcclxuXHRcdHRoaXMuc3R5bGUubXNUcmFuc2Zvcm0gPSB0aGlzLnN0eWxlLnRyYW5zZm9ybTtcclxuXHRcdHRoaXMuc3R5bGUud2Via2l0VHJhbnNmb3JtID0gdGhpcy5zdHlsZS50cmFuc2Zvcm07XHJcblx0XHR0aGlzLnN0eWxlLm9UcmFuc2Zvcm0gPSB0aGlzLnN0eWxlLnRyYW5zZm9ybTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgbWVyZ2VDb25maWcoZGVmYXVsdFZhbHVlczogSW1hZ2VWaWV3ZXJDb25maWcsIG92ZXJyaWRlVmFsdWVzOiBJbWFnZVZpZXdlckNvbmZpZyk6IEltYWdlVmlld2VyQ29uZmlnIHtcclxuXHRcdGxldCByZXN1bHQ6IEltYWdlVmlld2VyQ29uZmlnID0geyAuLi5kZWZhdWx0VmFsdWVzIH07XHJcblx0XHRpZiAob3ZlcnJpZGVWYWx1ZXMpIHtcclxuXHRcdFx0cmVzdWx0ID0geyAuLi5kZWZhdWx0VmFsdWVzLCAuLi5vdmVycmlkZVZhbHVlcyB9O1xyXG5cclxuXHRcdFx0aWYgKG92ZXJyaWRlVmFsdWVzLmJ0bkljb25zKSB7XHJcblx0XHRcdFx0cmVzdWx0LmJ0bkljb25zID0geyAuLi5kZWZhdWx0VmFsdWVzLmJ0bkljb25zLCAuLi5vdmVycmlkZVZhbHVlcy5idG5JY29ucyB9O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH1cclxuXHJcbn1cclxuIiwiPGRpdiAjZnVsbHNjcmVlbkVsZW1lbnQgY2xhc3M9XCJpbWctY29udGFpbmVyXCIgW3N0eWxlLmJhY2tncm91bmRDb2xvcl09XCJjb25maWcuY29udGFpbmVyQmFja2dyb3VuZENvbG9yXCJcclxuXHQod2hlZWwpPVwic2Nyb2xsWm9vbSgkZXZlbnQpXCIgKGRyYWdvdmVyKT1cIm9uRHJhZ092ZXIoJGV2ZW50KVwiPlxyXG5cdDxpbWcgW3NyY109XCJzcmNbaW5kZXhdXCIgW25nU3R5bGVdPVwic3R5bGVcIiBhbHQ9XCJJbWFnZSBub3QgZm91bmQuLi5cIiAoZHJhZ3N0YXJ0KT1cIm9uRHJhZ1N0YXJ0KCRldmVudClcIlxyXG5cdFx0KGxvYWQpPVwib25Mb2FkKClcIiAobG9hZHN0YXJ0KT1cIm9uTG9hZFN0YXJ0KClcIiAvPlxyXG5cdDwhLS0gRGl2IGJlbG93IHdpbGwgYmUgdXNlZCB0byBoaWRlIHRoZSAnZ2hvc3QnIGltYWdlIHdoZW4gZHJhZ2dpbmcgLS0+XHJcblx0PGRpdj48L2Rpdj5cclxuXHQ8ZGl2IGNsYXNzPVwic3Bpbm5lci1jb250YWluZXJcIiAqbmdJZj1cImxvYWRpbmdcIj5cclxuXHRcdDxkaXYgY2xhc3M9XCJzcGlubmVyXCI+PC9kaXY+XHJcblx0PC9kaXY+XHJcblxyXG5cdDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG1hdC1taW5pLWZhYiBbY2xhc3NdPVwiY29uZmlnLmJ0bkNsYXNzXCIgKm5nSWY9XCJjb25maWcuYnRuU2hvdy5yb3RhdGVDb3VudGVyQ2xvY2t3aXNlXCJcclxuXHRcdChjbGljayk9XCJyb3RhdGVDb3VudGVyQ2xvY2t3aXNlKClcIj5cclxuXHRcdDxzcGFuIFtjbGFzc109XCJjb25maWcuYnRuSWNvbnMucm90YXRlQ291bnRlckNsb2Nrd2lzZVwiPjwvc3Bhbj5cclxuXHQ8L2J1dHRvbj5cclxuXHQ8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBtYXQtbWluaS1mYWIgW2NsYXNzXT1cImNvbmZpZy5idG5DbGFzc1wiICpuZ0lmPVwiY29uZmlnLmJ0blNob3cucm90YXRlQ2xvY2t3aXNlXCIgKGNsaWNrKT1cInJvdGF0ZUNsb2Nrd2lzZSgpXCI+XHJcblx0XHQ8c3BhbiBbY2xhc3NdPVwiY29uZmlnLmJ0bkljb25zLnJvdGF0ZUNsb2Nrd2lzZVwiPjwvc3Bhbj5cclxuXHQ8L2J1dHRvbj5cclxuXHJcblx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgbWF0LW1pbmktZmFiIFtjbGFzc109XCJjb25maWcuYnRuQ2xhc3NcIiAqbmdJZj1cImNvbmZpZy5idG5TaG93Lnpvb21PdXRcIiAoY2xpY2spPVwiem9vbU91dCgpXCI+XHJcblx0XHQ8c3BhbiBbY2xhc3NdPVwiY29uZmlnLmJ0bkljb25zLnpvb21PdXRcIj48L3NwYW4+XHJcblx0PC9idXR0b24+XHJcblx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgbWF0LW1pbmktZmFiIFtjbGFzc109XCJjb25maWcuYnRuQ2xhc3NcIiAqbmdJZj1cImNvbmZpZy5idG5TaG93Lnpvb21JblwiIChjbGljayk9XCJ6b29tSW4oKVwiPlxyXG5cdFx0PHNwYW4gW2NsYXNzXT1cImNvbmZpZy5idG5JY29ucy56b29tSW5cIj48L3NwYW4+XHJcblx0PC9idXR0b24+XHJcblxyXG5cdDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG1hdC1taW5pLWZhYiBbY2xhc3NdPVwiY29uZmlnLmJ0bkNsYXNzXCIgKm5nRm9yPVwibGV0IGNCdG4gb2YgY29uZmlnLmN1c3RvbUJ0bnNcIlxyXG5cdFx0KGNsaWNrKT1cImZpcmVDdXN0b21FdmVudChjQnRuLm5hbWUsIGluZGV4KVwiPlxyXG5cdFx0PHNwYW4gW2NsYXNzXT1cImNCdG4uaWNvblwiPjwvc3Bhbj5cclxuXHQ8L2J1dHRvbj5cclxuXHJcblx0PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJuZ3gtZnMtYnRuXCIgbWF0LW1pbmktZmFiIFtjbGFzc109XCJjb25maWcuYnRuQ2xhc3NcIiAoY2xpY2spPVwidG9nZ2xlRnVsbHNjcmVlbigpXCJcclxuXHRcdCpuZ0lmPVwiY29uZmlnLmFsbG93RnVsbHNjcmVlblwiPlxyXG5cdFx0PHNwYW4gW2NsYXNzXT1cImNvbmZpZy5idG5JY29ucy5mdWxsc2NyZWVuXCI+PC9zcGFuPlxyXG5cdDwvYnV0dG9uPlxyXG5cclxuXHQ8ZGl2IGNsYXNzPVwibmF2LWJ1dHRvbi1jb250YWluZXJcIiAqbmdJZj1cInNyYy5sZW5ndGggPiAxXCI+XHJcblx0XHQ8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBtYXQtbWluaS1mYWIgW2NsYXNzXT1cImNvbmZpZy5idG5DbGFzc1wiIChjbGljayk9XCJwcmV2SW1hZ2UoJGV2ZW50KVwiIFtkaXNhYmxlZF09XCJpbmRleCA9PT0gMFwiPlxyXG5cdFx0XHQ8c3BhbiBbY2xhc3NdPVwiY29uZmlnLmJ0bkljb25zLnByZXZcIj48L3NwYW4+XHJcblx0XHQ8L2J1dHRvbj5cclxuXHRcdDxidXR0b24gdHlwZT1cImJ1dHRvblwiIG1hdC1taW5pLWZhYiBbY2xhc3NdPVwiY29uZmlnLmJ0bkNsYXNzXCIgKGNsaWNrKT1cIm5leHRJbWFnZSgkZXZlbnQpXCJcclxuXHRcdFx0W2Rpc2FibGVkXT1cImluZGV4ID09PSBzcmMubGVuZ3RoIC0gMVwiPlxyXG5cdFx0XHQ8c3BhbiBbY2xhc3NdPVwiY29uZmlnLmJ0bkljb25zLm5leHRcIj48L3NwYW4+XHJcblx0XHQ8L2J1dHRvbj5cclxuXHQ8L2Rpdj5cclxuPC9kaXY+XHJcbiJdfQ==