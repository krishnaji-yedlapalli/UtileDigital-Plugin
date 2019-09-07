cordova.define("photoeditor.imageViewer", function(require, exports, module) {
/*! imageViewer.js, WalkingTree ( walkingtree.tech ) */
fabric = fabric.fabric;
var imageViewer = imageViewer || {
    version: '1.0.0',
    fabricVersion: '3.2.0',
    startX: null,
    startY: null,
    fabricCanvas: null,
    canvas: null,
    canvasOptions: {
        backgroundColor: '#fff',
        selection: false,
        isDrawingMode: false
    },
    options: {
        minWidth: 100,
        minHeight: 100,
        maxWidth: 100,
        maxHeight: 200,
        ratio: 4 / 3,
        backgroundColor: '#000'
    },
    defaultImageProps: {
        // left: 0,
        // top: 0,
        hoverCursor: 'null',
        type: 'image',
        moveCursor: 'null',
        isMoving: false,
        selectable: false,
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false
    },
    defaultTextProps: {
        cornerSize: 25,
        fontSize: 50,
        fontWeight: 500
    },
    defaultCornerProps: {
        cornerStrokeColor: 'rgb(17, 71, 146)',
        cornerColor: 'rgb(17, 71, 146)',
        cornerStyle: 'circle',
        cornerSize: 25,
        transparentCorners: false
    },
    freeDrawProps: {
        stroke: 'rgba(204, 0, 0, 1)',
        borderDiameter: 20
    },
    defaultShapeProps: {
        fill: 'transparent',
        cornerSize: 25,
        width: 140,
        height: 140,
        strokeWidth: 10,
        radius: 70,
        lineColor: 'rgba(204, 0, 0, 1)',
        stroke: 'rgba(204, 0, 0, 1)'
    },
    defaultSquareProps: {
        width: 140,
        height: 140,
        strokeWidth: 10,
    },
    canIdiscard: false,
    minCacheLimit: 15,
    removedCache: [],
    cacheCanvasList: [],
    runningCacheItem: 0,
    defaultCacheProps: {
        'undo': true,
        'redo': false
    },
    canvasImg: null,
    cropdefaultHeight: 0,
    cropdefaultWidth: 0,
    languageDirection: {
        ltr: true
    },
    presentZoom: 1,
    isStillDrawEnabled: false,
    isTablet: false

};
if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    if (document instanceof HTMLDocument) {
        imageViewer.document = document;
    } else {
        imageViewer.document = document.implementation.createHTMLDocument("");
    }
    imageViewer.window = window;
} else {
    imageViewer.document = fabric.document;
    imageViewer.window = fabric.document.defaultView;
}
// Source img for fabric canvas. Its a base object on the screen
// imageViewer.canvasImg = canvasImgSource;
// imageViewer.canvasImg = canvasImgSourceClient;

/**
* @method
* Initialize the fabric canvas and call the internal required methods
* @param canvasData options object with below properties
* { height: 736, width: 414, imageUrl: 'base64://...', canvasId: 'dom-canvas', callback: function(){} }
*/
imageViewer.initialize = function (canvasData) {
    var data = canvasData || {};
    this.canvas = this.document.getElementById(data.canvasId || 'ud-canvas');
    if (this.canvas) {
        this.fabricCanvas = new fabric.Canvas(this.canvas, this.canvasOptions);
        data.height = data.height || document.getElementById("ud-canvas").offsetHeight,
            data.width = data.width || document.getElementById("ud-canvas").offsetWidth;

        this.fabricCanvas.setHeight(data.height - this.canvasMargins.height);
        this.fabricCanvas.setWidth(data.width - this.canvasMargins.width);

        var ctx = this.fabricCanvas.getContext();
        // ctx.imageSmoothingQuality = 'low';
        this.bindEventsOnCanvas();
        data.cropFullZone = function () {
            imageViewer.cropdefaultHeight = imageViewer.fabricCanvas.height - 2;
            imageViewer.cropdefaultWidth = imageViewer.fabricCanvas.width - 2;
            imageViewer.setActivateCropZone();
            imageViewer.cacheCanvasList = [];
            imageViewer.cropCurrentZone(function () {
                imageViewer.doCache();
                imageViewer.cropdefaultHeight = imageViewer.fabricCanvas.height / 2;
                imageViewer.cropdefaultWidth = imageViewer.fabricCanvas.width / 2;
                data.callback();
                // if (imageViewer.runningCacheItem > 0) {
                //     imageViewer.enableUndoRedo({ 'undo': true });
                //     imageViewer.doEnableUndo();
                // }
            });
        }
        this.addImageOnCanvas(data);
    }
};

/**
* @method
* Bind the user interaction events on fabric canvas
*/
imageViewer.bindEventsOnCanvas = function () {
    // imageViewer.activateZoom(); 
    var lastX = 0,
        lastY = 0,
        zoomStartScale,
        // previousX = 0,
        // previousY = 0,
        drawPointer = { x: 0, y: 0 },
        zoomTime,
        panningTime,
        drawTime,
        freeDrawWidth = 1,
        pausePanning = true;
    this.fabricCanvas.on({
        'object:added': function (o) {
            var sourceObj = o.target;
            if (sourceObj &&
                sourceObj.type &&
                sourceObj.type !== 'image') {
                imageViewer.canIdiscard = true;
                // imageViewer.enableUndoRedo({ 'redo': false });
                var objLength = imageViewer.fabricCanvas.getObjects().length
                if (objLength > 1) {
                    imageViewer.fireTextEvents('locktheorientation');
                }
            }
        },
        'object:removed': function (o) {
            var target = o.target;
            if (target) {
                var objLength = imageViewer.fabricCanvas.getObjects().length
                if (objLength <= 1) {
                    imageViewer.fireTextEvents('unlocktheorientation');
                }
            }

        },
        'object:scaling': function (o) {
            var target = o.target;
            if (target) {
                var type = target.type;
                switch (type) {
                    case 'line':
                    case 'cropzone':
                    case 'circle':
                    case 'triangle':
                    case 'rect':
                    case 'path':
                    case 'textbox':
                        // imageViewer.setObjectBoundaryLimit(target);
                        imageViewer._handleScaling(target, o);
                        imageViewer.canIdiscard = true;
                        if (type === 'textbox') {
                            target.prevProp = null;
                        }
                        break;
                    default:
                        break;
                }
                imageViewer.enableUndoRedo({ 'redo': false });
            }
        },
        'object:moving': function (o) {
            var target = o.target;
            if (target) {
                var type = target.type;
                switch (type) {
                    case 'line':
                    case 'cropzone':
                    case 'circle':
                    case 'triangle':
                    case 'rect':
                    case 'path':
                    case 'textbox':
                        // imageViewer.setObjectBoundaryLimit(target);
                        imageViewer._handleDragging(target);
                        imageViewer.canIdiscard = true;
                        if (type === 'textbox') {
                            target.prevProp = null;
                        }
                        break;
                    case 'image':
                        imageViewer.canIdiscard = true;
                        break;
                    default:
                        break;
                }
            }
            imageViewer.enableUndoRedo({ 'redo': false });
        },
        'mouse:down': function (o) {
            console.log(o, 'down');
            if (o.e && o.e.clientX) {
                lastX = o.e.clientX;
                lastY = o.e.clientY;
            } else if (o.e && o.e.touches.length) {
                lastX = o.e.touches[0].clientX;
                lastY = o.e.touches[0].clientY;
            }

            if (imageViewer.isStillDrawEnabled && o.e && o.e.touches && o.e.touches.length === 2) {
                imageViewer.restrictSelectionWhileZooming(true);
                this.renderAll();
                imageViewer.fabricCanvas.isDrawingMode = false;
                this.requestRenderAll();
            }

            var target = o.target;
            if (target) {
                var type = target.type;
                switch (type) {
                    case 'line':
                    case 'rect':
                    case 'circle':
                    case 'triangle':
                        imageViewer.removeCropZone();
                        imageViewer.showShapeProps(target);
                        break;
                    case 'path':
                        imageViewer.removeCropZone();
                        imageViewer.muteFreeDrawObjects();
                        imageViewer.showDrawProps(target);
                        break;
                    case 'cropzone':
                        imageViewer.cropZoneSelected();
                        break;
                    case 'textbox':
                        imageViewer.removeCropZone();
                        imageViewer.showTextBoxProps(target);
                    case 'image':
                        if (!imageViewer.isStillDrawEnabled) {
                            imageViewer.fireUnSelectObjectEvent();
                        }
                        imageViewer.fireTextEvents('hideSlider');
                    default:
                        imageViewer.log({
                            type: 'info',
                            msg: 'Mouse down on ' + type,
                            method: 'mouse:down'
                        });
                        break;
                }
            } else {
                imageViewer.log({
                    type: 'error',
                    msg: 'Mouse down on null target',
                    method: 'mouse:down'
                });
            }
        },
        'mouse:up': function (o) {

            console.log(o, 'up');
            if (o && o.target) {
                if (imageViewer.fabricCanvas.isDrawingMode) {
                    imageViewer.muteFreeDrawObjects();
                    imageViewer.enableUndoRedo({ 'redo': false });
                }
            }
        },
        'text:editing:exited': function (o) {
            if (o && o.target) {
                o.target.setCoords();
                imageViewer.fabricCanvas.requestRenderAll();
                imageViewer.enableUndoRedo({ 'redo': false });
                imageViewer.fireTextEvents('texteditingexited');
            }
        },
        'text:editing:entered': function (o) {
            // iText zooming in onfocus issue
            if (o && o.target) {
                var text = o.target;
                text.hiddenTextarea.style.height = text.fontSize + 'px';
                text.hiddenTextarea.style.width = '0px';
                text.hiddenTextarea.style['caret-color'] = 'transparent';
                text.hiddenTextarea.style['font-size'] = '16px';
                imageViewer.fireTextEvents('texteditingstarted');
                text.selectAll();
            }
        },
        'text:changed': function (o) {
            console.log('hu');
            var target = o.target;
            if (target) {
                var ltrChars = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF' + '\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
                    rtlChars = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
                    rtlDirCheck = new RegExp('^[^' + ltrChars + ']*[' + rtlChars + ']');
                if (rtlDirCheck.test(target.text)) {
                    direction = 'right';
                } else {
                    direction = 'left';
                }
                target.textAlign = direction;
                target.originX = direction;
                imageViewer.textBoxWrapper(o.target);
            }
        },
        'mouse:move': function (e) {
            console.log(e, 'move');

            //for dragging purpose
            var zoomValue = imageViewer.fabricCanvas.getZoom();
            if (e.e && e.e.touches && e.e.touches.length === 1 && (!this.isDrawingMode && !imageViewer.isStillDrawEnabled) && zoomValue > 1 && (e.e.type === "touchmove" || e.e.type === "mousemove")) {
                if (e.target == null || (e.target && e.target.type == 'image')) {
                    var e = e.e;
                    previousX = this.viewportTransform[4];
                    previousY = this.viewportTransform[5];
                    this.viewportTransform[4] += e.touches[0].clientX - lastX;
                    this.viewportTransform[5] += e.touches[0].clientY - lastY;
                    imageViewer.fabricCanvas.requestRenderAll();

                    if (zoomTime) clearTimeout(zoomTime);
                    zoomTime = setTimeout(function () {
                        if (imageViewer.fabricCanvas.getZoom() <= 1) return;
                        var ivp = fabric.util.invertTransform(imageViewer.fabricCanvas.viewportTransform);
                        var x = ivp[4];
                        var y = ivp[5];
                        var obj = imageViewer.fabricCanvas.getObjects();
                        obj = obj.length ? obj[0] : {};
                        if (x < 0 || y < 0) {
                            if (x < 0 && y < 0) {
                                imageViewer.fabricCanvas.viewportTransform[4] = 0;
                                imageViewer.fabricCanvas.viewportTransform[5] = 0;
                                imageViewer.fabricCanvas.requestRenderAll();
                            } else if (x < 0) {
                                imageViewer.fabricCanvas.viewportTransform[4] = 0;
                                imageViewer.fabricCanvas.requestRenderAll();
                            } else {
                                imageViewer.fabricCanvas.viewportTransform[5] = 0;
                                imageViewer.fabricCanvas.requestRenderAll();
                            }
                        }
                        if (x > 0 || y > 0) {
                            if (obj && obj.type === 'image') {
                                var vp = imageViewer.fabricCanvas.viewportTransform;
                                var imgWidth = obj.getBoundingRect().width;
                                var imgHeight = obj.getBoundingRect().height;
                                var fabricWidth = imageViewer.fabricCanvas.width;
                                var fabricHeight = imageViewer.fabricCanvas.height;
                                var xAxis = (-vp[4] + fabricWidth) >= imgWidth;
                                var yAxis = (-vp[5] + fabricHeight) >= imgHeight;
                                var xValue = imgWidth - fabricWidth;
                                var yValue = imgHeight - fabricHeight;
                                if (xAxis || yAxis) {
                                    if (xAxis && yAxis) {
                                        imageViewer.fabricCanvas.viewportTransform[4] = -xValue;
                                        imageViewer.fabricCanvas.viewportTransform[5] = -yValue;
                                        imageViewer.fabricCanvas.requestRenderAll();
                                    } else if (xAxis) {
                                        imageViewer.fabricCanvas.viewportTransform[4] = -xValue;
                                        imageViewer.fabricCanvas.requestRenderAll();
                                    } else {
                                        imageViewer.fabricCanvas.viewportTransform[5] = -yValue;
                                        imageViewer.fabricCanvas.requestRenderAll();
                                    }
                                }
                            }
                        }

                        //setting cordinates for every object
                        imageViewer.fabricCanvas.setViewportTransform(imageViewer.fabricCanvas.viewportTransform);
                    }, 100);
                    // previousX = this.viewportTransform[4];
                    // previousY = this.viewportTransform[5];
                    lastX = e.touches[0].clientX;
                    lastY = e.touches[0].clientY;

                }
            }
        },
        'touch:gesture': function (e) {
            console.log('gesture', e);
            if (imageViewer.isStillDrawEnabled && e.e.touches && e.e.touches.length === 2) {
                if (drawTime) clearTimeout(drawTime);
                drawTime = setTimeout(function () {
                    imageViewer.restrictSelectionWhileZooming(false);
                    imageViewer.fabricCanvas.freeDrawingBrush._points = [drawPointer];
                    imageViewer.fabricCanvas.renderAll();
                    imageViewer.fabricCanvas.isDrawingMode = true;
                    imageViewer.fabricCanvas.requestRenderAll();
                }, 100);
            }

            if (e.e.touches && e.e.touches.length == 2) {
                pausePanning = true;
                var point = new fabric.Point(e.self.x, e.self.y);
                if (e.self.state == "start") {
                    zoomStartScale = imageViewer.fabricCanvas.getZoom();
                }
                var delta = zoomStartScale * e.self.scale;
                var zoomValue = imageViewer.fabricCanvas.getZoom();
                var touch1 = e.e.touches[0],
                    touch2 = e.e.touches[1],
                    xDiff = 0,
                    yDiff = 0;
                xDiff = (touch1.clientX >= touch2.clientX) ? (touch1.clientX - touch2.clientX) : (touch2.clientX - touch1.clientX);
                yDiff = (touch1.clientY >= touch2.clientY) ? (touch1.clientY - touch2.clientY) : (touch2.clientY - touch1.clientY)
                console.log('diff', xDiff, yDiff, e.e);
                var activeObject = imageViewer.fabricCanvas.getActiveObject(),
                    activeObjType = activeObject ? activeObject.type !== 'cropzone' : true;
                var allowZoom = true;
                if (xDiff < 100 && yDiff < 100) {
                    allowZoom = false;
                } else if (xDiff < 15 && yDiff <= 150) {
                    allowZoom = false;
                } else if (yDiff < 15 && xDiff <= 150) {
                    allowZoom = false;
                }
                if (allowZoom && activeObjType) {
                    // var ivp = fabric.util.invertTransform(imageViewer.fabricCanvas.viewportTransform);
                    // var x = ivp[4];
                    // var y = ivp[5];
                    if (delta < 7) {
                        console.log(point.x, point.y);
                        imageViewer.fabricCanvas.zoomToPoint(point, delta);
                        imageViewer.fabricCanvas.requestRenderAll();

                        if (zoomTime) clearTimeout(zoomTime);
                        zoomTime = setTimeout(function () {
                            if (imageViewer.fabricCanvas.getZoom() <= 1) return;
                            var ivp = fabric.util.invertTransform(imageViewer.fabricCanvas.viewportTransform);
                            var x = ivp[4];
                            var y = ivp[5];
                            var obj = imageViewer.fabricCanvas.getObjects();
                            obj = obj.length ? obj[0] : {};
                            if (x < 0 || y < 0) {
                                if (x < 0 && y < 0) {
                                    imageViewer.fabricCanvas.viewportTransform[4] = 0;
                                    imageViewer.fabricCanvas.viewportTransform[5] = 0;
                                    imageViewer.fabricCanvas.requestRenderAll();
                                } else if (x < 0) {
                                    imageViewer.fabricCanvas.viewportTransform[4] = 0;
                                    imageViewer.fabricCanvas.requestRenderAll();
                                } else {
                                    imageViewer.fabricCanvas.viewportTransform[5] = 0;
                                    imageViewer.fabricCanvas.requestRenderAll();
                                }
                            }
                            if (x > 0 || y > 0) {
                                if (obj && obj.type === 'image') {
                                    var vp = imageViewer.fabricCanvas.viewportTransform;
                                    var imgWidth = obj.getBoundingRect().width;
                                    var imgHeight = obj.getBoundingRect().height;
                                    var fabricWidth = imageViewer.fabricCanvas.width;
                                    var fabricHeight = imageViewer.fabricCanvas.height;
                                    var xAxis = (-vp[4] + fabricWidth) >= imgWidth;
                                    var yAxis = (-vp[5] + fabricHeight) >= imgHeight;
                                    var xValue = imgWidth - fabricWidth;
                                    var yValue = imgHeight - fabricHeight;
                                    if (xAxis || yAxis) {
                                        if (xAxis && yAxis) {
                                            imageViewer.fabricCanvas.viewportTransform[4] = -xValue;
                                            imageViewer.fabricCanvas.viewportTransform[5] = -yValue;
                                            imageViewer.fabricCanvas.requestRenderAll(); imageViewer.fabricCanvas.requestRenderAll();
                                        } else if (xAxis) {
                                            imageViewer.fabricCanvas.viewportTransform[4] = -xValue;
                                            imageViewer.fabricCanvas.requestRenderAll();
                                        } else {
                                            imageViewer.fabricCanvas.viewportTransform[5] = -yValue;
                                            imageViewer.fabricCanvas.requestRenderAll();
                                        }
                                    }
                                }
                            }

                            //setting cordinates for every object
                            imageViewer.fabricCanvas.setViewportTransform(imageViewer.fabricCanvas.viewportTransform);
                        }, 100);
                    }
                }

                pausePanning = false;

                //if zoom value is less than one, than it will set the zoom initial state
                zoomValue = imageViewer.fabricCanvas.getZoom();
                if (zoomValue < 1) {
                    imageViewer.fabricCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
                    imageViewer.presentZoom = 1;
                } else {
                    imageViewer.presentZoom = zoomValue;
                }

            }

            //for dragging purpose
            var zoomValue = imageViewer.fabricCanvas.getZoom();
            if (e.e && e.e.touches && (e.e.touches.length === 2 || e.e.touches.length === 1) && zoomValue > 1 && (e.e.type === "touchmove" || e.e.type === "mousemove")) {
                if (e.target == null || (e.target && e.target.type == 'image')) {
                    var e = e.e;
                    previousX = this.viewportTransform[4];
                    previousY = this.viewportTransform[5];
                    this.viewportTransform[4] += e.touches[0].clientX - lastX;
                    this.viewportTransform[5] += e.touches[0].clientY - lastY;
                    imageViewer.fabricCanvas.requestRenderAll();


                    if (panningTime) clearTimeout(panningTime);
                    panningTime = setTimeout(function () {
                        if (imageViewer.fabricCanvas.getZoom() <= 1) return;
                        var ivp = fabric.util.invertTransform(imageViewer.fabricCanvas.viewportTransform);
                        var x = ivp[4];
                        var y = ivp[5];
                        var obj = imageViewer.fabricCanvas.getObjects();
                        obj = obj.length ? obj[0] : {};
                        if (x < 0 || y < 0) {
                            if (x < 0 && y < 0) {
                                imageViewer.fabricCanvas.viewportTransform[4] = 0;
                                imageViewer.fabricCanvas.viewportTransform[5] = 0;
                                imageViewer.fabricCanvas.requestRenderAll();
                            } else if (x < 0) {
                                imageViewer.fabricCanvas.viewportTransform[4] = 0;
                                imageViewer.fabricCanvas.requestRenderAll();
                            } else {
                                imageViewer.fabricCanvas.viewportTransform[5] = 0;
                                imageViewer.fabricCanvas.requestRenderAll();
                            }
                        }
                        if (x > 0 || y > 0) {
                            if (obj && obj.type === 'image') {
                                var vp = imageViewer.fabricCanvas.viewportTransform;
                                var imgWidth = obj.getBoundingRect().width;
                                var imgHeight = obj.getBoundingRect().height;
                                var fabricWidth = imageViewer.fabricCanvas.width;
                                var fabricHeight = imageViewer.fabricCanvas.height;
                                var xAxis = (-vp[4] + fabricWidth) >= imgWidth;
                                var yAxis = (-vp[5] + fabricHeight) >= imgHeight;
                                var xValue = imgWidth - fabricWidth;
                                var yValue = imgHeight - fabricHeight;
                                if (xAxis || yAxis) {
                                    if (xAxis && yAxis) {
                                        imageViewer.fabricCanvas.viewportTransform[4] = -xValue;
                                        imageViewer.fabricCanvas.viewportTransform[5] = -yValue;
                                    } else if (xAxis) {
                                        imageViewer.fabricCanvas.viewportTransform[4] = -xValue;
                                        imageViewer.fabricCanvas.requestRenderAll();
                                    } else {
                                        imageViewer.fabricCanvas.viewportTransform[5] = -yValue;
                                        imageViewer.fabricCanvas.requestRenderAll();
                                    }
                                }
                            }
                        }

                        //setting cordinates for every object
                        imageViewer.fabricCanvas.setViewportTransform(imageViewer.fabricCanvas.viewportTransform);

                    }, 100);
                    // previousX = this.viewportTransform[4];
                    // previousY = this.viewportTransform[5];
                    lastX = e.touches[0].clientX;
                    lastY = e.touches[0].clientY;

                }
            }

        },
        'touch:drag': function (e) {
            console.log(e.e.type);
        },
        'touch:orientation': function () {
            console.log(' Orientation ');
        },
        'touch:shake': function () {
            console.log(' Shaking ');
        },
        'touch:longpress': function () {
            console.log(' Longpress ');
        },
        'object:rotating': function (o) {
            console.log('Rotate:', o.target);
            var targetItem = o.target;
            if (targetItem) {
                if (targetItem.type === 'image') {
                    targetItem.set({
                        'angle': 0
                    });
                    targetItem.rotate(0);
                    imageViewer.fabricCanvas.centerObject(targetItem);
                    targetItem.setCoords();
                    imageViewer.fabricCanvas.requestRenderAll();
                }
            }
        },
        'before:selection:cleared': function (o) {
            console.log('selection cleared');
        },
        'selection:cleared': function (o) {
            pausePanning = false;
            if (o.deselected) {
                var target = o.deselected[0];
                if (imageViewer.ObjectedSelected) {
                    imageViewer.fabricCanvas.setActiveObject(target);
                    imageViewer.fabricCanvas.renderAll();
                    imageViewer.fireTextEvents('hideSlider');
                }
            }
        },
        'object:selected': function (o) {
            pausePanning = true;
            imageViewer.restrictUnSelection(true, o.target);
            imageViewer.ObjectedSelected = true;
        },
        'path:created': function (o) {
            var pointer = imageViewer.fabricCanvas.freeDrawingBrush._points;
            drawPointer = imageViewer.fabricCanvas.freeDrawingBrush._points[pointer.length - 1];
            imageViewer.fireTextEvents('hideSlider');
            console.log('path created');
        }
    });
};

imageViewer.restrictSelectionWhileZooming = function (flag) {
    if (flag) {
        this.fabricCanvas.forEachObject(function (o) {
            if (o.type === 'image') {
                o.evented = false;
                return;
            }
            o.lockMovementX = true;
            o.lockMovementY = true;
            o.canvas.selection = false;
            o.evented = false;
        });
        return;
    }

    this.fabricCanvas.forEachObject(function (o) {
        if (o.type === 'image') {
            o.evented = true;
            return;
        }
        o.lockMovementX = false;
        o.lockMovementY = false;
        // o.canvas.selection = true;
        o.evented = true;
    });
}


imageViewer.textBoxWrapper = function (obj) {
    obj.setCoords();
    if (obj.getBoundingRect().top < 0 ||
        obj.getBoundingRect().left < 0 ||
        (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height) ||
        (obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width)) {

        if (!obj.prevProp.fontSize || !obj.prevProp.textLen) {
            obj.prevProp.fontSize = [];
            obj.prevProp.textLen = [];
        }
        obj.prevProp.fontSize.push(obj.fontSize);
        obj.prevProp.textLen.push(obj.text.length);
        obj.fontSize *= obj.prevProp.prevheight / (obj.height + 1);
        return;
    } else {
        var textLength = (obj.prevProp && obj.prevProp.textLen) ? obj.prevProp.textLen[obj.prevProp.textLen.length - 1] : '';
        if (textLength > obj.text.length) {
            obj.fontSize = obj.prevProp.fontSize.pop();
            obj.prevProp.textLen.pop();
        }
    }

    if (!obj.prevProp) {
        obj.prevProp = {};

    }
    imageViewer.fabricCanvas.renderAll();
    obj.prevProp.prevheight = obj.height;
}



imageViewer.restrictUnSelection = function (flag, obj) {
    if (this.ObjectedSelected) {
        this.ObjectedSelected = false;
    }
    var objectsLength = this.fabricCanvas.getObjects().length;
    var addedObject = obj || this.fabricCanvas.getObjects()[objectsLength - 1];
    if (flag) {
        this.fabricCanvas.forEachObject(function (o) {
            if (addedObject === o) {
                return;
            }
            if (o.type === 'image') {
                o.evented = false;
                return;
            }
            o.lockMovementX = true;
            o.lockMovementY = true;
            o.canvas.selection = false;
            o.evented = false;
        });
        return;
    }

    var activeObject = this.fabricCanvas.getActiveObject();
    this.fabricCanvas.forEachObject(function (o) {
        if (activeObject === o) {
            return;
        }
        if (o.type === 'image') {
            o.evented = true;
            return;
        }
        o.lockMovementX = false;
        o.lockMovementY = false;
        // o.canvas.selection = true;
        o.evented = true;
    });

    // imageViewer.fabricCanvas.remove(unselectedObject);
    // imageViewer.fabricCanvas.add(unselectedObject);
    // imageViewer.fabricCanvas.setActiveObject(unselectedObject);
    // imageViewer.fabricCanvas.requestRenderAll();
}

/**
* Fire the applyshapeprops when user selects the shape on the canvas
* @param {Object} o 
*/
imageViewer.fireTextEvents = function (e) {
    var event = new Event(e);
    this.canvas.dispatchEvent(event);
};

imageViewer.updateCanvasToCenter = function (marginTop, marginLeft) {
    var canvasWrapper = document.querySelector(".canvas-container");
    canvasWrapper.style.marginTop = marginTop;
    canvasWrapper.style.marginLeft = marginLeft;


};
/**
* @method
* Add image on fabric canvas
* Used fromURL Api and read the image source as an object
* @param data options object with below properties
* { height: 736, width: 414, imageUrl: 'base64://...', canvasId: 'dom-canvas' }
*/
imageViewer.addImageOnCanvas = function (data) {
    // imageViewer.fabricCanvas.setBackgroundImage(data.imageUrl , imageViewer.fabricCanvas.renderAll.bind(imageViewer.fabricCanvas), {
    //     scaleX: imageViewer.fabricCanvas.width / img.width,
    //     scaleY: imageViewer.fabricCanvas.height / img.height
    //  });
    fabric.Image.fromURL(data.imageUrl || this.canvasImg, function (img) {
        // imageViewer.img = imageViewer.fabricCanvas.setBackgroundImage(data.imageUrl , imageViewer.fabricCanvas.renderAll.bind(imageViewer.fabricCanvas), {
        //     scaleX: imageViewer.fabricCanvas.width / img.width,
        //     scaleY: imageViewer.fabricCanvas.height / img.height
        //  });
        imageViewer.origImgHeight = img.height;
        imageViewer.origImgWidth = img.width;
        imageViewer.origCanvasHeight = imageViewer.fabricCanvas.height;
        imageViewer.origCanvasWidth = imageViewer.fabricCanvas.width;
        var size = imageViewer.calculateAspectRatioFit(img.width, img.height, imageViewer.fabricCanvas.width, imageViewer.fabricCanvas.height)
        imageViewer.size = size;
        imageViewer.fabricCanvas.setWidth(size.width);
        imageViewer.fabricCanvas.setHeight(size.height);
        imageViewer.updateCanvasToCenter(size.marginTop, size.marginLeft);

        //imageViewer.fabricCanvas.size = size;
        img.set({
            // width: 337, //imageViewer.fabricCanvas.getHeight()*.7, 
            // height: 482,//imageViewer.fabricCanvas.getHeight(), 
            originX: 'left',
            scaleX: imageViewer.fabricCanvas.width / img.width,
            scaleY: imageViewer.fabricCanvas.height / img.height,
            originY: 'top'
        });
        // imageViewer.fabricCanvas.setBackgroundImage(img, imageViewer.fabricCanvas.renderAll.bind(imageViewer.fabricCanvas));
        img.set(imageViewer.defaultImageProps);
        // imageViewer.fabricCanvas.add(oImg);
        // if (oImg.height > oImg.width) {
        //     oImg.scaleToHeight(data.height);
        // } else {
        //     oImg.scaleToWidth(data.width);
        // }
        imageViewer.fabricCanvas.sendToBack();
        imageViewer.fabricCanvas.sendBackwards(img);
        imageViewer.fabricCanvas.centerObject(img);
        imageViewer.img = img;
        imageViewer.applyDefaultFilters();
        imageViewer.doCache();
        if (typeof data.cropFullZone === "function") {
            // Call it, since we have confirmed it is callable
            imageViewer.rotateImage(270);
            return data.cropFullZone();
        }
    });
};
// imageViewer.updateCanvasSize = function () {
//     var oImg =  imageViewer.img;
//     if(oImg){
//         if(oImg.height > oImg.width){
//             oImg.scaleToHeight(imageViewer.fabricCanvas.height);
//         } else {
//             oImg.scaleToWidth(imageViewer.fabricCanvas.width);
//         }
//         oImg.setCoords();
//         imageViewer.fabricCanvas.centerObject(oImg);
//         imageViewer.fabricCanvas.requestRenderAll();
//     }
// };
/**
* @method hasFocus
* Method to check the crop-zone is available or nor
*/
imageViewer.hasFocus = function () {
    return this.cropZone !== undefined;
};

/**
* @method setActivateCropZone
* @public
* Method can be called from DOM to be enabled crop-zone on fabric canvas
*/
imageViewer.setActivateCropZone = function () {
    var canvas = imageViewer.fabricCanvas;
    this.cropZone = new fabric.Rect({
        type: 'cropzone',
        hasBorders: false,
        originX: 'left',
        fill: 'transparent',
        stroke: constants.controlColor,
        cornerStrokeColor: constants.controlColor,
        cornerColor: constants.controlColor,
        cornerSize: imageViewer.isTablet ? 30 : 25,
        strokeWidth: 2 / imageViewer.presentZoom,
        originY: 'top',
        width: imageViewer.cropdefaultWidth / imageViewer.presentZoom,
        height: imageViewer.cropdefaultHeight / imageViewer.presentZoom,
        transparentCorners: false,
        lockRotation: true,
        hasRotatingPoint: false
    });
    this.fabricCanvas.add(this.cropZone);
    this.cropZone.setCoords();
    this.cropZone.center();
    this.fabricCanvas.setActiveObject(this.cropZone);

    var zoomValue = imageViewer.fabricCanvas.getZoom();
    if (zoomValue > 1) {
        var iM = fabric.util.invertTransform(imageViewer.fabricCanvas.viewportTransform);
        var y = ((imageViewer.fabricCanvas.height / imageViewer.presentZoom)) / 2 - (this.cropZone.height / 2);
        var x = ((imageViewer.fabricCanvas.width / imageViewer.presentZoom)) / 2 - (this.cropZone.width / 2);
        // var point = new fabric.Point(x, y);
        // var transformedPoint = fabric.util.transformPoint(point, iM);
        this.cropZone.left = iM[4] + x;
        this.cropZone.top = iM[5] + y;
        this.cropZone.setCoords();
    }

    this.fabricCanvas.requestRenderAll();
    imageViewer.enableUndoRedo({ 'redo': false });
};

/**
* Method loads the new source which is croped on the canvas
* @param {*} position 
* @param {*} canvas 
* @param {*} image 
* @param {*} next 
*/
imageViewer.applyTransformation = function (position, canvas, image, next) {
    // Snapshot the image delimited by the crop zone
    var snapshot = new Image();
    snapshot.onload = function () {
        var size = imageViewer.calculateAspectRatioFit(snapshot.width, snapshot.height, imageViewer.origCanvasWidth, imageViewer.origCanvasHeight);
        imageViewer.fabricCanvas.setWidth(size.width);
        imageViewer.fabricCanvas.setHeight(size.height);
        imageViewer.updateCanvasToCenter(size.marginTop, size.marginLeft);
        //  imageViewer.fabricCanvas.size = size;
        imageViewer.origImgHeight = snapshot.height;
        imageViewer.origImgWidth = snapshot.width;
        imageViewer.size = size;
        var imgInstance = new fabric.Image(this, {
            // options to make the image static
            selectable: false,
            // width: imageViewer.fabricCanvas.width,
            // height: imageViewer.fabricCanvas.height,
            originX: 'left',
            scaleX: imageViewer.fabricCanvas.width / snapshot.width,
            scaleY: imageViewer.fabricCanvas.height / snapshot.height,
            originY: 'top',
            evented: false,
            lockMovementX: true,
            lockMovementY: true,
            lockRotation: true,
            lockScalingX: true,
            lockScalingY: true,
            lockUniScaling: true,
            hasControls: false,
            hasBorders: false
        });

        // Add image
        imageViewer.fabricCanvas.discardActiveObject();
        imageViewer.fabricCanvas.remove(imageViewer.fabricCanvas, imageViewer.img);
        imageViewer.fabricCanvas.add(imgInstance);
        imgInstance.setCoords();
        // imageViewer.setActivateCropZone();
        next(imgInstance);
    };

    // var viewport = this.computeImageViewPort(image);
    // var imageWidth = viewport.width;
    // var imageHeight = viewport.height;

    // var left = this.options.left * imageWidth;
    // var top = this.options.top * imageHeight;
    // var width = Math.min(this.options.width * imageWidth, imageWidth - left);
    // var height = Math.min(this.options.height * imageHeight, imageHeight - top);
    imageViewer.removeCropZone();

    snapshot.src = canvas.toDataURL({
        left: this.options.left,
        top: this.options.top,
        width: this.options.width,
        height: this.options.height,
        enableRetinaScaling: true
    });
};
/**
* It will check for cropzone than remove cropzone object from canvas
* Set redo property false
*/
imageViewer.removeCropZone = function () {
    if (!this.hasFocus()) {
        return;
    }
    imageViewer.fabricCanvas.remove(imageViewer.fabricCanvas, this.cropZone);
    this.cropZone = undefined;
    this.fabricCanvas.requestRenderAll();
    imageViewer.enableUndoRedo({ 'redo': false });
};
/**
* Get the selected area from the screen and calculate the co-ordinates
* Send those coordinates to {#link applyTransformation()} method
* @param {*} callback 
*/
imageViewer.cropCurrentZone = function (callback) {
    // Avoid croping empty zone
    var rectBoundaries = this.getObjectDimensions(this.cropZone);
    if (rectBoundaries.width < 1 && rectBoundaries.height < 1) {
        return;
    }
    var image = imageViewer.img;
    // var imageBoundaries = this.getObjectDimensions(image);

    // Compute crop zone dimensions
    var top = rectBoundaries.top;
    var left = rectBoundaries.left;
    var width = rectBoundaries.width;
    var height = rectBoundaries.height;

    // Adjust dimensions to image only
    if (top < 0) {
        height += top;
        top = 0;
    }

    if (left < 0) {
        width += left;
        left = 0;
    }

    // Apply crop transformation.
    // Make sure to use relative dimension since the crop will be applied
    // on the source image.
    Object.assign(this.options, {
        top: top, // imageBoundaries.height,
        left: left, // imageBoundaries.width,
        width: width, // imageBoundaries.width,
        height: height, // imageBoundaries.height,
    });
    this.applyTransformation(this.options, imageViewer.fabricCanvas, this.cropZone,
        function (res) {
            imageViewer.img = res;
            imageViewer.applyDefaultFilters();
            if (typeof callback === "function") {
                // Call it, since we have confirmed it is callable
                return callback();
            }
        }
    );
};
/**
* Method will fire the cropzoneselected event on canvas dom
*/
imageViewer.cropZoneSelected = function () {
    var event = new Event('cropzoneselected');
    imageViewer.canvas.dispatchEvent(event);
};
/**
* Get the given input object dimensions
* @param { Object } o 
* @returns { Object }
*/
imageViewer.getObjectDimensions = function (o) {
    var oDim = o.getBoundingRect();
    return {
        height: oDim.height,
        width: oDim.width,
        top: oDim.top,
        left: oDim.left
    };
};

/**
* Rotate the given input fabric object in clockwise direction
* @param {Object} o fabric object item
*/
imageViewer.rotateImage = function (value) {
    var o = imageViewer.img,
        angle = value ? value : o.get('angle'),
        deafultAngle = 90 + angle,
        width = imageViewer.fabricCanvas.width,
        height = imageViewer.fabricCanvas.height;
    if (angle === 360) {
        deafultAngle = 90;
    }
    o.rotate(deafultAngle);
    // o.setCoords();
    if (deafultAngle === 90 || deafultAngle === 270) {
        // o.scaleToWidth(width, imageViewer.fabricCanvas);
        var size = imageViewer.calculateAspectRatioFit(imageViewer.origImgHeight, imageViewer.origImgWidth, imageViewer.origCanvasWidth, imageViewer.origCanvasHeight);
        imageViewer.size = size;
        imageViewer.fabricCanvas.setWidth(size.width);
        imageViewer.fabricCanvas.setHeight(size.height);
        imageViewer.updateCanvasToCenter(size.marginTop, size.marginLeft);
        imageViewer.fabricCanvas.size = size;
        o.set({
            originX: 'left',
            // scaleX: imageViewer.fabricCanvas.height / imageViewer.origImgWidth,
            //     // scaleY: imageViewer.fabricCanvas.width / o.height,
            //     scaleY:(imageViewer.fabricCanvas.width * (imageViewer.origImgWidth/imageViewer.origImgHeight))/imageViewer.fabricCanvas.height,
            scaleX: imageViewer.fabricCanvas.width / o.height,
            scaleY: imageViewer.fabricCanvas.height / o.width,
            originY: 'top'
        });
    } else {
        // o.scaleToHeight(width, imageViewer.fabricCanvas);
        var size = imageViewer.calculateAspectRatioFit(imageViewer.origImgWidth, imageViewer.origImgHeight, imageViewer.origCanvasWidth, imageViewer.origCanvasHeight);
        imageViewer.size = size;
        imageViewer.fabricCanvas.setWidth(size.width);
        imageViewer.fabricCanvas.setHeight(size.height);
        imageViewer.updateCanvasToCenter(size.marginTop, size.marginLeft);
        o.set({
            originX: 'left',
            scaleX: imageViewer.fabricCanvas.width / o.width,
            scaleY: imageViewer.fabricCanvas.height / o.height,
            originY: 'top'
        });
        imageViewer.fabricCanvas.size = size;
    }
    imageViewer.fabricCanvas.centerObject(o);
    // o.setCoords();
    imageViewer.fabricCanvas.requestRenderAll();
    if (o.get('angle') !== 0) {
        imageViewer.canIdiscard = true;
    }
    imageViewer.enableUndoRedo({ 'redo': false });
};
/**
* Keep the image in the original angle
*/
imageViewer.discardRotate = function () {
    var img = imageViewer.img;
    img.rotate(0);
    imageViewer.setCoords();
    imageViewer.fabricCanvas.requestRenderAll();
    imageViewer.fabricCanvas.centerObject(img);
    img.setCoords();
    imageViewer.fabricCanvas.renderAll();
    imageViewer.enableUndoRedo({ 'redo': false });
};
imageViewer.calculateAspectRatioFit = function (srcWidth, srcHeight, maxWidth, maxHeight) {
    var minRatio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    var maxRatio = Math.max(maxWidth / srcWidth, maxHeight / srcHeight);
    var width = srcWidth * minRatio;
    var height = srcHeight * minRatio;
    var marginTop,
        marginLeft;
    if (imageViewer.orientationType.includes(constants.orientation[1])) {
        console.log('hello pot');
        marginTop = (maxHeight + imageViewer.canvasMargins.verticalMargin - height) / 2;
        marginLeft = (maxWidth + imageViewer.canvasMargins.horizontalMargin - width) / 2 + "px";
    } else {
        marginTop = (maxHeight + imageViewer.canvasMargins.verticalMargin - height) / 2 + "px";
        marginLeft = (maxWidth + imageViewer.canvasMargins.horizontalMargin - width) / 2;
    }
    //   if(imageViewer.img){
    //     var angle = imageViewer.img.get('angle') || 0;
    //     if (angle === 90 || angle === 270) {
    //         width = srcWidth * minRatio;
    //         marginTop = (maxHeight+60-height)/2+"px";
    //     }
    //   }
    // o.setCoords();
    if (imageViewer.orientationType.includes(constants.orientation[1])) {
        marginTop = (marginTop < imageViewer.canvasMargins.minMargin) ? imageViewer.canvasMargins.minMargin + "px" : marginTop + "px";
        marginLeft = marginLeft;
    } else {
        marginTop = marginTop;
        marginLeft = (marginLeft < imageViewer.canvasMargins.minMargin) ? imageViewer.canvasMargins.minMargin + "px" : marginLeft + "px";
    }

    return {
        width: width,
        height: height,
        marginTop: marginTop,
        marginLeft: marginLeft,
    };
};
/**
* Method to add textbox on canvas
*/
imageViewer.addTextBox = function () {
    if (!imageViewer.canIdiscard) {
        return this.processTextBox();
    }
    this.enableAddTextBox = true;
};
imageViewer.extendedTextbox = fabric.util.createClass(fabric.Textbox, {
    splitByGrapheme: true
    // _forceClearCache: true,
    // _wrapLine: function (text, lineIndex) {

    //     var lineWidth = 0,
    //         lines = [],
    //         line = '',
    //         words = text.split(this._reSpaceAndTab),
    //         word = '',
    //         letter = '',
    //         offset = 0,
    //         infix = ' ',
    //         wordWidth = 0,
    //         infixWidth = 0,
    //         letterWidth = 0,
    //         largestWordWidth = 0;

    //     for (var i = 0; i < words.length; i++) {
    //         word = words[i];
    //         wordWidth = this._measureWord(word, lineIndex, offset);
    //         lineWidth += infixWidth;

    //         // Break Words if wordWidth is greater than textbox width
    //         if (this.breakWords && wordWidth > this.width) {
    //             line += infix;
    //             var wordLetters = word.split('');
    //             while (wordLetters.length) {
    //                 letterWidth = this._measureWord(wordLetters[0], lineIndex, offset);
    //                 if (lineWidth + letterWidth > this.width) {
    //                     lines.push(line);
    //                     line = '';
    //                     lineWidth = 0;
    //                 }
    //                 line += wordLetters.shift();
    //                 offset++;
    //                 lineWidth += letterWidth;
    //             }

    //             word = '';
    //         } else {
    //             lineWidth += wordWidth;
    //         }

    //         if (lineWidth >= this.width && line !== '') {
    //             lines.push(line);
    //             line = '';
    //             lineWidth = wordWidth;
    //         }

    //         if (line !== '' || i === 1) {
    //             line += infix;
    //         }
    //         line += word;
    //         offset += word.length;
    //         infixWidth = this._measureWord(infix, lineIndex, offset);
    //         offset++;

    //         // keep track of largest word
    //         if (wordWidth > largestWordWidth && !this.breakWords) {
    //             largestWordWidth = wordWidth;
    //         }
    //     }

    //     i && lines.push(line);

    //     if (largestWordWidth > this.dynamicMinWidth) {
    //         this.dynamicMinWidth = largestWordWidth;
    //     }
    //     return lines;
    // },

    // _splitTextIntoLines: function (text) {
    //     var newText = fabric.Text.prototype._splitTextIntoLines.call(this, text), graphemeLines = this._wrapText(newText.lines, this.width), lines = new Array(graphemeLines.length);
    //     for (var i = 0; i < graphemeLines.length; i++) {
    //         lines[i] = graphemeLines[i];
    //     }
    //     newText.lines = lines;
    //     newText.graphemeLines = graphemeLines;
    //     return newText;
    // }

});

imageViewer.processTextBox = function () {
    var text = constants.labelHolder.textLabel || constants.textProperties.textLabel;
    fabric.util.clearFabricFontCache();
    var direction = 'right';
    if (this.languageDirection && this.languageDirection.ltr) {
        direction = 'left';
    }
    var textSample = new imageViewer.extendedTextbox(text, {
        type: 'textbox',
        width: 200 / imageViewer.presentZoom,
        _forceClearCache: true,
        height: 200 / imageViewer.presentZoom,
        breakWords: true,
        objectCaching: false,
        noScaleCache: false,
        fontSize: imageViewer.defaultTextProps.fontSize / imageViewer.presentZoom,
        fill: 'rgba(204, 0, 0, 1)',
        fontFamily: constants.fontFamily[0],
        fontWeight: imageViewer.defaultTextProps.fontWeight,
        fontStyle: 'normal',
        cornerStrokeColor: constants.controlColor,
        cornerColor: constants.controlColor,
        cornerStyle: 'circle',
        cornerSize: imageViewer.defaultTextProps.cornerSize,
        transparentCorners: false,
        hasRotatingPoint: true,
        centerTransform: true,
        textAlign: direction,
        originX: direction,
        strokeUniform: true
    });
    this.fabricCanvas.add(textSample);
    textSample.setCoords();
    textSample.center();
    this.fabricCanvas.setActiveObject(textSample);
    this.fabricCanvas.bringToFront(textSample);

    var zoomValue = imageViewer.fabricCanvas.getZoom();
    if (zoomValue > 1) {
        var iM = fabric.util.invertTransform(imageViewer.fabricCanvas.viewportTransform);
        var y = ((imageViewer.fabricCanvas.height / imageViewer.presentZoom)) / 2 - (textSample.height / 2);
        var x = ((imageViewer.fabricCanvas.width / imageViewer.presentZoom)) / 2 - (textSample.width / 2);

        //if text direction is right to left
        if (direction === 'right') {
            var x = ((imageViewer.fabricCanvas.width / imageViewer.presentZoom)) / 2 + (textSample.width / 2);
        }
        // var point = new fabric.Point(x, y);
        // var transformedPoint = fabric.util.transformPoint(point, iM);
        textSample.left = iM[4] + x;
        textSample.top = iM[5] + y;
        textSample.setCoords();
    }
    this.fabricCanvas.requestRenderAll();
    this.enableAddTextBox = false;
    imageViewer.enableUndoRedo({ 'redo': false });
};
/**
* Apply color to the selected fabric textbox 
* @param {Number} value 
*/
imageViewer.applyTextColor = function (value) {
    var o = this.fabricCanvas.getActiveObject();
    if (o && o.type === 'textbox') {
        o.set({
            fill: value
        });
        o.setCoords();
        this.fabricCanvas.requestRenderAll();
        imageViewer.canIdiscard = true;
        imageViewer.enableUndoRedo({ 'redo': false });
    }
};
/**
* Apply font size to the selected fabric textbox 
* @param {Number} value 
*/
imageViewer.applyTextSize = function (value) {
    var o = this.fabricCanvas.getActiveObject();
    fabric.util.clearFabricFontCache();
    if (o && o.type === 'textbox') {
        o.set({
            fontSize: value //,
            // width: value
        });
        o.setCoords();
        this.fabricCanvas.requestRenderAll();
        imageViewer.canIdiscard = true;
        imageViewer.enableUndoRedo({ 'redo': false });
    }
};
/**
* Apply font-family to the selected fabric textbox 
* @param {String} value Arial || Open Sans || Times New Roman
*/
imageViewer.applyFontFamily = function (value) {
    var o = this.fabricCanvas.getActiveObject();
    fabric.util.clearFabricFontCache();
    if (o && o.type === 'textbox') {
        o.set({
            fontFamily: value
        }, { onChange: imageViewer.fabricCanvas.renderAll.bind(imageViewer.fabricCanvas) });
        o.setCoords();
        this.fabricCanvas.requestRenderAll();
        imageViewer.canIdiscard = true;
        imageViewer.enableUndoRedo({ 'redo': false });
    }
};
/**
* Apply font-style to the selected fabric textbox 
* @param {String} value bold || normal || italic
*/
imageViewer.applyFontStyle = function (value) {
    var o = this.fabricCanvas.getActiveObject();
    fabric.util.clearFabricFontCache();
    if (o && o.type === 'textbox') {
        if (value === 'bold') {
            o.set({
                fontWeight: 900,
                fontStyle: 'normal'
            });
        } else {
            o.set({
                fontWeight: 500,
                fontStyle: value
            });
        }
        o.setCoords();
        this.fabricCanvas.requestRenderAll();
        imageViewer.canIdiscard = true;
        imageViewer.enableUndoRedo({ 'redo': false });
    }
};
/**
* Apply angle to the selected fabric textbox 
*/
imageViewer.rotateTextBox = function () {
    var o = this.fabricCanvas.getActiveObject();
    fabric.util.clearFabricFontCache();
    if (o && o.type === 'textbox') {
        var angle = o.get('angle'),
            deafultAngle = 90 + angle;
        if (angle === 360) {
            deafultAngle = 90;
        }
        o.rotate(deafultAngle);
        // this.fabricCanvas.centerObject(o);
        o.setCoords();
        this.fabricCanvas.requestRenderAll();
        if (o.get('angle') !== 0) {
            imageViewer.canIdiscard = true;
        }
        imageViewer.enableUndoRedo({ 'redo': false });
    }
};
/**
* Fire the applytextboxprops event on UI canvas
* @param {Object} o fabric-object
*/
imageViewer.showTextBoxProps = function (o) {
    var event = new Event('applytextboxprops');
    fabric.util.clearFabricFontCache();
    event.details = {
        shapeInfo: {
            "fontWeight": o.fontWeight,
            "fontStyle": o.fontStyle,
            "fontFamily": o.fontFamily,
            "textColor": o.fill,
            "textSize": o.fontSize
        }, shape: o.type
    };
    imageViewer.canvas.dispatchEvent(event);
};

/**
* Set the limits to the object while dragging it
* @param {Object} o fabric-object
*/
imageViewer.setObjectBoundaryLimit = function (o) {
    var updateCoords = false,
        selectedObject = o,
        canvas = this.fabricCanvas,
        coords = selectedObject.getBoundingRect(),
        maxWidth = canvas.getWidth(),
        maxHeight = canvas.getHeight();


    //if the object overflow to the right/bottom reposition it
    if (selectedObject.left >= maxWidth) {
        var newLeft = maxWidth - coords.width;
        updateCoords = true;
        selectedObject.set({ left: newLeft });
    } else if (selectedObject.left + coords.width >= maxWidth) {
        updateCoords = true;
        var newLeft = maxWidth - coords.width;
        selectedObject.set({ left: newLeft });
    }
    if (selectedObject.top >= maxHeight) {
        updateCoords = true;
        var newTop = maxHeight - coords.height;
        selectedObject.set({ top: newTop });
    } else if (selectedObject.top + coords.height >= maxHeight) {
        updateCoords = true;
        var newTop = maxHeight - coords.height;
        selectedObject.set({ top: newTop });
    }

    //if the object is moved "AWAY" on the left/top of the canvas reposition it
    if (selectedObject.left < 10) {
        updateCoords = true;
        selectedObject.set({ left: 10 });
    }
    if (selectedObject.top < 10) {
        updateCoords = true;
        selectedObject.set({ top: 10 });
    }

    if (updateCoords) {
        selectedObject.setCoords();
        this.fabricCanvas.requestRenderAll();
    }
};

/**
* Enable the free-draw feature on the fabric canvas
*/
imageViewer.enableDrawing = function (props) {
    this.textSelection(true);
    if (props && props instanceof Object) {
        this.fabricCanvas.isDrawingMode = true;
        this.isStillDrawEnabled = true;
        if (props.color) {
            this.freeDrawProps.stroke = props.color;
        }
        if (props.width) {
            this.freeDrawProps.borderDiameter = props.width;
        }
        this.updateDrawingBrush({
            color: this.freeDrawProps.stroke,
            width: this.freeDrawProps.borderDiameter
        });
        imageViewer.canIdiscard = true;
    } else {
        this.log({
            type: 'error',
            msg: 'Missing input props',
            method: 'enableDrawing'
        });
    }
};

/**
* Disable the free-draw on the fabric canvas
*/
imageViewer.disabledDrawing = function () {
    this.textSelection(false);
    this.fabricCanvas.isDrawingMode = false;
    this.isStillDrawEnabled = false;
    // imageViewer.fabricCanvas.freeDrawingBrush._points = [];
    imageViewer.restrictSelectionWhileZooming(false);
};
imageViewer.updateDrawingBrush = function (props) {
    var canvas = this.fabricCanvas;
    if (canvas.freeDrawingBrush) {
        if (props.color) {
            canvas.freeDrawingBrush.color = props.color;
        }
        if (props.width) {
            canvas.freeDrawingBrush.width = (props.width / imageViewer.presentZoom) >= 0.4 ? props.width / imageViewer.presentZoom : 0.4;
        }
        canvas.freeDrawingBrush.shadow = new fabric.Shadow({
            blur: 0,
            offsetX: 0,
            offsetY: 0,
            affectStroke: true
        });
        var activeO = imageViewer.fabricCanvas.getActiveObject();
        if (activeO && activeO.type === 'path') {
            activeO.set({
                stroke: canvas.freeDrawingBrush.color,
                strokeWidth: canvas.freeDrawingBrush.width
            });
        }
        canvas.requestRenderAll();
        imageViewer.enableUndoRedo({ 'redo': false });
    }
};


imageViewer.textSelection = function (flag) {
    if (flag) {
        var objects = this.fabricCanvas.getObjects();
        objects.forEach(function (o) {
            if (o.type === 'textbox') {
                o.editable = false;
                o.lockMovementX = true;
                o.lockMovementY = true;
                o.canvas.selection = false;
                o.evented = false;
            }
        });
        return;
    }

    var objects = this.fabricCanvas.getObjects();
    objects.forEach(function (o) {
        if (o.type === 'textbox') {
            o.editable = true;
            o.lockMovementX = false;
            o.lockMovementY = false;
            o.evented = true;
        }
    });
}


imageViewer.applyBorderColor = function (props) {
    if (props && props instanceof Object && props.color) {
        this.freeDrawProps.stroke = props.color;
        this.updateDrawingBrush({ color: props.color, width: props.width });
    } else {
        this.log({
            type: 'error',
            msg: 'Missing input props',
            method: 'applyBorderColor'
        });
    }
};

imageViewer.applyBorderDiameter = function (props) {
    if (props && props instanceof Object && props.width) {
        this.freeDrawProps.borderDiameter = props.width;
        this.updateDrawingBrush({ color: props.color, width: props.width });
    } else {
        this.log({
            type: 'error',
            msg: 'Missing input props',
            method: 'applyBorderDiameter'
        });
    }
};
imageViewer.muteFreeDrawObjects = function () {
    var objs = this.fabricCanvas.getObjects();
    objs.forEach(function (o) {
        if (o.type === 'path') {
            o.set({
                selectable: true,
                lockMovementX: false,
                lockMovementY: false,
                hasControls: true
            })
        }
    });
    this.setCorners();
    imageViewer.canIdiscard = true;
};
imageViewer.showDrawProps = function (o) {
    if (!this.fabricCanvas.isDrawingMode) {
        var event = new Event('applydrawprops');
        event.details = {
            shapeInfo: {
                "borderColor": o.stroke,
                "borderDiameter": o.strokeWidth
            },
            shape: 'draw'
        };
        this.canvas.dispatchEvent(event);
    } else {
        this.log({
            type: 'info',
            msg: 'Free draw mode is enabled',
            method: 'showDrawProps'
        });
    }
};
// Brightness && Contrast code
/**
* Apply default filters ( brightness, contrast )
* Create brightness && contrast fabric object and apply as a filter on Image
*/
imageViewer.applyDefaultFilters = function () {
    var filterBrightness = new fabric.Image.filters.Brightness({
        brightness: 0
    });
    var filterContrast = new fabric.Image.filters.Contrast({
        contrast: 0
    });
    imageViewer.img.filters.push.apply(imageViewer.img.filters, [filterBrightness, filterContrast]);
    imageViewer.img.applyFilters();
    imageViewer.img.setCoords();
    imageViewer.fabricCanvas.requestRenderAll();
};
/**
* Apply brightness on background image on fabric canvas
* @param {Number} value
*/
imageViewer.applyBrightness = function (value) {
    this.applyFilterValue(0, 'brightness', value, this.img);
};
/**
* Apply contrast on background image on fabric canvas
* Create contrast fabric object and apply as a filter on Image
* @param {Number} value
*/
imageViewer.applyContrast = function (value) {
    this.applyFilterValue(1, 'contrast', value, this.img);
};

/**
* @private
* @method
* Apply the value on respective filter which is sending through arguments
* @param {Number} index 
* @param {String} prop 
* @param {Number} value 
* @param {Object} target 
*/
imageViewer.applyFilterValue = function (index, prop, value, target) {
    var targetObj = this.fabricCanvas.getObjects()[0];
    if (target) {
        targetObj = target;
    }
    if (targetObj.filters[index]) {
        targetObj.filters[index][prop] = value;
        targetObj.applyFilters();
        imageViewer.fabricCanvas.requestRenderAll();
        imageViewer.canIdiscard = true;
        imageViewer.enableUndoRedo({ 'redo': false });
    }
};
imageViewer.discardBrightness = function () {
    this.applyBrightness(0);
};
imageViewer.discardContrast = function () {
    this.applyContrast(0);
};
imageViewer.getImageFilters = function () {
    return this.img.filters;
};

// Handle cache system
imageViewer.doCache = function () {
    var copyOfObject = JSON.parse(JSON.stringify(this.fabricCanvas));
    var obj = {
        copyOfObject: copyOfObject,
        size: imageViewer.size,
        canvasSize: {
            origImgWidth: imageViewer.origImgWidth,
            origImgHeight: imageViewer.origImgHeight,
            origCanvasHeight: imageViewer.origCanvasHeight,
            origCanvasWidth: imageViewer.origCanvasWidth,
            angle: (imageViewer.img) ? imageViewer.img.get('angle') : 90
        }
    };

    if (this.runningCacheItem !== this.cacheCanvasList.length - 1) {
        this.cacheCanvasList.splice(this.runningCacheItem + 1, this.cacheCanvasList.length - 1);
        this.enableUndoRedo({ 'redo': false });
    }

    if (this.cacheCanvasList.length <= this.minCacheLimit) {
        this.cacheCanvasList.push(obj);
    } else {
        this.removedCache.push(this.cacheCanvasList.shift(0));
        this.cacheCanvasList.push(obj);
    }
    this.runningCacheItem = this.cacheCanvasList.length - 1;
};
imageViewer.getLastCacheItem = function () {
    var cacheLength = this.cacheCanvasList.length, item = null;
    if (cacheLength) {
        item = this.cacheCanvasList[cacheLength - 1];
    }
    return item;
};
imageViewer.getRedoCacheItem = function () {
    var item = null;
    ++this.runningCacheItem;
    if (this.cacheCanvasList && this.cacheCanvasList[this.runningCacheItem]) {
        item = this.cacheCanvasList[this.runningCacheItem];
    }
    return item;
};

/**
* Apply undo changes on the canvas
* @param {Boolean} discard true || false || undefined
*/
imageViewer.undoChanges = function (discard) {
    if (this.runningCacheItem === 1 && this.cacheCanvasList.length >= this.minCacheLimit) {
        this.fireTextEvents('undolimit');
        console.log('limit fifteen only');
    }

    var lastChange = this.getLastCacheItem();
    if (lastChange) {
        if (!discard) {
            lastChange = this.cacheCanvasList[this.runningCacheItem - 1];
            if (!lastChange) {
                console.log('Can\'t do undo');
                return;
            }
            this.runningCacheItem = this.cacheCanvasList.indexOf(lastChange);
            this.enableUndoRedo({ 'redo': true });
        }
        this.rerenderCanvas(lastChange);
        this.enableUndoRedo({ 'undo': (this.runningCacheItem > 0) });
    }
};

/**
* Apply redo changes on the canvas
*/
imageViewer.redoChanges = function () {
    var lastChange = this.getRedoCacheItem(),
        undoredoObj = this.enableUndoRedo();
    if (lastChange && undoredoObj.redo) {
        this.rerenderCanvas(lastChange);
        this.enableUndoRedo({
            'undo': (this.runningCacheItem > 0),
            'redo': (this.runningCacheItem !== (this.cacheCanvasList.length - 1))
        });
    } else {
        console.log('Can\'t do redo');
    }
};
/**
* STore and get the current undo && redo status
* @param {*} o 
*/
imageViewer.enableUndoRedo = function (o) {
    if (o && o instanceof Object) {
        for (var key in o) {
            if (o.hasOwnProperty(key) && (this.defaultCacheProps[key] !== undefined || this.defaultCacheProps[key] !== null)) {
                this.defaultCacheProps[key] = o[key];
            }
        }
    }
    return this.defaultCacheProps;
};
/**
* Method will fire the event on UI Dom canvas
*/
imageViewer.doEnableUndo = function () {
    var event = new Event('doenableundo');
    this.canvas.dispatchEvent(event);
}
/**
* Load the given input object on the canvas
* @param {Object} o 
*/
imageViewer.rerenderCanvas = function (o) {

    var stringFyObj = JSON.stringify(o.copyOfObject);
    this.fabricCanvas.loadFromJSON(stringFyObj, function () {
        var obj = imageViewer.fabricCanvas.getObjects();
        var imgObj = obj[0];
        if (imgObj) {
            imgObj.set(imageViewer.defaultImageProps);
            imageViewer.img = imgObj;
        }
        imageViewer.origImgHeight = o.canvasSize.origImgHeight;
        imageViewer.origImgWidth = o.canvasSize.origImgWidth;
        imageViewer.origCanvasHeight = o.canvasSize.origCanvasHeight;
        imageViewer.origCanvasWidth = o.canvasSize.origCanvasWidth;

        var size = o.size;
        var deafultAngle = o.canvasSize.angle;
        imageViewer.fabricCanvas.setWidth(size.width);
        imageViewer.fabricCanvas.setHeight(size.height);
        imageViewer.updateCanvasToCenter(size.marginTop, size.marginLeft);

        if (deafultAngle === 90 || deafultAngle === 270) {
            imageViewer.img.set({
                originX: 'left',
                scaleX: imageViewer.fabricCanvas.width / imageViewer.img.height,
                scaleY: imageViewer.fabricCanvas.height / imageViewer.img.width,
                originY: 'top'
            });
        } else {
            imageViewer.img.set({
                originX: 'left',
                scaleX: imageViewer.fabricCanvas.width / imageViewer.img.width,
                scaleY: imageViewer.fabricCanvas.height / imageViewer.img.height,
                originY: 'top'
            });
        }
        imageViewer.cropZone = undefined;
        imageViewer.canIdiscard = false;
        if (imageViewer.enableAddTextBox) {
            imageViewer.processTextBox();
        }
        imageViewer.setCorners();
        imageViewer.fabricCanvas.requestRenderAll();
    });
}

/**
* Updated image props with defaults
*/
imageViewer.setCorners = function () {
    var objs = this.fabricCanvas.getObjects();
    objs.forEach(function (o) {
        if (o.type && o.type !== 'image') {
            o.set(imageViewer.defaultCornerProps);
        }
    });
};

/**
 * Object matching proces
 */
imageViewer.compareCacheWithCurrent = function () {
    var currentState = JSON.stringify(this.fabricCanvas),
        prevState = JSON.stringify(this.getLastCacheItem());
    return (currentState === prevState);
}

// Handle the shapes
/**
* @param {String} value
* line || square || circle || triangle
*/
imageViewer.drawShape = function (value) {
    switch (value) {
        case 'line':
            this.addLine();
            break;
        case 'square':
            this.addSquare();
            break;
        case 'circle':
            this.addCircle();
            break;
        case 'triangle':
            this.addTriangle()
            break;
        default:
            this.addLine();
            break;
    }
    this.fabricCanvas.requestRenderAll();
};

/**
 * Add square on the canvas
 */
imageViewer.addSquare = function () {
    var square = new fabric.Rect({
        fill: imageViewer.defaultShapeProps.fill,
        stroke: imageViewer.defaultShapeProps.stroke,
        type: 'rect',
        cornerStrokeColor: constants.controlColor,
        cornerColor: constants.controlColor,
        cornerStyle: 'circle',
        cornerSize: imageViewer.defaultShapeProps.cornerSize,
        transparentCorners: false,
        strokeWidth: imageViewer.defaultSquareProps.strokeWidth / imageViewer.presentZoom,
        width: imageViewer.defaultSquareProps.width / imageViewer.presentZoom,
        height: imageViewer.defaultSquareProps.height / imageViewer.presentZoom,
        strokeUniform: true
    });


    this.fabricCanvas.add(square);
    square.center();
    square.setCoords();
    this.fabricCanvas.setActiveObject(square);

    var zoomValue = imageViewer.fabricCanvas.getZoom();
    if (zoomValue > 1) {
        var iM = fabric.util.invertTransform(imageViewer.fabricCanvas.viewportTransform);
        var y = ((imageViewer.fabricCanvas.height / imageViewer.presentZoom)) / 2 - (square.height / 2);
        var x = ((imageViewer.fabricCanvas.width / imageViewer.presentZoom)) / 2 - (square.width / 2);
        // var point = new fabric.Point(x, y);
        // var transformedPoint = fabric.util.transformPoint(point, iM);
        square.left = iM[4] + x;
        square.top = iM[5] + y;
        square.setCoords();
        this.fabricCanvas.requestRenderAll();
        return;
    }

};
/**
 * Add line on the canvas
 */
imageViewer.addLine = function () {
    var line = new fabric.Line(
        [50 / imageViewer.presentZoom, 50 / imageViewer.presentZoom, 200 / imageViewer.presentZoom, 200 / imageViewer.presentZoom],
        {
            fill: imageViewer.defaultShapeProps.fill,
            type: 'line',
            stroke: imageViewer.defaultShapeProps.lineColor,
            cornerStrokeColor: constants.controlColor,
            cornerColor: constants.controlColor,
            cornerStyle: 'circle',
            cornerSize: imageViewer.defaultShapeProps.cornerSize,
            transparentCorners: false,
            strokeWidth: imageViewer.defaultShapeProps.strokeWidth / imageViewer.presentZoom,
            strokeUniform: true
        },
        false
    );

    var zoomValue = imageViewer.fabricCanvas.getZoom();
    if (zoomValue > 1) {
        var iM = fabric.util.invertTransform(imageViewer.fabricCanvas.viewportTransform);
        var y = ((imageViewer.fabricCanvas.height / imageViewer.presentZoom)) / 2 - (line.height / 2);
        var x = ((imageViewer.fabricCanvas.width / imageViewer.presentZoom)) / 2 - (line.width / 2);
        // var point = new fabric.Point(x, y);
        // var transformedPoint = fabric.util.transformPoint(point, iM);
        line.left = iM[4] + x;
        line.top = iM[5] + y;
        this.fabricCanvas.add(line);
        line.setCoords();
        this.fabricCanvas.setActiveObject(line);
        return;
    }
    this.fabricCanvas.add(line);
    line.center();
    line.setCoords();
    this.fabricCanvas.setActiveObject(line);
};

/**
 * Add circle shape on canvas
 */
imageViewer.addCircle = function () {
    var circle = new fabric.Circle({
        fill: imageViewer.defaultShapeProps.fill,
        type: 'circle',
        stroke: imageViewer.defaultShapeProps.stroke,
        cornerStrokeColor: constants.controlColor,
        cornerColor: constants.controlColor,
        cornerStyle: 'circle',
        cornerSize: imageViewer.defaultShapeProps.cornerSize,
        transparentCorners: false,
        strokeWidth: imageViewer.defaultShapeProps.strokeWidth / imageViewer.presentZoom,
        radius: imageViewer.defaultShapeProps.radius / imageViewer.presentZoom,
        strokeUniform: true
    });

    this.fabricCanvas.add(circle);
    circle.center();
    circle.setCoords();
    var zoomValue = imageViewer.fabricCanvas.getZoom();
    if (zoomValue > 1) {
        var iM = fabric.util.invertTransform(imageViewer.fabricCanvas.viewportTransform);
        var y = ((imageViewer.fabricCanvas.height / imageViewer.presentZoom)) / 2 - (circle.height / 2);
        var x = ((imageViewer.fabricCanvas.width / imageViewer.presentZoom)) / 2 - (circle.width / 2);
        // var point = new fabric.Point(x, y);
        // var transformedPoint = fabric.util.transformPoint(point, iM);
        circle.left = iM[4] + x;
        circle.top = iM[5] + y;
        circle.setCoords();
    }
    this.fabricCanvas.setActiveObject(circle);
    this.fabricCanvas.requestRenderAll();
};
/**
 * Add triangle shape on canvas
 */
imageViewer.addTriangle = function () {
    var triangle = new fabric.Triangle({
        fill: imageViewer.defaultShapeProps.fill,
        stroke: imageViewer.defaultShapeProps.stroke,
        type: 'triangle',
        cornerStrokeColor: constants.controlColor,
        cornerColor: constants.controlColor,
        cornerStyle: 'circle',
        cornerSize: imageViewer.defaultShapeProps.cornerSize,
        transparentCorners: false,
        strokeWidth: imageViewer.defaultShapeProps.strokeWidth / imageViewer.presentZoom,
        width: imageViewer.defaultShapeProps.width / imageViewer.presentZoom,
        height: imageViewer.defaultShapeProps.height / imageViewer.presentZoom,
        strokeUniform: true
    });

    var zoomValue = imageViewer.fabricCanvas.getZoom();
    if (zoomValue > 1) {
        var iM = fabric.util.invertTransform(imageViewer.fabricCanvas.viewportTransform);
        var y = ((imageViewer.fabricCanvas.height / imageViewer.presentZoom)) / 2 - (triangle.height / 2);
        var x = ((imageViewer.fabricCanvas.width / imageViewer.presentZoom)) / 2 - (triangle.width / 2);
        // var point = new fabric.Point(x, y);
        // var transformedPoint = fabric.util.transformPoint(point, iM);
        triangle.left = iM[4] + x;
        triangle.top = iM[5] + y;
        this.fabricCanvas.add(triangle);
        this.fabricCanvas.setActiveObject(triangle);
        return;
    }
    this.fabricCanvas.add(triangle);
    triangle.center();
    triangle.setCoords();
    this.fabricCanvas.setActiveObject(triangle);
};

/**
 * 
 * @param {*} color 
 */
imageViewer.fillColor = function (color) {
    var obj = this.fabricCanvas.getActiveObject();
    if (obj) {
        obj.set({
            fill: color || imageViewer.defaultShapeProps.fill
        });
        this.fabricCanvas.requestRenderAll();
    }
};
/**
 * 
 * @param {*} color 
 */
imageViewer.applyShapeBorderColor = function (color) {
    var obj = this.fabricCanvas.getActiveObject();
    if (obj) {
        obj.set({
            stroke: color || imageViewer.defaultShapeProps.stroke
        });
        this.fabricCanvas.requestRenderAll();
    }
};
/**
 * 
 * @param {*} width 
 */
imageViewer.applyShapeBorderDiameter = function (width) {
    var obj = this.fabricCanvas.getActiveObject();
    if (obj) {
        obj.set({
            strokeWidth: width || 1
        });
        this.fabricCanvas.requestRenderAll();
    }
};

/**
* Fire the applyshapeprops when user selects the shape on the canvas
* @param {Object} o 
*/
imageViewer.showShapeProps = function (o) {
    if (!this.fabricCanvas.isDrawingMode) {
        var event = new Event('applyshapeprops');
        var type = o.type === 'rect' ? 'square' : o.type;
        event.details = {
            shapeInfo: {
                "fillColor": o.fill,
                "borderColor": o.stroke,
                "borderDiameter": o.strokeWidth,
            },
            shape: type
        };
        this.canvas.dispatchEvent(event);
    }
};

/**
* Delete the selected object on canvas
*/
imageViewer.deleteSelectedItem = function () {
    this.restrictUnSelection(false, null);
    var zoomValue = imageViewer.fabricCanvas.getZoom();
    // if (zoomValue > 1) {
    //     imageViewer.fabricCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    //     imageViewer.presentZoom = 1;
    // }
    var obj = this.fabricCanvas.getActiveObject();
    if (obj) {
        this.fabricCanvas.remove(obj);
        // If canvas has modified data then apply the changes (cache)
        if (!this.compareCacheWithCurrent()) {
            this.applyChanges();
        }
    }
};
/**
* Discard the latest chages on canvas
*/
imageViewer.discardChanges = function () {
    this.restrictUnSelection(false, null);
    var zoomValue = imageViewer.fabricCanvas.getZoom();
    // if (zoomValue > 1) {
    //     imageViewer.fabricCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    //     imageViewer.presentZoom = 1;
    // }
    if (this.canIdiscard) {
        this.undoChanges(true);
    }
    this.disabledDrawing();
    this.fabricCanvas.discardActiveObject();
    this.fabricCanvas.requestRenderAll();
};

imageViewer.discardActiveObject = function () {
    this.fabricCanvas.discardActiveObject();
    this.fabricCanvas.requestRenderAll();
};
/**
* Save the latest changes when user clicked on save option
*/
imageViewer.applyChanges = function () {
    this.restrictUnSelection(false, null);
    // var zoomValue = imageViewer.fabricCanvas.getZoom();
    // if (zoomValue > 1) {
    //     imageViewer.fabricCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    //     imageViewer.presentZoom = 1;
    // }
    if (this.hasFocus()) {
        this.cropCurrentZone(function () {
            imageViewer.doCache();
            if (imageViewer.runningCacheItem > 0) {
                imageViewer.enableUndoRedo({ 'undo': true });
                imageViewer.doEnableUndo();
            }
        });
    } else {
        this.doCache();
    }
    this.disabledDrawing();
    this.fabricCanvas.discardActiveObject();
    this.canIdiscard = false;
    this.fabricCanvas.requestRenderAll();
    imageViewer.enableUndoRedo({ 'redo': false, 'undo': (this.runningCacheItem > 0) });
};
/**
* Fire the unselect object events on UI canvas
*/
imageViewer.fireUnSelectObjectEvent = function () {
    var obj = this.fabricCanvas.getActiveObject();
    if (!obj && !this.fabricCanvas.isDrawingMode) {
        var objs = this.fabricCanvas.getObjects();
        var fireevent = objs.some(function (o) {
            return o.type && (o.type === 'circle' || o.type === 'square' || o.type === 'rect' || o.type === 'line' || o.type === 'textbox' || o.type === 'triangle' || o.type === 'path')
        });
        if (fireevent) {
            var event = new Event('unselectobject');
            this.canvas.dispatchEvent(event);
        }
    }
};
/**
* Method to log the infomation of this library
* @param {Object} props 
*/
imageViewer.log = function (props) {
    var type = props.type, msg = props.msg, method = props.method;
    switch (type) {
        case 'debug':
            console.debug('SUBJECT:', msg, ', METHOD:', method);
            break;
        case 'log':
            console.log('SUBJECT:', msg, ', METHOD:', method);
            break;
        case 'warn':
            console.warn('SUBJECT:', msg, ', METHOD:', method);
            break;
        case 'error':
            console.error('SUBJECT:', msg, ', METHOD:', method);
            break;
        case 'info':
            console.info('SUBJECT:', msg, ', METHOD:', method);
            break;
        default:
            console.log('SUBJECT:', msg, ', METHOD:', method);
            break;
    }
};
/**
 * 
 * @param {*} x 
 * @param {*} y 
 */
imageViewer.calculateRatio = function (x, y) {
    var num1, num2;
    if (x < y) {
        num1 = x;
        num2 = y;
    } else {
        num1 = y;
        num2 = x;
    }
    var remain = num2 % num1;
    while (remain > 0) {
        num2 = num1;
        num1 = remain;
        remain = num2 % num1;
    }
    return num1;
};
/**
 * 
 * @param {*} width 
 * @param {*} height 
 */
imageViewer.findRatio = function (width, height) {
    var gcd = imageViewer.calculateRatio(width, height);
    var r1 = width / gcd;
    var r2 = height / gcd;
    return {
        'width': r1,
        'height': r2
    }
};
var left1 = 0;
var top1 = 0;
var scale1x = 0;
var scale1y = 0;
var width1 = 0;
var height1 = 0;
/**
 * 
 * @param {*} obj 
 */
imageViewer._handleScaling = function (obj, o) {
    if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
        console.log('un know thing of canvas');
        return;
    }
    obj.setCoords();
    if (obj.getBoundingRect(true, true).top < 0) {
        // obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
        // obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
        console.log('top becoming negative');
        obj.left = left1;
        obj.top = top1;
        obj.scaleX = scale1x;
        obj.scaleY = scale1y;
        obj.width = width1;
        obj.height = height1;
        console.log(obj.top, obj.left, obj.scaleX, obj.scaleY, obj.width, obj.height);
        // obj.left = left1;
        return;
    }

    if (obj.getBoundingRect(true, true).left < 0) {
        obj.left = left1;
        obj.top = top1;
        obj.scaleX = scale1x;
        obj.scaleY = scale1y;
        obj.width = width1;
        obj.height = height1;
        console.log('left becoming negative');
        return;
    }
    // bot-right corner
    if (obj.getBoundingRect(true).top + obj.getBoundingRect(true, true).height > obj.canvas.height) {
        obj.left = left1;
        obj.top = top1;
        obj.scaleX = scale1x;
        obj.scaleY = scale1y;
        obj.width = width1;
        obj.height = height1;
        console.log('bottom becoming negative');;
        console.log(obj.top, obj.left, obj.width, obj.height);
        return;
    }

    if (obj.getBoundingRect(true, true).left + obj.getBoundingRect(true, true).width > obj.canvas.width) {
        obj.left = left1;
        obj.top = top1;
        obj.scaleX = scale1x;
        obj.scaleY = scale1y;
        obj.width = width1;
        obj.height = height1;
        console.log('right becoming negative');
        return;
    }

    left1 = obj.left;
    top1 = obj.top;
    scale1x = obj.scaleX;
    scale1y = obj.scaleY;
    width1 = obj.width;
    height1 = obj.height;

};
/**
 * 
 * @param {*} left 
 * @param {*} top 
 * @param {*} scale 
 */
imageViewer._setScalingProperties = function (left, top, scale) {
    if (this.scalingProperties == null ||
        this.scalingProperties['scale'] > scale) {
        this.scalingProperties = {
            'left': left,
            'top': top,
            'scale': scale
        };
    }
};
imageViewer._handleDragging = function (obj) {
    // if object is too big ignore
    // if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
    //     return;
    // }
    obj.setCoords();
    // top-left  corner
    if (obj.getBoundingRect(true, true).top < 0 || obj.getBoundingRect(true, true).left < 0) {
        obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect(true, true).top);
        obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect(true, true).left);
    }
    // bot-right corner
    if (obj.getBoundingRect(true, true).top + obj.getBoundingRect(true, true).height > obj.canvas.height || obj.getBoundingRect(true, true).left + obj.getBoundingRect(true, true).width > obj.canvas.width) {
        obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect(true, true).height + obj.top - obj.getBoundingRect(true, true).top);
        obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect(true, true).width + obj.left - obj.getBoundingRect(true, true).left);
    }

    left1 = obj.left;
    top1 = obj.top;
    scale1x = obj.scaleX;
    scale1y = obj.scaleY;
    width1 = obj.width;
    height1 = obj.height;
};
imageViewer.gcd = function (a, b) {
    return (b == 0) ? a : imageViewer.gcd(b, a % b);
};
imageViewer.aspectRatio = function (width, height) {
    var r = imageViewer.gcd(width, height);
    return [width / r, height / r];
};
module.exports = imageViewer;
});
