cordova.define("photoeditor.trellidor", function(require, exports, module) {
//main 

var trellidor = {
    selectedNavigation: previousNavigation = null, //storing the selected action from navigation bar.
    pluginInputParamters: {},
    enableSaveBar: {
        unSavedChanges: false,
        ShowSaveBar: true,
    },
    orientationType: constants.orientation[0],
    canvasProperties: {},  //It will stores the properties related to selected navigation (text color, border width).
    previousAction: presentAction = null, // storing the actions related to child events.
    initialNavigation: false, // checking whether it is first selected navigation or not.
    data: {},
    parentTag: null,
    isPreviouslyCropSelected: false,
    initialSelection: false,
    isCssLoaded: false,
    _baseDocDefinition: {
        pageSize: {
            width: 842,
            height: 594.8
        },
        pageOrientation: 'portrait',
        pageMargins: [0, 0, 0, 0],
        fileName: 'file.pdf',
        header: {},
        footer: {},
        content: {
            alignment: 'center',
            stack: [],
            style: 'content'
        },
        styles: {
            header: {
                margin: [35, 20, 35, 20]
            },
            content: {},
            itemImage: {}
        },
        images: {}
    },
    isTemplateFileValid: false
}

/**
* @method creatingMainView
* creating the main view. 
*/
trellidor.creatingMainView = function () {
    var rootTag = this.rootTagVerifications();
    this.createSetOfElements(constants.rootContainerChilds, rootTag);
    this.enableAllCanvasEventListenMethods();
    this.data.height = document.getElementById("ud-canvas").offsetHeight;
    this.data.width = document.getElementById("ud-canvas").offsetWidth;
    imageViewer.initialize({
        imageUrl: trellidor.currentImage,
        canvasId: 'ud-canvas',
        height: this.data.height,
        width: this.data.width,
        callback: function () {
            trellidor.showOrHideLoader(false);
            imageViewer.setActivateCropZone();
        }
    });

    this.createSetOfElements(constants.navigationBar, rootTag);
    this.initialSelection = true;
    this.initialNavigation = true;
    this.parentTag = document.querySelector('body');
    this.selectedNavigationHandling(this.getElements(constants.navigationEventIds[0]));
}

trellidor.rootTagVerifications = function () {
    var rootTag = this.pluginInputParamters.rootContainer;
    var body = document.querySelector('body');
    if (rootTag) {
        if (rootTag instanceof HTMLElement) {
            return rootTag;
        } else {
            var tag = document.getElementById(rootTag);
            if (tag instanceof HTMLElement) {
                return tag;
            } else {
                return body;
            }
        }
    } else {
        return body;
    }
}


trellidor.reset = function () {
    this.selectedNavigation = this.previousNavigation = null; //storing the selected action from navigation bar.
    this.pluginInputParamters = {};
    this.enableSaveBar = {
        unSavedChanges: false,
        ShowSaveBar: true,
    },
        this.orientationType = constants.orientation[0];
    this.canvasProperties = {};  //It will stores the properties related to selected navigation (text color, border width).
    this.previousAction = this.presentAction = null; // storing the actions related to child events.
    this.initialNavigation = false; // checking whether it is first selected navigation or not.
    this.data = {};
    this.parentTag = null;
    this.isPreviouslyCropSelected = false;
    this.initialSelection = false;
    this.isCssLoaded = false;
    this.isTemplateFileValid = false;
    this._baseDocDefinition = {
        pageSize: {
            width: 842,
            height: 594.8
        },
        pageOrientation: 'portrait',
        pageMargins: [0, 0, 0, 0],
        fileName: 'file.pdf',
        header: {},
        footer: {},
        content: {
            alignment: 'center',
            stack: [],
            style: 'content'
        },
        styles: {
            header: {
                margin: [35, 20, 35, 20]
            },
            content: {},
            itemImage: {}
        },
        images: {}
    };
    imageViewer.presentZoom = 1;
}


/**
* @method selectedNavigationHandling
* compare the previous and present navigation to highlight or unHighlight the icon in navigation bar
* @param {Element} selectedIcon 
* @param {Boolean} canvasObjectSelection 
*/
trellidor.selectedNavigationHandling = function (selectedIcon, canvasObjectSelection) {
    this.selectedNavigation = (constants.navigationEventIds.filter(function (item) { return item === selectedIcon.id }))[0];
    var isAlreadySelected = (this.previousNavigation === this.selectedNavigation ? true : false);
    if (!isAlreadySelected && this.previousNavigation) {
        this.excecuteSelectedHandler(this.previousNavigation, true, canvasObjectSelection);
    }
    this.previousNavigation = (this.previousNavigation === this.selectedNavigation ? '' : this.selectedNavigation);
    this.excecuteSelectedHandler(this.selectedNavigation, isAlreadySelected, canvasObjectSelection);
}


/**
* @method excecuteSelectedHandler
* Based on selected icon from navigation bar, related action will happen.
* @param {Element} selectedIcon 
* @param {Boolean} isAlreadySelected 
* @param {Boolean} canvasObjectSelection 
*/
trellidor.excecuteSelectedHandler = function (selectedIcon, isAlreadySelected, canvasObjectSelection) {
    switch (selectedIcon) {
        case constants.navigationEventIds[0]: this.cropHandler(isAlreadySelected, canvasObjectSelection);
            break;
        case constants.navigationEventIds[1]: this.brightnessHandler(isAlreadySelected, canvasObjectSelection);
            break;
        case constants.navigationEventIds[2]: this.drawShapeHandler(isAlreadySelected, canvasObjectSelection);
            break;
        case constants.navigationEventIds[3]: this.drawHandler(isAlreadySelected, canvasObjectSelection);
            break;
        case constants.navigationEventIds[4]: this.textHandler(isAlreadySelected, canvasObjectSelection);
    }
}



/**
* @method tagCreator
* creating the element based on Object information.
* @param {Object} tagInformation 
*/
trellidor.tagCreator = function (tagInformation) {
    if (!(tagInformation instanceof Object)) return;

    var tag = document.createElement(tagInformation.tagName);
    if (tagInformation.selectionType) tag.setAttribute('id', tagInformation.selectionType);
    if (tagInformation.className) {
        tagInformation.className.forEach(function (className) {
            tag.classList.add(className);
        })
    }
    tag.disabled = tagInformation.disabled || false;
    if (tagInformation.label) tag.innerHTML = tagInformation.label;
    if (tagInformation.background) tag.style.background = tagInformation.background;
    if (tagInformation.tagName === 'img') tag.src = tagInformation.src;
    if (tagInformation.tagName === 'link') {
        tag.href = tagInformation.href;
        tag.rel = tagInformation.rel;
    }
    else if (tagInformation.tagName === 'input') {
        if (tagInformation.type === 'range') {
            tag.max = tagInformation.max;
            tag.min = tagInformation.min;
            tag.step = tagInformation.step || 1;
        }
        tag.type = tagInformation.type;
        tag.value = tagInformation.value;
        tag.placeholder = tagInformation.placeholder || '';
    }
    return tag;
}


/**
* @method createSetOfElements
* creating the  elements based on the format of array
* @param {Element} tagsContainer 
* @param {Element} parentTag 
*/
trellidor.createSetOfElements = function (tagsContainer, parentTag) {
    tagsContainer.forEach(function (child) {
        if (Array.isArray(child)) {
            parentTag.appendChild(trellidor.createSetOfElements(child, (parentTag.children[parentTag.children.length - 1])));
            return;
        }
        parentTag.appendChild(trellidor.tagCreator(child));
    });
    return parentTag;
}


/**
* @method unSelectedNavigationIcon
* Disabling the selected navigation icon and removing element from dom
* @param {String} id 
* @param {Boolean} canvasObjectSelection 
*/
trellidor.unSelectedNavigationIcon = function (id, canvasObjectSelection) {
    var tagToRemove,
        selectedIconTag,
        disableNavigation;

    disableNavigation = this.previousNavigation || this.selectedNavigation;
    selectedIconTag = document.querySelector('#' + disableNavigation);
    selectedIconTag.src = 'assets/' + (disableNavigation.split('_'))[1] + '_disabled.svg';
    this.previousAction = this.presentAction = null;

    this.removeEnabledEventListeners(selectedIconTag.id);
    this.removeElement('#' + id);
    this.removeElement('#ud-apply-discard-element');

    this.backButton(false);
    if (/* this.enableSaveBar.ShowSaveBar && */ this.enableSaveBar.unSavedChanges) {
        this.ShowSaveBarElement();
        if (this.orientationType === constants.orientation[0]) {
            this.getElements(constants.undoRedo).classList.remove('ud-landscape-undo-redo-width');
            this.getElements(constants.undoRedo).classList.remove('ud-landscape-undo-redo-margin');
        }
    } else {
        this.backButton(true);
    }

    // this.displayOrHideNavigationbar(true); //making the navigation bar enable
}

/**
* @method selectedNavigationIcon
* Enabling the selected navigation features. 
*/
trellidor.selectedNavigationIcon = function () {
    var selectedIconTag = document.querySelector('#' + this.selectedNavigation);
    selectedIconTag.src = 'assets/' + (this.selectedNavigation.split('_'))[1] + '_enabled.svg';

    this.canvasProperties = {};

    if (/* this.enableSaveBar.ShowSaveBar */ this.enableSaveBar.unSavedChanges && (
        (constants.navigationEventIds[0] === selectedIconTag.id) ||
        (constants.navigationEventIds[2] === selectedIconTag.id) ||
        (constants.navigationEventIds[1] === selectedIconTag.id) ||
        (constants.navigationEventIds[3] === selectedIconTag.id))
    ) {
        this.ShowSaveBarElement();
        return;
    } else if (constants.navigationEventIds[4] !== selectedIconTag.id) {
        this.backButton(true);
        return;
    }
    this.removeElement('#' + constants.undoRedo);
    this.backButton(false);
}

/**
* @method removeElement
*  Removing a tag from dom
* @param {Element} tag 
*/
trellidor.removeElement = function (tag) {
    if (!tag) return false;

    if (!(tag instanceof HTMLElement)) {
        tag = document.querySelector(tag);
        if (!tag) return false;
    }

    tag.parentNode.removeChild(tag);
    return true;
}

/**
* @method getElements
* Get Elements based on id
* @param {Array || String} childContainer 
* @returns {Array || Element} 
*/
trellidor.getElements = function (childContainer) {
    if (!childContainer) return [];

    if (childContainer instanceof Array) {
        var childTags = [];
        childContainer.forEach(function (child) {
            var tag = (document.querySelector('#' + (child.selectionType || child)) || '');
            if (tag) childTags.push(tag);
        });
        return childTags || [];
    }
    return document.querySelector('#' + childContainer) || [];
}

/**
* @method removeListeners
* Remove listener for passed elements 
* @param {String} tagsIds 
* @param {Function} functionName 
*/
trellidor.removeListeners = function (tagsIds, functionName) {
    this.getElements(tagsIds).forEach(function (childTag) {
        var event = 'click';
        if (childTag.type === 'range') event = 'input';
        childTag.removeEventListener(event, functionName);
    });
}

trellidor.setRangeSliderStatusColor = function (rangeSlider) {
    var value = (rangeSlider.value - rangeSlider.getAttribute('min')) / (rangeSlider.getAttribute('max') - rangeSlider.getAttribute('min'));
    var backgroundImage = "-webkit-gradient(linear, left top,right top," + "color-stop(" + value + ", " + constants.sliderBgColor[0] + ")," + "color-stop(" + value + ",  " + constants.sliderBgColor[1] + "))";
    var style = document.createElement('style');
    var styles = '{ background-image:' + backgroundImage + '}';
    style.innerHTML = '#' + rangeSlider.id + '::-webkit-slider-runnable-track ' + styles;
    document.head.appendChild(style);
}

/**
* @method ShowSaveBarElement
* Showing the save bar tag, when this method was called 
*/
trellidor.ShowSaveBarElement = function () {
    if (!(this.getElements(constants.undoRedoEventIds).length)) {
        this.createSetOfElements(constants.redoUndoWithSave, this.parentTag);
        this.enableUndoRedoListeners();
    }
}


trellidor.showOrHideLoader = function (flag) {
    if (flag) {
        var body = document.querySelector('body');
        this.createSetOfElements(constants.backDropTag, body);
        this.createSetOfElements(constants.loaderTag, body);
        return;
    }
    this.removeElement('#' + constants.loadingMaskId);
    this.removeElement('#' + constants.backDrop);
}

trellidor.discardAlertPopup = function (flag) {
    if (flag) {
        var body = document.querySelector('body');
        this.createSetOfElements(constants.backDropTag, body);
        this.createSetOfElements(constants.discardConfirmationTag, body);
        return;
    }
    this.removeElement('#' + constants.discardNotifyEvents[0]);
    this.removeElement('#' + constants.backDrop);
}


trellidor.backButton = function (flag) {
    if (flag) {
        if (!this.getElements([constants.backBtnEventIds[0]]).length > 0) {
            this.createSetOfElements(constants.backButtonTag, this.parentTag);
            var backTag = this.getElements(constants.backBtnEventIds);
            backTag[1].addEventListener('click', function () {
                trellidor.backBtnConfiramtionPopup();
            });
        }
        return;
    }
    this.removeElement('#' + constants.backBtnEventIds[0]);
}

trellidor.backBtnConfiramtionPopup = function () {
    var body = document.querySelector('body');
    this.createSetOfElements(constants.backDropTag, body);
    this.createSetOfElements(constants.backBtnConfirmationTag, body);

    var tags = this.getElements(constants.backBtnconfirmationEventIds);
    tags[2].addEventListener('click', function () {
        trellidor.removeElement('#' + constants.backBtnconfirmationEventIds[0]);
        trellidor.removeElement('#' + constants.backDrop);
        var event = new CustomEvent(constants.pluginEvents[0], {
            detail: {
                type: constants.pluginDestroyTypes[4]
            }
        });
        document.dispatchEvent(event);
    });

    tags[3].addEventListener('click', function () {
        trellidor.removeElement('#' + constants.backBtnconfirmationEventIds[0]);
        trellidor.removeElement('#' + constants.backDrop);
        var obj = imageViewer.fabricCanvas.getActiveObject();
        if (trellidor.enableSaveBar.unSavedChanges) {
            if (!obj) {
                trellidor.ShowSaveBarElement();
            }
        } else {
            if (!obj) {
                trellidor.backButton(true);
            }
        }
    });
}

/**
* @method removeEnabledEventListeners
* Based on unselected navigation removing the listeners
* @param {String} id 
*/
trellidor.removeEnabledEventListeners = function (id) {
    switch (id) {
        case constants.navigationEventIds[0]: {
        }
            break;
        case constants.navigationEventIds[1]: {
        }
            break;
        case constants.navigationEventIds[2]: {
            this.removeElement('#shape-innerchilds');
            this.removeElement('#deleteContainer');
        }
            break;
        case constants.navigationEventIds[3]: {
            this.removeElement('#deleteContainer');
        }
            break;
        case constants.navigationEventIds[4]: {
            this.removeElement('#deleteContainer');
            break;
        }
    }
}
/**
* 
*/
trellidor.mainViewInitializer = function () {
    // this.showOrHideLoader(false);
    this.setLandscapeViewOrPotaritView();
    this.creatingMainView();
    this.enablingNavigationListeners();
}

/**
*  @method setLandscapeViewOrPotaritView
*  Based on orientation setting the lanscape view or potrait view.
*/
trellidor.setLandscapeViewOrPotaritView = function () {
    // Based on screen orientation landscape view or potrait view will be showed.
    if (this.orientationType === constants.orientation[1]) {
        constants.potraitTags();
    } else {
        constants.landScapeTags();
    }
}


/**
* @method initializer
* Initializing the properties by using plugin configurations
* @param {Object} plugInParameters 
*/
trellidor.initializer = function (plugInParameters, failureCallback) {
    //enabling the loading mask
    this.reset();
    trellidor.showOrHideLoader(true);
    this.pluginInputParamters = plugInParameters;
    if (!this.pluginInputParamters.token) {
        return;
    }
    // trellidor.validateToken(failureCallback);
    trellidor.loadStyles(failureCallback);
};

trellidor.validateToken = function (failureCallback) {
    var data = JSON.stringify({
        "TokenId": this.pluginInputParamters.token,
        "AppName": 'Vid mate',//navigator.appName,
        "DeviceId": device.uuid
    });
    var url = constants.validateTokenUrl;
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4 && this.status == 200) {
            return trellidor.languageSetting();
        } else if (this.readyState === 4) {
            if (typeof failureCallback === "function") {
                // return failureCallback();
                return trellidor.languageSetting();
            }
            return;
        }
    });
    xhr.open("POST", url);
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("cache-control", "no-cache");
    xhr.send(data);

    // var xhttp = new XMLHttpRequest(),
    //     url = 'http://192.168.1.122:63376/AppHistory/ValidateToken',
    //     params = 'TokenId=' + this.pluginInputParamters.token + '&AppName=' + navigator.appName + '&DeviceId=' + device.uuid;
    // xhttp.onreadystatechange = function () {
    //     if (this.readyState == 4 && this.status == 200) {
    //         document.getElementById("demo").innerHTML = this.responseText;
    //     }
    // };
    // xhttp.open("POST", "demo_post2.asp", true);
    // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // xhttp.send(params);
}

/**
 * @method CSSDone
 * Loaded css on the viewport
 * Call the @method trellidor.languageInitializer()
 */
trellidor.CSSDone = function (failureCallback) {
    if (this.isCssLoaded) {
        trellidor.languageSetting();
        // trellidor.validateToken(failureCallback);
    }
};

trellidor.languageSetting = function () {
    if (this.pluginInputParamters && this.pluginInputParamters.language === constants.hebrew) {
        this.languageInitializer(this.pluginInputParamters.language);
    } else {
        this.languageInitializer('en');
    }
}

/**
 * @method
 * Load the styles on viewport
 * Call the @method trellidor.CSSDone()
 */
trellidor.loadStyles = function (failureCallback) {
    var url = "style.css",
        head = document.getElementsByTagName('head')[0];
    link = document.createElement('link');
    link.type = "text/css";
    link.rel = "stylesheet"
    link.href = url;

    if (link.addEventListener) {
        link.addEventListener('load', function () {
            trellidor.isCssLoaded = true;
            trellidor.CSSDone(failureCallback);
        }, false);
    }
    // MAGIC ends

    head.appendChild(link);
    // #6 - FF
    // thanks Zach Leatherman, Oleg Slobodsko, Ryan Grove
    var isFF = /Firefox/.test(navigator.userAgent);
    if (!isFF) {
        return;
    }
    var style = document.createElement('style');
    style.textContent = '@import "' + url + '"';
    var fi = setInterval(function () {
        try {
            style.sheet.cssRules; // only populated when file is loaded
            trellidor.CSSDone(failureCallback);
            clearInterval(fi);
        } catch (e) { }
    }, 10);

    head.appendChild(style);
}


/**
* @method languageInitializer
*  setting the language
* @param {String} localeLanguage 
*/
trellidor.languageInitializer = function (localeLanguage) {
    if (!(constants.multilanguage.includes(localeLanguage))) {
        localeLanguage = constants.multilanguage[0];
    }
    this.readJsonFile('./locale/' + localeLanguage + '-lang.json', function (labelData) {
        trellidor.viewInitializer(JSON.parse(labelData));
    });
}

/**
* @param {String} labelData
*/
trellidor.viewInitializer = function (labelData) {
    constants.labelHolder = labelData;
    // sets the direction of the language (left to right or right to left).
    if (constants.labelHolder.ltr) {
        constants.labelHolder.className = constants.LtrLanguage;
        imageViewer.languageDirection.ltr = true;
    } else {
        constants.labelHolder.className = constants.RtlLanguage;
        imageViewer.languageDirection.ltr = false;
    }
    this.templateFilePathHandler();
}

trellidor.setCanvasMargins = function () {
    var userAgent = navigator.userAgent.toLowerCase();
    const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);

    if (isTablet) {
        imageViewer.isTablet = true;
        imageViewer.defaultTextProps.cornerSize = 30;
        imageViewer.defaultCornerProps.cornerSize = 30;
        imageViewer.defaultShapeProps.cornerSize = 30;
        if (imageViewer.orientationType === constants.orientation[0]) {
            imageViewer.canvasMargins = {
                height: 20,
                width: 170,
                verticalMargin: 20,
                horizontalMargin: 80,
                minMargin: 70
            }
            return;
        }
        imageViewer.canvasMargins = {
            height: 170,
            width: 20,
            verticalMargin: 80,
            horizontalMargin: 20,
            minMargin: 70
        }
    } else {
        imageViewer.isTablet = false;
        if (imageViewer.orientationType === constants.orientation[0]) {
            imageViewer.canvasMargins = {
                height: 20,
                width: 130,
                verticalMargin: 20,
                horizontalMargin: 60,
                minMargin: 50
            }
            return;
        }
        imageViewer.canvasMargins = {
            height: 130,
            width: 20,
            verticalMargin: 60,
            horizontalMargin: 20,
            minMargin: 50
        }
    }
}

trellidor.templateFilePathHandler = function () {
    this.removeElement('#' + constants.landScapeOrPortraitEvents);
    this.removeElement('#' + constants.backDrop);
    if (this.pluginInputParamters && this.pluginInputParamters.templateFilePath && this.pluginInputParamters.templateFilePath.includes(constants.fileTypes[1])) {
        this.requestPermission(this.pluginInputParamters.templateFilePath);
    } else {
        this.takePicture();
    }
}

trellidor.requestPermission = function (templateFilePath) {
    var permissions = cordova.plugins.permissions;
    permissions.checkPermission(permissions.READ_EXTERNAL_STORAGE, checkPermissionCallback, null);

    function checkPermissionCallback(status) {
        console.log('hello');
        if (!status.hasPermission) {
            console.log('hi');
            var errorCallback = function () {
                // trellidor.takePicture();
                console.warn('Storage permission is not turned on');
            }
            permissions.requestPermission(
                permissions.READ_EXTERNAL_STORAGE,
                function (status) {
                    console.log('hi');
                    if (!status.hasPermission) {
                        trellidor.removeElement('#' + constants.loadingMaskId);
                        var event = new CustomEvent(constants.pluginEvents[0], {
                            detail: {
                                type: constants.pluginDestroyTypes[5]
                            }
                        });
                        document.dispatchEvent(event);
                    } else {
                        console.log('finally');
                        trellidor.imageOrCamera(templateFilePath);
                    }
                },
                function () {
                    console.log('error call back');
                    //   trellidor.takePicture();
                });
        } else {
            console.log('ha permissions');
            trellidor.imageOrCamera(templateFilePath);
        }
    }
}

trellidor.imageOrCamera = function (templateFilePath) {
    if (!((templateFilePath).includes(constants.androidNativeUrl))) {
        templateFilePath = constants.androidNativeUrl + templateFilePath;
    }
    window.resolveLocalFileSystemURL(templateFilePath,
        function (fileEntry) {
            if (fileEntry.isFile) {
                console.log('correct template file path');
                resolveLocalFileSystemURL(templateFilePath, function (entry) {
                    console.log('cdvfile URI: ' + entry.toInternalURL());
                    var CordovaTemplateFilePath = entry.toInternalURL();
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', templateFilePath, true);
                    xhr.responseType = 'blob';
                    xhr.onload = function (data) {
                        trellidor.currentImage = this.responseURL;
                        trellidor.isTemplateFileValid = true;
                        trellidor.orientationBasedOnImgSize();
                    };
                    xhr.onerror = function () {
                        trellidor.takePicture();
                    }
                    xhr.send();
                }, function () {
                    trellidor.takePicture();
                });
            } else {
                trellidor.takePicture();
            }
        },
        function () {
            trellidor.takePicture();
        });
}

/**
* 
*/
trellidor.takePicture = function () {
    var options = {
        quality: 100,
        // allowEdit: true,
        destinationType: navigator.camera.DestinationType.DATA_URL,
        encodingType: navigator.camera.EncodingType.JPEG,
        mediaType: navigator.camera.MediaType.PICTURE,
        // sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
        correctOrientation: true,
        // targetWidth: 3000
    };
    navigator.camera.getPicture(
        function (imageData) {
            trellidor.currentImage = 'data:image/jpeg;base64,' + imageData;
            trellidor.orientationBasedOnImgSize();
        },
        function (err) {
            // trellidor.takePicture();
            trellidor.removeElement('#' + constants.loadingMaskId);
            var event = new CustomEvent(constants.pluginEvents[0], {
                detail: {
                    type: constants.pluginDestroyTypes[0]
                }
            });
            document.dispatchEvent(event);
        },
        options
    );
}


trellidor.orientationBasedOnImgSize = function () {
    var fabricCopy = fabric;
    fabricCopy.Image.fromURL(trellidor.currentImage || this.canvasImg, function (img) {
        if (img.height > img.width) {
            imageViewer.orientationType = constants.orientation[1];
            trellidor.orientationType = constants.orientation[1];
            window.screen.orientation.lock(constants.orientation[1]);
            setTimeout(function () { //orientation is not changining syncronusly
                trellidor.setCanvasMargins();
                trellidor.mainViewInitializer();
            }, 1000);
        } else {
            imageViewer.orientationType = constants.orientation[0];
            trellidor.orientationType = constants.orientation[0];
            window.screen.orientation.lock(constants.orientation[0]);
            setTimeout(function () {
                trellidor.setCanvasMargins();
                trellidor.mainViewInitializer();
            }, 1000);
        }
    });
}

/**
* @method readJsonFile
* getting a language based on language
* @param {String} file 
* @param {Function} callback 
*/
trellidor.readJsonFile = function (file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}


/**
* @method cropHandler
* Appending crop overlay to the view
* @param {Boolean} isAlreadySelected 
* @param {Boolean} canvasObjectSelection
*/
trellidor.cropHandler = function (isAlreadySelected, canvasObjectSelection) {
    if (isAlreadySelected) {
        this.unSelectedNavigationIcon(constants.navigatorChilds[0], canvasObjectSelection); //if it is already selected removing element from dom.
        return;
    }
    this.selectedNavigationIcon(); //highlighting the selected navigation icon

    this.createSetOfElements(constants.cropChildTags, this.parentTag);

    if (canvasObjectSelection) {
        this.removeElement('#' + constants.undoRedo);
        this.enablingCropListeners(true);
        return;
    }
    this.enablingCropListeners(); //enabling the listeners by using addEventListener.
}

/**
* @method brightnessHandler
* Appending brightness overlay to the view
* @param {Boolean} isAlreadySelected 
* @param {Boolean} canvasObjectSelection
*/
trellidor.brightnessHandler = function (isAlreadySelected, canvasObjectSelection) {
    if (isAlreadySelected) {
        this.unSelectedNavigationIcon(constants.navigatorChilds[1], canvasObjectSelection);
        return;
    }
    this.createSetOfElements(constants.brightnessChildTags, this.parentTag);
    this.selectedNavigationIcon();
    this.enablingBrightnessListeners();
}

/**
* @method drawShapeHandler
* Appending draw shape overlay to the view
* @param {Boolean} isAlreadySelected 
* @param {Boolean} canvasObjectSelection
*/
trellidor.drawShapeHandler = function (isAlreadySelected, canvasObjectSelection) {
    if (isAlreadySelected) {
        this.unSelectedNavigationIcon(constants.navigatorChilds[2], canvasObjectSelection);
        return;
    }
    this.selectedNavigationIcon();
    if (canvasObjectSelection) {
        return;
    }
    this.createSetOfElements(constants.drawShapeChildTags, this.parentTag);
    this.enablingDrawShapeListeners();
}

/**
* @method drawHandler
* Appending free draw overlay to the view
* @param {Boolean} isAlreadySelected 
* @param {Boolean} canvasObjectSelection
*/
trellidor.drawHandler = function (isAlreadySelected, canvasObjectSelection) {
    if (isAlreadySelected) {
        this.unSelectedNavigationIcon(constants.navigatorChilds[3], canvasObjectSelection);
        return;
    }
    this.selectedNavigationIcon();

    this.createSetOfElements(constants.drawChildTags, this.parentTag);
    var rangeSlider = this.getElements(constants.rangeSliders[1]);
    this.setRangeSliderStatusColor(rangeSlider);

    if (canvasObjectSelection) {
        this.enablingDrawHandler(true);
        this.createSetOfElements(constants.deleteIconTag, this.parentTag);
        this.enableDeleteListner();
        this.removeElement('#' + constants.undoRedo);
        return;
    }
    this.enablingDrawHandler();
}


/**
* @method textHandler
* Appending text overlay to the view
* @param {Boolean} isAlreadySelected 
* @param {Boolean} canvasObjectSelection
*/
trellidor.textHandler = function (isAlreadySelected, canvasObjectSelection) {
    if (isAlreadySelected) {
        this.unSelectedNavigationIcon(constants.navigatorChilds[4], canvasObjectSelection);
        this.removeElement('#textTopBar');
        return;
    }
    this.selectedNavigationIcon();

    this.createSetOfElements(constants.textChildTags, this.parentTag);
    //setting background runnable track slider color
    var rangeSlider = this.getElements(constants.rangeSliders[2]);
    this.setRangeSliderStatusColor(rangeSlider);

    if (canvasObjectSelection) {
        this.enablingTextListners(true);
        this.enableDeleteListner();
        return;
    }
    this.enablingTextListners();
}

//*********************************************** */


/**
* @method enableAllCanvasEventListenMethods
* Enabling all canvas listener events by calling all emthods
*/
trellidor.enableAllCanvasEventListenMethods = function () {
    this.enableCanvasUndoRedo();
    this.enableCanvasCropListner();
    this.enableCanvasShapeListener(); //enabling all canvas methods.
    this.enableCanvasTextListener();
    this.enableCanvasUnSelectedListener();
    this.enableCanvasDrawListener();
    this.enableTextSelectionEvent();
    this.enableTextUnSelectionEvent();
    this.enablePathCreatedEvent();
    this.enableUndoLimitMsg();
    this.enableDeviceBackButton();
    this.enableKeyboardListeners();
    this.enableOrientationListeners();
}

trellidor.enableOrientationListeners = function () {
    var event = trellidor.lockTheOrientation.bind(trellidor);
    this.getElements('ud-canvas').addEventListener('locktheorientation', event, false);

    var event = trellidor.unlockTheOrientation.bind(trellidor);
    this.getElements('ud-canvas').addEventListener('unlocktheorientation', event, false);
}

trellidor.enableDeviceBackButton = function () {
    // var event = trellidor.devicebackBtnEventHandling.bind(trellidor);
    document.addEventListener('backbutton', devicebackBtnEventHandling, false);
}

trellidor.enableUndoLimitMsg = function () {
    var event = trellidor.undoLimitAlertMsg.bind(trellidor);
    this.getElements('ud-canvas').addEventListener('undolimit', event, false);
}

trellidor.enablePathCreatedEvent = function () {
    var event = trellidor.pathCreationStarted.bind(trellidor);
    this.getElements('ud-canvas').addEventListener('hideSlider', event, false);
}

trellidor.enableTextSelectionEvent = function () {
    var event = trellidor.textSelectedOnCanvas.bind(trellidor);
    this.getElements('ud-canvas').addEventListener('texteditingstarted', event, false);
}

trellidor.enableTextUnSelectionEvent = function () {
    var event = trellidor.textUnSelectedOnCanvas.bind(trellidor);
    this.getElements('ud-canvas').addEventListener('texteditingexited', event, false);
}

/**
* @method enableCanvasUndoRedo
* Enabling or disabling the undo redo icons
*/
trellidor.enableCanvasUndoRedo = function () {
    var event = trellidor.enableOrDisableUndoRedo.bind(trellidor);
    this.getElements('ud-canvas').addEventListener('doenableundo', event, false);
}

/**
* @method enableCanvasCropListner
* Enable the crop overlay when event fired
*/
trellidor.enableCanvasCropListner = function () {
    var event = trellidor.handleCanvasCropProperties.bind(trellidor);
    this.getElements('ud-canvas').addEventListener('cropzoneselected', event, false);
}

/**
* @method enableCanvasShapeListener
* Enable the draw shape overlay when event fired
*/
trellidor.enableCanvasShapeListener = function () {
    var event = trellidor.handleCanvasListenShapeProperties.bind(trellidor);
    this.getElements('ud-canvas').addEventListener('applyshapeprops', event, false);
}

/**
* @method enableCanvasTextListener
* Enable the text overlay when event fired
*/
trellidor.enableCanvasTextListener = function () {
    var event = trellidor.handleCanvasTextProperties.bind(trellidor);
    this.getElements('ud-canvas').addEventListener('applytextboxprops', event, false);
}

/**
* @method enableCanvasUnSelectedListener
* Removed the enabled overlay when no objected Selected
*/
trellidor.enableCanvasUnSelectedListener = function () {
    var event = trellidor.handleCanvasUnSelected.bind(trellidor);
    this.getElements('ud-canvas').addEventListener('unselectobject', event, false);
}

/**
* @method enableCanvasDrawListener
* Enable the draw  overlay when event fired
*/
trellidor.enableCanvasDrawListener = function () {
    var event = trellidor.handleCanvasDrawProperties.bind(trellidor);
    this.getElements('ud-canvas').addEventListener('applydrawprops', event, false);
}

// var colorPickerListnerFun = null; // use to store the color picker listener function

/**
* @method enablingNavigationListeners
* Handling the navigation bar events
*/
trellidor.enablingNavigationListeners = function () {
    this.getElements(constants.navigationParentEventIds).forEach(function (element) {
        element.addEventListener('click', function () {
            var id = constants.navigationEventIds.filter(function (elementId) {
                return element.id.includes(elementId);
            });

            // imageViewer.discardChanges();

            if (trellidor.enableSaveBar && trellidor.enableSaveBar.unSavedChanges) {
                trellidor.enableSaveBar.ShowSaveBar = true;
            }
            trellidor.selectedNavigationHandling(trellidor.getElements(id[0]));
        });
    });
}

/**
* @method enablingCropListeners
* Enabling the crop related child listeners 
*/
trellidor.enablingCropListeners = function (diffNavigation) {
    this.enablingApplyAndDiscardListeners();
    var idList = constants.cropEventIds;
    this.isPreviouslyCropSelected = true;

    this.getElements(idList).forEach(function (childTag) {
        if ((childTag.id === idList[0] && trellidor.initialNavigation) || diffNavigation) {  // this will execute for first time.
            trellidor.initialNavigation = false;
            diffNavigation = false;
            trellidor.iconHighlight(constants.cropChildIconIds[0]);
        }
        childTag.isRotated = false;
        var event = trellidor.cropListeners.bind(trellidor);
        childTag.addEventListener('click', event);
    });
}

/**
* @method cropListeners
* Handling the crop and rotate events 
* @param {Event} event 
*/
trellidor.cropListeners = function (event) {
    var childTag = event.currentTarget || event,
        idList = constants.cropEventIds;

    switch (childTag.id) {
        case idList[0]: {
            this.iconHighlight(constants.cropChildIconIds[0]);
            if (this.getElements(constants.cropChildIconIds[0]).src.includes('enabled')) {
                imageViewer.setActivateCropZone();
                this.isPreviouslyCropSelected = true;
                this.removeElement('#' + constants.undoRedo);
                this.backButton(true);
            } else {
                imageViewer.removeCropZone();
                this.isPreviouslyCropSelected = false;
                if (this.enableSaveBar.unSavedChanges && !this.getElements(idList[1]).isRotated) {
                    this.backButton(false);
                    this.ShowSaveBarElement();
                } else {
                    this.backButton(true);
                }
            }
        }
            break;
        case idList[1]: {
            imageViewer.rotateImage();
            this.enableSaveBar.ShowSaveBar = false;
            childTag.isRotated = true;
            this.removeElement('#' + constants.undoRedo);
            this.backButton(true);
            if (this.isPreviouslyCropSelected) {
                imageViewer.removeCropZone();
                this.previousAction = constants.cropChildIconIds[0];
                this.iconHighlight(constants.cropChildIconIds[0]);
            }
        }
            break;
    }
}


/**
* @method enablingBrightnessListeners
*  Enabling the brightness listeners
*/
trellidor.enablingBrightnessListeners = function () {
    this.enablingApplyAndDiscardListeners();
    var idList = constants.brightnessEventIds,
        setValueTags = this.getElements(idList);
    var iconIds = constants.brightnessPortraitEventIds;
    var tags = this.getElements(iconIds);
    var sliderWrapperTags = this.getElements(constants.rangeSliderWrappers);
    tags.forEach(function (element) {
        element.addEventListener('click', function () {
            switch (element.id) {
                case iconIds[0]:
                    if (tags[0].src.includes('enabled')) {
                        tags[0].src = 'assets/' + tags[0].id + '_disabled.svg';
                        setValueTags[0].style.display = 'none';
                        sliderWrapperTags[0].style.display = 'none';
                    } else {
                        tags[0].src = 'assets/' + tags[0].id + '_enabled.svg';
                        setValueTags[0].style.display = 'block';
                        sliderWrapperTags[0].style.display = 'block';

                        tags[1].src = 'assets/' + tags[1].id + '_disabled.svg';
                        setValueTags[1].style.display = 'none';
                        sliderWrapperTags[1].style.display = 'none';
                    }
                    break;
                case iconIds[1]:
                    if (tags[1].src.includes('enabled')) {
                        tags[1].src = 'assets/' + tags[1].id + '_disabled.svg';
                        setValueTags[1].style.display = 'none';
                        sliderWrapperTags[1].style.display = 'none';
                    } else {
                        tags[1].src = 'assets/' + tags[1].id + '_enabled.svg';
                        setValueTags[1].style.display = 'block';
                        sliderWrapperTags[1].style.display = 'block';

                        tags[0].src = 'assets/' + tags[0].id + '_disabled.svg';
                        setValueTags[0].style.display = 'none';
                        sliderWrapperTags[0].style.display = 'none';
                    }
                    break;
            }
        });
    });

    setValueTags.forEach(function (childTag) {
        childTag.idList = idList;
        var event = trellidor.brightnessListeners.bind(trellidor);
        childTag.addEventListener('input', event);
    });

    //calling canvas method for previous values
    var imageProperties = imageViewer.getImageFilters(),
        brightnessval = imageProperties[0].brightness,
        contrastVal = imageProperties[1].contrast;

    setValueTags[0].value = brightnessval;
    setValueTags[1].value = contrastVal;

    this.setRangeSliderStatusColor(setValueTags[0]);
    this.setRangeSliderStatusColor(setValueTags[1]);

}


/**
* @method brightnessListeners
* setting the brightness and contrast 
* @param {Event} event 
*/
trellidor.brightnessListeners = function (event) {
    var childTag = event.target,
        idList = childTag.idList;

    this.removeElement('#' + constants.undoRedo);
    this.backButton(true);
    this.enableSaveBar.ShowSaveBar = false;
    switch (childTag.id) {
        case idList[0]: {
            this.setRangeSliderStatusColor(childTag);
            imageViewer.applyBrightness(Number(childTag.value)); //call canvas brightness method.
            break;
        }
        case idList[1]: {
            this.setRangeSliderStatusColor(childTag);
            imageViewer.applyContrast(Number(childTag.value)); //calling canvas contrast method.
            break;
        }
    }
}


/**
* @method enablingDrawShapeListeners
* Enabling the draw shape icon listeners
*/
trellidor.enablingDrawShapeListeners = function () {
    this.getElements(constants.drawShapeEventIds).forEach(function (childTag) {
        var event = trellidor.drawShapeListeners.bind(trellidor);
        childTag.addEventListener('click', event);
    });
}

/**
* @method drawShapeListeners
* Enabling overlay and listener based on selected shape
* @param {Event} event 
* @param {Boolean} bolVal 
*/
trellidor.drawShapeListeners = function (event, bolVal) {
    var childTag = event.currentTarget || event,
        shape = childTag.id,
        slider;

    if (shape === constants.drawShapeEventIds[0]) {
        this.excecuteSelectedHandler(this.selectedNavigation, true);
        this.selectedNavigation = null;
        this.previousNavigation = null;
        return;
    }

    //canvas method
    if (!bolVal) {
        imageViewer.drawShape(childTag.id);
    }
    this.enableSaveBar.ShowSaveBar = false;
    this.canvasProperties.shape = shape;

    this.removeElement('#' + constants.undoRedo);
    this.backButton(false);
    this.presentAction = childTag.id;

    this.createSetOfElements(constants.drawShapeInnerChildTags, this.parentTag);
    this.createSetOfElements(constants.deleteIconTag, this.parentTag);
    this.enableDeleteListner();
    var rangeSlider = this.getElements(constants.rangeSliders[0]);
    this.setRangeSliderStatusColor(rangeSlider);

    var shapeWrapper = this.getElements(constants.navigatorChilds[2]);
    shapeWrapper.style.display = 'none';

    if ((childTag.id || event) === constants.drawShapeEventIds[1]) {  // hidding the fill color container
        this.getElements('fillColorContainer').style.display = 'none';
    }

    this.getElements(constants.drawShapeChildEventIds).forEach(function (childTag) {
        var event = 'click';
        if (childTag.type === 'range') event = 'input';
        childTag.shape = shape;
        var scopeEvent = trellidor.drawShapeChildListeners.bind(trellidor);
        childTag.addEventListener(event, scopeEvent);
    });
}

/**
* @method drawShapeChildListeners
*  Setting the selected properties for Object
* @param {Event} event 
*/
trellidor.drawShapeChildListeners = function (event) {
    var idList = constants.drawShapeChildEventIds, //events that are to be handled
        selectedColorHolders = this.getElements(constants.drawShapeColorFiller),
        childTag = event.currentTarget || event,
        rangeSlider = this.getElements(constants.rangeSliders[0]),
        sliderWrapperTag = this.getElements(constants.rangeSliderWrappers[2]),
        icon = this.getElements(idList[2]);

    switch (childTag.id) {
        case idList[0]: {
            var colorPickerColorsIds = this.enableOrDisableColorPicker(true);
            var colorPickerHeader = this.getElements(constants.colorPickerLabel);
            colorPickerHeader.innerHTML = constants.labelHolder.chooseColor + ' ' + constants.labelHolder.fillColor;
            this.getElements(colorPickerColorsIds).forEach(function (colorTag) {  //color events
                colorTag.childTagId = childTag.id;
                colorTag.selectedColorHolders = selectedColorHolders;
                var event = trellidor.drawShapeColorListener.bind(trellidor);
                colorTag.addEventListener('click', event);
            });
            this.hideSlider(0, icon, 2, 'assets/line_disabled.svg');
            break;
        }
        case idList[1]: {
            var colorPickerColorsIds = this.enableOrDisableColorPicker(true);
            var colorPickerHeader = this.getElements(constants.colorPickerLabel);
            colorPickerHeader.innerHTML = constants.labelHolder.chooseColor + ' ' + constants.labelHolder.borderColor;
            this.getElements(colorPickerColorsIds).forEach(function (colorTag) {  //color events
                colorTag.childTagId = childTag.id;
                colorTag.selectedColorHolders = selectedColorHolders;
                var event = trellidor.drawShapeColorListener.bind(trellidor);
                colorTag.addEventListener('click', event);
            });
            this.hideSlider(0, icon, 2, 'assets/line_disabled.svg');
            break;
        }
        case idList[2]: {
            if (childTag.src.includes('enabled')) {
                this.hideSlider(0, icon, 2, 'assets/line_disabled.svg');
            } else {
                rangeSlider.style.display = 'flex';
                childTag.src = 'assets/line_enabled.png';
                sliderWrapperTag.style.display = 'block';
            }

            if (!childTag.listener) {
                childTag.listener = true;
                rangeSlider.addEventListener('input', function () {
                    var diameterValue = Number(rangeSlider.value);
                    trellidor.canvasProperties.drawShapeDiameter = diameterValue;
                    imageViewer.applyShapeBorderDiameter(diameterValue); // canvas method

                    //setting background runnable track slider color
                    trellidor.setRangeSliderStatusColor(rangeSlider);
                });
            }
        }
            break;
        case idList[3]: {
            if (this.enableSaveBar && (!this.enableSaveBar.ShowSaveBar)) {
                this.discardAlertPopup(true);
                var ok = this.getElements(constants.discardNotifyEvents[1]);
                var cancel = this.getElements(constants.discardNotifyEvents[2]);
                ok.addEventListener('click', function () {
                    trellidor.discardAlertPopup(false);
                    trellidor.shapeDiscardInstructions();
                });
                cancel.addEventListener('click', function () {
                    trellidor.discardAlertPopup(false);
                });
            } else {
                trellidor.shapeDiscardInstructions();
            }
            break;
        }
        case idList[4]: {
            this.presentAction = null;
            this.enableSaveBar.ShowSaveBar = true;
            this.enableSaveBar.unSavedChanges = true;
            imageViewer.applyChanges(); //canvas method
            this.removeElement('#shape-innerchilds');
            this.removeElement('#deleteContainer');
            this.removeElement('#ud-apply-discard-element');
            var shapeWrapper = this.getElements(constants.navigatorChilds[2]);
            shapeWrapper.style.display = 'flex';
            this.ShowSaveBarElement();
        }
    }
}


trellidor.shapeDiscardInstructions = function () {
    trellidor.presentAction = null;
    trellidor.removeElement('#shape-innerchilds');
    trellidor.removeElement('#deleteContainer');
    trellidor.removeElement('#ud-apply-discard-element');
    var shapeWrapper = trellidor.getElements(constants.navigatorChilds[2]);
    shapeWrapper.style.display = 'flex';
    imageViewer.discardChanges();// call discard changes canva method
    trellidor.enableSaveBar.ShowSaveBar = true;
    if (trellidor.enableSaveBar.unSavedChanges) {
        trellidor.ShowSaveBarElement();
    } else {
        this.backButton(true);
    }
}

/**
* @method drawShapeColorListener
* Setting color for selected object
* @param {Event} event 
*/
trellidor.drawShapeColorListener = function (event) {
    var tag = event.currentTarget,
        selectedColorHolders = tag.selectedColorHolders,
        color = tag.style.background;
    this.enableOrDisableColorPicker(false);
    if (tag.childTagId === constants.drawShapeChildEventIds[0]) {
        if (tag.id === constants.colorPickerColors[12].colorName) {
            selectedColorHolders[0].style.color = constants.colorPickerColors[13].colorCode;
        } else {
            selectedColorHolders[0].style.color = constants.colorPickerColors[12].colorCode;
        }
        selectedColorHolders[0].style.background = color;
        color = color.includes(constants.url) ? constants.transparent : color;
        this.canvasProperties.drawShapeFillColor = color;
        imageViewer.fillColor(color) // canvas method
    } else if (tag.childTagId === constants.drawShapeChildEventIds[1]) {
        if (tag.id === constants.colorPickerColors[12].colorName) {
            selectedColorHolders[1].style.color = constants.colorPickerColors[13].colorCode;
        } else {
            selectedColorHolders[1].style.color = constants.colorPickerColors[12].colorCode;
        }
        selectedColorHolders[1].style.background = color;
        color = color.includes(constants.url) ? constants.transparent : color;
        this.canvasProperties.drawShapeBorderColor = color;
        imageViewer.applyShapeBorderColor(color); // canvas method 
    }
}

/**
* @method enablingDrawHandler
* Enabling the draw handler listeners
* @param {Boolean} diffNavigation 
*/
trellidor.enablingDrawHandler = function (diffNavigation) {
    this.enablingApplyAndDiscardListeners();
    var childTags = constants.drawEventIds;
    if (!diffNavigation) imageViewer.enableDrawing(constants.drawProperties);
    this.getElements(childTags).forEach(function (childTag) {
        var event = 'click';
        if (childTag.type === 'range') event = 'input';
        scopeEvent = trellidor.drawListeners.bind(trellidor);
        childTag.addEventListener(event, scopeEvent);
    });
}


/**
* @method drawListeners
* Sending the parameters to canvas method based on selected range
* @param {Event} event 
*/
trellidor.drawListeners = function (event) {
    var childTag = event.currentTarget || event,
        childTags = constants.drawEventIds,
        rangeSlider = this.getElements(constants.rangeSliders[1]),
        sliderWrapperTag = this.getElements(constants.rangeSliderWrappers[2]),
        icon = this.getElements(childTags[1]);
    switch (childTag.id) {
        case childTags[0]:
            {
                var colorPickerColorsIds = this.enableOrDisableColorPicker(true, true);
                var colorPickerHeader = this.getElements(constants.colorPickerLabel);
                colorPickerHeader.innerHTML = constants.labelHolder.chooseColor + ' ' + constants.labelHolder.borderColor;
                this.getElements(colorPickerColorsIds).forEach(function (colorTag) {  //color events
                    var event = trellidor.drawColorListener.bind(trellidor);
                    colorTag.addEventListener('click', event);
                });
                this.hideSlider(1, icon, 2, 'assets/line_disabled.svg');
                break;
            }
        case childTags[1]:
            {
                if (childTag.src.includes('enabled')) {
                    this.hideSlider(1, icon, 2, 'assets/line_disabled.svg');
                } else {
                    rangeSlider.style.display = 'flex';
                    sliderWrapperTag.style.display = 'block';
                    childTag.src = 'assets/line_enabled.png';
                    var canvasTag = document.getElementsByClassName('ud-canvas-container');
                }

                if (!childTag.listener) {
                    childTag.listener = true;
                    rangeSlider.addEventListener('input', function () {
                        var color = trellidor.getElements(constants.drawChildEventIds[0]).style.background;
                        color = color.includes(constants.url) ? constants.transparent : color;
                        trellidor.canvasProperties.drawBorderDiameter = Number(rangeSlider.value);
                        imageViewer.applyBorderDiameter({ color: color, width: Number(rangeSlider.value) }); // canvas method

                        trellidor.setRangeSliderStatusColor(rangeSlider);
                    });
                }
            }
    }
}

/**
* @method drawColorListener
* Based on  selected color sending parameters to canvas method
* @param {Event} event 
*/
trellidor.drawColorListener = function (event) {
    var tag = event.currentTarget,
        color = tag.style.background,
        colorHolderTag = this.getElements(constants.drawChildEventIds[0]);
    this.enableOrDisableColorPicker(false);
    if (tag.id === constants.colorPickerColors[12].colorName) {
        colorHolderTag.style.color = constants.colorPickerColors[13].colorCode;
    } else {
        colorHolderTag.style.color = constants.colorPickerColors[12].colorCode;
    }
    colorHolderTag.style.background = color;
    color = color.includes(constants.url) ? constants.transparent : color;
    var borderWidth = this.getElements(constants.drawChildEventIds[2]).value;
    this.canvasProperties.drawBorderColor = color;
    imageViewer.applyBorderColor({ color: color, width: Number(borderWidth) }); //canvas method
}

/**
* @method enablingTextListners
* Enabling the text listeners
* @param {Boolean} diffNavigation 
*/
trellidor.enablingTextListners = function (diffNavigation) {
    var childTags = constants.textEventIds;

    this.enableSaveBar.ShowSaveBar = false;

    if (!diffNavigation) imageViewer.addTextBox();
    this.createSetOfElements(constants.textInnerChildTags, this.parentTag);
    if (this.orientationType === constants.orientation[1]) {
        this.enablingTextChildListeners();
    } else {
        this.enablingLandscapeTextChildListeners();
    }
    this.enablingApplyAndDiscardListeners();

    this.getElements(childTags).forEach(function (childTag) {
        var event = 'click';
        if (childTag.type === 'range') event = 'input';
        var scopeEvent = trellidor.textListeners.bind(trellidor);
        childTag.addEventListener(event, scopeEvent);
    });
}

/**
* @method textListeners
* Based on event setting the size and color of text
* @param {Event} event 
*/
trellidor.textListeners = function (event) {
    var childTag = event.currentTarget || event,
        childTags = constants.textEventIds,
        labelTags = this.getElements(constants.textChildEventIds),
        rangeSlider = this.getElements(constants.rangeSliders[2]),
        sliderWrapperTag = this.getElements(constants.rangeSliderWrappers[2]),
        icon = this.getElements(childTags[1]);

    //hiding the landscape font family overlay
    var tags = this.getElements(constants.textTopOverlay);
    if (tags.length && tags[1].src.includes('enabled')) {
        tags[1].src = 'assets/family_disabled.svg';
        tags[0].style.display = 'none';
    }

    switch (childTag.id) {
        case childTags[0]:
            {
                var colorPickerColorsIds = this.enableOrDisableColorPicker(true, true);
                var colorPickerHeader = this.getElements(constants.colorPickerLabel);
                colorPickerHeader.innerHTML = constants.labelHolder.chooseColor + ' ' + constants.labelHolder.textColor;
                this.getElements(colorPickerColorsIds).forEach(function (colorTag) {  //color events
                    colorTag.labelTags = labelTags;
                    var event = trellidor.textColorListener.bind(trellidor);
                    colorTag.addEventListener('click', event);
                });
                this.hideSlider(2, icon, 2, 'assets/textIcon_disabled.svg');
            }
            break;
        case childTags[1]: {
            if (childTag.src.includes('enabled')) {
                this.hideSlider(2, icon, 2, 'assets/textIcon_disabled.svg');
            } else {
                rangeSlider.style.display = 'flex';
                sliderWrapperTag.style.display = 'block';
                childTag.src = 'assets/textIcon_enabled.svg';
            }

            if (!childTag.listener) {
                childTag.listener = true;
                rangeSlider.addEventListener('input', function () {
                    trellidor.canvasProperties.textSize = Number(rangeSlider.value);
                    imageViewer.applyTextSize(Number(rangeSlider.value));

                    trellidor.setRangeSliderStatusColor(rangeSlider);
                });
            }
        } break;
        case childTags[2]: {
            this.hideSlider(2, icon, 2, 'assets/textIcon_disabled.svg');
            imageViewer.rotateTextBox() // rotate canvas method;
        }
    };
}

/**
* @method textColorListener
* Based on  selected color sending parameters 
* @param {Event} event 
*/
trellidor.textColorListener = function (event) {
    var tag = event.currentTarget,
        color = tag.style.background;
    this.enableOrDisableColorPicker(false);
    if (tag.id === constants.colorPickerColors[12].colorName) {
        tag.labelTags[0].style.color = constants.colorPickerColors[13].colorCode;
    } else {
        tag.labelTags[0].style.color = constants.colorPickerColors[12].colorCode;
    }
    tag.labelTags[0].style.background = color;
    color = color.includes(constants.url) ? constants.transparent : color;
    this.canvasProperties.textColor = color;
    imageViewer.applyTextColor(color);
}

/**
* @method enablingTextChildListeners
* enabling the text child listeners
*/
trellidor.enablingTextChildListeners = function () {
    this.enableDeleteListner();
    var childTags = constants.textTopBlkEventIds,
        fontFamilyValue = fontStyleValue = 0;

    this.getElements(childTags).forEach(function (childTag) {
        childTag.fontFamilyValue = fontFamilyValue;
        childTag.fontStyleValue = fontStyleValue;
        var event = trellidor.textChildListeners.bind(trellidor);
        childTag.addEventListener('click', event);
    });
}

/**
* @method textChildListeners
* Based on tap, changing the font style and font family
* @param {Event} event 
*/
trellidor.textChildListeners = function (event) {
    var childTag = event.currentTarget,
        childTags = constants.textTopBlkEventIds,
        fontTags = this.getElements(constants.textTopChildEventIds),
        icon = this.getElements(constants.textEventIds[1]);

    switch (childTag.id) {
        case childTags[0]:
            {
                this.hideSlider(2, icon, 2, 'assets/textIcon_disabled.svg');
                ++childTag.fontStyleValue;
                if (childTag.fontStyleValue > constants.fontStyle.length - 1) childTag.fontStyleValue = 0;
                fontTags[0].innerHTML = constants.fontStyle[childTag.fontStyleValue].label;
                imageViewer.applyFontStyle(constants.fontStyle[childTag.fontStyleValue].value); //call canvas method
                this.canvasProperties.fontStyle = constants.fontStyle[childTag.fontStyleValue].value;
                break;
            }
        case childTags[1]:
            {
                this.hideSlider(2, icon, 2, 'assets/textIcon_disabled.svg');
                ++childTag.fontFamilyValue;
                if (childTag.fontFamilyValue > constants.fontFamily.length - 1) childTag.fontFamilyValue = 0;
                fontTags[1].innerHTML = constants.fontFamily[childTag.fontFamilyValue];
                imageViewer.applyFontFamily(constants.fontFamily[childTag.fontFamilyValue]);   //call canvas method
                this.canvasProperties.fontFamily = constants.fontFamily[childTag.fontFamilyValue];
                break;
            }
    }
}


trellidor.enablingLandscapeTextChildListeners = function () {
    this.enableDeleteListner();
    var childTags = constants.textTopBlkEventIds,
        fontFamilyValue = fontStyleValue = 0;

    this.getElements(childTags).forEach(function (childTag) {
        childTag.fontFamilyValue = fontFamilyValue;
        childTag.fontStyleValue = fontStyleValue;
        var event = trellidor.landscapeTextChildListeners.bind(trellidor);
        childTag.addEventListener('click', event);
    });
}


trellidor.landscapeTextChildListeners = function (event) {
    var childTag = event.currentTarget,
        childTags = constants.textTopBlkEventIds,
        fontTags = this.getElements(constants.textTopChildEventIds),
        icon = this.getElements(constants.textEventIds[1]);

    switch (childTag.id) {
        case childTags[0]:
            {
                //hiding the landscape font family overlay
                var tags = this.getElements(constants.textTopOverlay);
                if (tags.length && tags[1].src.includes('enabled')) {
                    tags[1].src = 'assets/family_disabled.svg';
                    tags[0].style.display = 'none';
                }

                this.hideSlider(2, icon, 2, 'assets/textIcon_disabled.svg');
                ++childTag.fontStyleValue;
                if (childTag.fontStyleValue > constants.fontStyle.length - 1) childTag.fontStyleValue = 0;
                fontTags[0].innerHTML = constants.fontStyle[childTag.fontStyleValue].label;
                imageViewer.applyFontStyle(constants.fontStyle[childTag.fontStyleValue].value); //call canvas method
                this.canvasProperties.fontStyle = constants.fontStyle[childTag.fontStyleValue].value;
                break;
            }
        case childTags[1]:
            {
                var tags = this.getElements(constants.textTopOverlay);
                if (tags.length && tags[1].src.includes('enabled')) {
                    tags[1].src = 'assets/family_disabled.svg';
                    tags[0].style.display = 'none';
                } else {
                    tags[1].src = 'assets/family_enabled.svg';
                    tags[0].style.display = 'block';
                    this.hideSlider(2, icon, 2, 'assets/textIcon_disabled.svg');
                }

                if (!childTag.listener) {
                    childTag.listener = true;
                    var fontFamiles = this.getElements(constants.fontEventIds);
                    if (!fontFamiles.length) return;
                    fontFamiles.forEach(function (tag) {
                        tag.addEventListener('click', function (event) {
                            event.stopPropagation();
                            imageViewer.applyFontFamily(tag.innerHTML);
                            fontFamiles.forEach(function (family) {
                                family.style.color = constants.colorPickerColors[13].colorCode;
                                if (family.id === tag.id) {
                                    family.style.color = '#2699FB';
                                }
                            });
                        }, false);
                    });
                }
                break;
            }
    }
}

/**
* @method enableOrDisableColorPicker
* based on condition enabling or disabling the color picker popup
* @param {Boolean} isEnable 
*/
trellidor.enableOrDisableColorPicker = function (isEnable, removeTransparent) {
    if (isEnable) {
        var colorPickerColorsIds = [];
        constants.colorPickerColors.forEach(function (o) { colorPickerColorsIds.push(o.colorName) });
        this.enablingGlobalListner(true);

        var transparentTag;
        if (removeTransparent) {
            colorPickerColorsIds.pop();
            transparentTag = constants.colorPickerColorTags.pop();
        }

        this.createSetOfElements(constants.backDropTag, document.querySelector('body'));
        this.createSetOfElements(constants.colorPickerPopupTag, document.querySelector('body'));
        var event = trellidor.closeButtonListener.bind(trellidor);
        this.getElements(constants.colorPickerCloseBtnId).addEventListener('click', event);
        if (removeTransparent) constants.colorPickerColorTags.push(transparentTag);
        return colorPickerColorsIds;
    }
    var colorPickerIds = constants.colorPickerIds;
    this.removeElement('#' + colorPickerIds[0]);
    this.removeElement('#' + colorPickerIds[1]);
    this.enablingGlobalListner(false);
}

/**
* @method enablingGlobalListner
* Enabling document listener, to close the color picker popup
* @param {Boolean} isEnable 
*/
trellidor.enablingGlobalListner = function (isEnable) {
    var event = trellidor.colorPickerOutSideListener.bind(trellidor);
    if (isEnable) {
        document.addEventListener('click', event);
        return;
    }
    document.removeEventListener('click', event);
}


/**
* @method colorPickerOutSideListener
* Removing color picker popup when clicked on outside popup 
* @param {Event} event 
*/
trellidor.colorPickerOutSideListener = function (event) {
    var className = event.target.className;
    if (className === constants.colorPickerContainer) {
        this.enableOrDisableColorPicker(false);
    }
}

/**
* @method closeButtonListener
* Removing the color picker popUp when clicked on close button
* @param {Event} event 
*/
trellidor.closeButtonListener = function (event) {
    this.enableOrDisableColorPicker(false);
}

/**
* @method enablingApplyAndDiscardListeners
*  Enabling the listerns related to apply and discard
*/
trellidor.enablingApplyAndDiscardListeners = function () {
    var idList = constants.confirmDiscard;
    this.getElements(idList).forEach(function (childTag) {
        var event = trellidor.applyAndDisacardListeners.bind(trellidor);
        childTag.addEventListener('click', event);
    });
}


/**
* @method applyAndDisacardListeners
* Enabling apply or discard listeners
* @param {Event} event 
*/
trellidor.applyAndDisacardListeners = function (event) {
    var childTag = event.currentTarget,
        idList = constants.confirmDiscard;
    switch (childTag.id) {
        case idList[0]: {
            this.enableSaveBar.ShowSaveBar = true;
            this.enableSaveBar.unSavedChanges = true;
            imageViewer.applyChanges(); //canvas method
            this.excecuteSelectedHandler(this.selectedNavigation, true);
            this.selectedNavigation = null;
            this.previousNavigation = null;
            this.removeElement('#deleteContainer');
            break;
        }
        case idList[1]: {
            if (this.enableSaveBar && (!this.enableSaveBar.ShowSaveBar)) {
                this.discardAlertPopup(true);
                var ok = this.getElements(constants.discardNotifyEvents[1]);
                var cancel = this.getElements(constants.discardNotifyEvents[2]);
                ok.addEventListener('click', function () {
                    trellidor.discardAlertPopup(false);
                    trellidor.discardInstrucions();
                });
                cancel.addEventListener('click', function () {
                    trellidor.discardAlertPopup(false);
                });
            } else {
                this.discardInstrucions();
            }
            break;
        }
    }
}

trellidor.discardInstrucions = function () {
    this.enableSaveBar.ShowSaveBar = true;
    imageViewer.discardChanges(); //canvas method
    this.excecuteSelectedHandler(this.selectedNavigation, true);
    this.selectedNavigation = null;
    this.removeElement('#deleteContainer');
    this.previousNavigation = null;
    this.discardAlertPopup(false);
}

/**
* @method enableUndoRedoListeners
* Enabling the save nav bar listeners
*/
trellidor.enableUndoRedoListeners = function () {
    var idList = constants.undoRedoEventIds;
    this.enableOrDisableUndoRedo();
    this.getElements(idList).forEach(function (child) {
        child.addEventListener('click', function () {
            switch (child.id) {
                case idList[0]: trellidor.removeElement('#' + constants.undoRedo);
                    trellidor.backBtnConfiramtionPopup();
                    break;
                case idList[1]: {
                    var undoRedoProperites = trellidor.enableOrDisableUndoRedo();
                    if (undoRedoProperites.undo) {
                        imageViewer.undoChanges();  // undo call canvas method
                        trellidor.enableOrDisableUndoRedo();
                    }
                }
                    break;
                case idList[2]: {  // redo call canvas method
                    var undoRedoProperites = trellidor.enableOrDisableUndoRedo();
                    if (undoRedoProperites.redo) {
                        imageViewer.redoChanges();
                        trellidor.enableOrDisableUndoRedo();
                    }
                }
                    break;
                case idList[3]: {
                    if (trellidor.pluginInputParamters.fileName) {
                        trellidor.removeElement('#' + constants.undoRedo);
                        trellidor.saveImage();
                        return;
                    }
                    trellidor.enableSavePopupListeners();
                }
                    break;
            }
        });
    });
}

/**
* @method enableSavePopupListeners
* Enabling the save popup listeners to save the image
*/
trellidor.enableSavePopupListeners = function () {
    this.enableSavePopupGlobalListener(true);
    // enablingGlobalListner(true);   
    this.createSetOfElements(constants.backDropTag, this.parentTag);
    this.createSetOfElements(constants.savePopup, this.parentTag);
    var idList = constants.savePopupEventIds,
        tagsToRemove = constants.savePopupChildEventIds;
    this.getElements(idList).forEach(function (child) {
        var event = 'click';
        if (child.type === 'text') event = 'input';
        child.addEventListener(event, function () {
            switch (child.id) {
                case idList[0]: {
                    tagsToRemove.forEach(function (childName) { trellidor.removeElement('#' + childName) });
                    trellidor.enableSavePopupGlobalListener(false);
                    trellidor.pluginInputParamters.editedFileName = '';
                    trellidor.ShowSaveBarElement();
                }
                    break;
                case idList[1]: {
                    tagsToRemove.forEach(function (childName) { trellidor.removeElement('#' + childName) });
                    trellidor.enableSavePopupGlobalListener(false);
                    trellidor.removeElement('#' + constants.undoRedo);
                    trellidor.pluginInputParamters.fileName = '';
                    setTimeout(function () {
                        trellidor.saveImage();
                    }, 500);
                }
                    break;
                case idList[2]: {
                    var okBtnTag = trellidor.getElements(constants.okCancel[0]);
                    if (child.value.trim() && child.value.length >= 2) {
                        trellidor.pluginInputParamters.editedFileName = child.value;
                        okBtnTag.disabled = false;
                    } else {
                        okBtnTag.disabled = true;
                    }

                    var ltrChars = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF' + '\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
                        rtlChars = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
                        rtlDirCheck = new RegExp('^[^' + ltrChars + ']*[' + rtlChars + ']');
                    if (rtlDirCheck.test(child.value)) {
                        direction = 'rtl';
                    } else {
                        direction = 'ltr';
                    }
                    child.style.direction = direction;
                }
                    break;
            }
        });
    });
}

/**
* @method enableSavePopupGlobalListener
* Enabling the document listener when save popup is available.
* @param {Boolean} isEnable 
*/
trellidor.enableSavePopupGlobalListener = function (isEnable) {
    if (!isEnable) isEnable = false;

    if (isEnable) {
        document.addEventListener('click', this.handleSavePopupListener);
        return;
    }
    document.removeEventListener('click', this.handleSavePopupListener);
}


/**
* @method handleSavePopupListener
* If user clicked on other than the savepopup body, the will be closed
* @param {Event} event 
*/
trellidor.handleSavePopupListener = function (event) {
    var event = event.currentTarget,
        className = event.className,
        tagsToRemove = constants.savePopupChildEventIds;
    if (className === 'ud-save-popup-container') {
        tagsToRemove.forEach(function (childName) { this.removeElement('#' + childName) });
        this.enableSavePopupGlobalListener(false)
    }
}


/**
* @method iconHighlight
* Changining the icon to enable state or disable state
* @param {String} id 
*/
trellidor.iconHighlight = function (id) {
    var commonTags = [];
    constants.applyOrDiscard.forEach(function (action) { commonTags.push(action.selectionType) });
    if (commonTags.indexOf(id) > -1) return;
    this.presentAction = id;
    var isSelected = ((this.previousAction ? this.previousAction : null) === this.presentAction) ? true : false;
    if (!isSelected && this.previousAction) {
        enableOrDisable(this.previousAction, true);
    }
    this.previousAction = (this.previousAction === this.presentAction ? '' : this.presentAction);
    enableOrDisable(this.presentAction, isSelected);

    function enableOrDisable(tagId, isEnabled) {
        var tag = trellidor.getElements(tagId);
        if (!isEnabled) {
            tag.src = 'assets/' + tag.id + '_enabled.png';
        } else {
            tag.src = 'assets/' + tag.id + '_disabled.png';
        }
    }
    return isSelected;
}

/**
* @method enableDeleteListner
* Enabling delete event listener (common method for all delete events)
*/
trellidor.enableDeleteListner = function () {
    var deleteIcon = this.getElements('delete');
    var backBtn = this.getElements(constants.backBtnEventIds[1]);
    deleteIcon.addEventListener('click', function () {
        console.log('clicked on deleted icon');
        if (trellidor.enableSaveBar.unSavedChanges) {
            trellidor.enableSaveBar.unSavedChanges = true;
            trellidor.enableSaveBar.ShowSaveBar = true;
        }
        imageViewer.deleteSelectedItem();
        trellidor.handleCanvasUnSelected();
    });

    if (!backBtn || backBtn.length <= 0) return;
    backBtn.addEventListener('click', function () {
        trellidor.backBtnConfiramtionPopup();
    });

}

/**
* @method handleCanvasUnSelected
* when no one object also selected 
*/
trellidor.handleCanvasUnSelected = function () {
    console.log('un selected object');
    if (this.selectedNavigation) {
        var presentNavigation = this.selectedNavigation;
        this.removeElement('#textTopBar');
        this.excecuteSelectedHandler(this.selectedNavigation, true, true);
        this.selectedNavigation = this.previousNavigation = null;
        if (this.enableSaveBar.unSavedChanges) {
            this.ShowSaveBarElement();
        } else {
            this.backButton(true);
        }
        if (presentNavigation === constants.navigationEventIds[0]) {
            this.removeElement('#' + constants.undoRedo);
        }
    }
}


/**
* @method handleCanvasListenShapeProperties
* Displaying related properties of draw shape object through overlay
* @param {Event} event 
*/
trellidor.handleCanvasListenShapeProperties = function (event) {
    console.log(event.details || event, 'canvas shape listener properties');
    var shapeProperties = event.details || event,
        id = constants.navigationEventIds[2],
        properties = shapeProperties.shapeInfo;
    this.removeElement('#' + constants.undoRedo);
    this.removeElement('#deleteContainer');
    this.removeElement('#ud-apply-discard-element');
    var isTagAvailable = this.getElements(constants.drawShapeColorFiller);
    if (this.selectedNavigation === id && isTagAvailable.length) {
        var selectedShapeTag = this.getElements(shapeProperties.shape);
        this.removeElement('#shape-innerchilds');
        this.drawShapeListeners(selectedShapeTag, true);
        this.setDrawShapeValues(shapeProperties, properties);
        return;
    }
    if (this.selectedNavigation === id) {
        this.previousNavigation = null;
    }
    this.selectedNavigationHandling(this.getElements(id), true);
    if ((this.getElements(constants.drawShapeEventIds).length) <= 0) {
        this.createSetOfElements(constants.drawShapeChildTags, this.parentTag);
        this.enablingDrawShapeListeners();
    }
    this.drawShapeListeners(this.getElements(shapeProperties.shape), true);
    this.setDrawShapeValues(shapeProperties, properties);
}

/**
* @method setDrawShapeValues
* Setting the object properties in draw shape overlay
* @param {Object} shapeProperties 
* @param {Object} properties 
*/
trellidor.setDrawShapeValues = function (shapeProperties, properties) {
    var selectedColorHolders = this.getElements(constants.drawShapeColorFiller);
    if (shapeProperties.shape === constants.drawShapeEventIds[1]) {
        this.getElements('fillColorContainer').style.display = 'none';
    }
    selectedColorHolders[0].style.background = (properties.fillColor === constants.transparent ? constants.transparentIconSrc : properties.fillColor);
    selectedColorHolders[1].style.background = (properties.borderColor === constants.transparent ? constants.transparentIconSrc : properties.borderColor);

    if (properties.fillColor === constants.whiteColorRgb[0] || properties.fillColor === constants.whiteColorRgb[1]) {
        selectedColorHolders[0].style.color = constants.colorPickerColors[13].colorCode;
    } else {
        selectedColorHolders[0].style.color = constants.colorPickerColors[12].colorCode;
    }
    if (properties.borderColor === constants.whiteColorRgb[0] || properties.borderColor === constants.whiteColorRgb[1]) {
        selectedColorHolders[1].style.color = constants.colorPickerColors[13].colorCode;
    } else {
        selectedColorHolders[1].style.color = constants.colorPickerColors[12].colorCode;
    }

    this.getElements(constants.rangeSliders[0]).value = properties.borderDiameter;

    var rangeSlider = this.getElements(constants.rangeSliders[0]);
    this.setRangeSliderStatusColor(rangeSlider);

    var imgTag = this.getElements(constants.drawShapeChildEventIds[2]);
    this.hideSlider(0, imgTag, 2, 'assets/line_disabled.svg');

    this.canvasProperties = {
        shape: shapeProperties.shape,
        drawShapeFillColor: properties.fillColor,
        drawShapeBorderColor: properties.borderColor,
        drawShapeDiameter: properties.borderDiameter,
    }
}


/**
* @method handleCanvasTextProperties
* Displaying related properties of text object through overlay
* @param {Event} event 
*/
trellidor.handleCanvasTextProperties = function (event) {
    console.log(event.details || event, 'canvas text listener properties')
    var textProperties = (event.details ? event.details.shapeInfo : event),
        id = constants.navigationEventIds[4];
    this.removeElement('#' + constants.undoRedo);
    var isTagAvailable = this.getElements(constants.textEventIds);
    if (this.selectedNavigation === id && isTagAvailable.length) {
        this.setTextValues(textProperties);
        return;
    }
    this.selectedNavigationHandling(this.getElements(id), true);
    this.setTextValues(textProperties);
}

/**
* @method setTextValues
* Setting the object properties in text overlay
* @param {Object} textProperties 
*/
trellidor.setTextValues = function (textProperties) {
    var lableTags = this.getElements(constants.textChildEventIds),
        fontTags = this.getElements(constants.textTopChildEventIds);
    lableTags[0].style.background = textProperties.textColor;

    if (textProperties.textColor === constants.whiteColorRgb[0] || textProperties.textColor === constants.whiteColorRgb[1]) {
        lableTags[0].style.color = constants.colorPickerColors[13].colorCode;
    } else {
        lableTags[0].style.color = constants.colorPickerColors[12].colorCode;
    }


    this.getElements(constants.rangeSliders[2]).value = textProperties.textSize;
    constants.fontStyle.forEach(function (o) {
        if (o.value === textProperties.fontStyle)
            fontTags[0].innerHTML = o.label;
    });
    if (fontTags[1]) {
        fontTags[1].innerHTML = textProperties.fontFamily;
    } else {
        var fontFamiles = this.getElements(constants.fontEventIds);
        if (!fontFamiles.length) return;
        fontFamiles.forEach(function (tag) {
            fontFamiles.forEach(function (family) {
                family.style.color = constants.colorPickerColors[13].colorCode;
                if (family.innerHTML === textProperties.fontFamily) {
                    family.style.color = '#2699FB';
                }
            });
        });
    }

    var rangeSlider = this.getElements(constants.rangeSliders[2]);
    this.setRangeSliderStatusColor(rangeSlider);

    var imgTag = this.getElements(constants.textEventIds[1]);
    this.hideSlider(2, imgTag, 2, 'assets/textIcon_disabled.svg');

    this.canvasProperties = {
        textSize: textProperties.textSize,
        textColor: textProperties.textColor,
        fontStyle: textProperties.fontStyle,
        fontFamily: textProperties.fontFamily,
    }
}


/**
* @method handleCanvasDrawProperties
* Displaying related properties of draw object through overlay
* @param {Event} event 
*/
trellidor.handleCanvasDrawProperties = function (event) {
    console.log(event.details || event, 'canvas draw listener propertiesss')
    var textProperties = (event.details ? event.details.shapeInfo : event),
        id = constants.navigationEventIds[3];
    this.removeElement('#' + constants.undoRedo);
    var isTagAvailable = this.getElements(constants.drawChildEventIds);
    if (this.selectedNavigation === id && isTagAvailable.length) {
        this.setDrawValues(textProperties);
        return;
    }
    this.selectedNavigationHandling(this.getElements(id), true);
    this.setDrawValues(textProperties);
}

/**
* @method setDrawValues
* Setting the object properties in free draw overlay
* @param {Object} drawProperties 
*/
trellidor.setDrawValues = function (drawProperties) {
    var labelTags = this.getElements(constants.drawChildEventIds);
    labelTags[0].style.background = (drawProperties.borderColor === constants.transparent) ? constants.transparentIconSrc : drawProperties.borderColor;
    if (drawProperties.borderColor === constants.whiteColorRgb[0] || drawProperties.borderColor === constants.whiteColorRgb[1]) {
        labelTags[0].style.color = constants.colorPickerColors[13].colorCode;
    } else {
        labelTags[0].style.color = constants.colorPickerColors[12].colorCode;
    }
    // labelTags[1].value = drawProperties.borderDiameter;
    this.getElements(constants.rangeSliders[1]).value = drawProperties.borderDiameter;

    var rangeSlider = this.getElements(constants.rangeSliders[1]);
    this.setRangeSliderStatusColor(rangeSlider);

    //setting range slider
    var imgTag = this.getElements(constants.drawEventIds[1]);
    this.hideSlider(1, imgTag, 2, 'assets/line_disabled.svg');

    this.canvasProperties = {
        drawBorderColor: drawProperties.borderColor,
        borderDiameter: drawProperties.drawBorderDiameter
    }
}

/**
* @method handleCanvasCropProperties
* Displaying related properties of crop navigation through overlay
*/
trellidor.handleCanvasCropProperties = function () {
    console.log('canvas crop selection');
    id = constants.navigationEventIds[0];
    this.removeElement('#' + constants.undoRedo);
    var isTagAvailable = this.getElements(constants.cropEventIds);
    if (this.selectedNavigation === id && isTagAvailable.length) {
        return;
    }
    this.selectedNavigationHandling(this.getElements(id), true);
}


trellidor.lockTheOrientation = function () {

}

trellidor.unlockTheOrientation = function () {
    // window.screen.orientation.unlock();
}



trellidor.pathCreationStarted = function () {
    if (this.selectedNavigation === constants.navigationEventIds[2]) {
        var imgTag = this.getElements(constants.drawShapeChildEventIds[2]);
        this.hideSlider(0, imgTag, 2, 'assets/line_disabled.svg');
    } else if (this.selectedNavigation === constants.navigationEventIds[3]) {
        this.enableSaveBar.ShowSaveBar = false;
        this.removeElement('#' + constants.undoRedo);
        var deleteTag = this.getElements(['deleteContainer']);
        if (deleteTag && deleteTag.length <= 0) {
            this.backButton(true);
        }
        var imgTag = this.getElements(constants.drawEventIds[1]);
        this.hideSlider(1, imgTag, 2, 'assets/line_disabled.svg')
    } else if (this.selectedNavigation === constants.navigationEventIds[4]) {
        var imgTag = this.getElements(constants.textEventIds[1]);
        this.hideSlider(2, imgTag, 2, 'assets/textIcon_disabled.svg');

        //hiding the landscape font family overlay
        var tags = this.getElements(constants.textTopOverlay);
        if (tags.length && tags[1].src.includes('enabled')) {
            tags[1].src = 'assets/family_disabled.svg';
            tags[0].style.display = 'none';
        }

    } else if (this.selectedNavigation === constants.navigationEventIds[1]) {
        var setValueTags = this.getElements(constants.brightnessEventIds);
        var iconIds = constants.brightnessPortraitEventIds;
        var tags = this.getElements(iconIds);
        var sliderWrapperTags = this.getElements(constants.rangeSliderWrappers);

        if (tags[0].src.includes('enabled')) {
            tags[0].src = 'assets/' + tags[0].id + '_disabled.svg';
            setValueTags[0].style.display = 'none';
            sliderWrapperTags[0].style.display = 'none';
        }

        if (tags[1].src.includes('enabled')) {
            tags[1].src = 'assets/' + tags[1].id + '_disabled.svg';
            setValueTags[1].style.display = 'none';
            sliderWrapperTags[1].style.display = 'none';
        }
    }
}

trellidor.hideSlider = function (slider, icon, sliderWrapper, src) {
    var rangeSlider = this.getElements(constants.rangeSliders[slider]),
        imgTag = icon,
        sliderWrapperTag = this.getElements(constants.rangeSliderWrappers[sliderWrapper]);
    imgTag = imgTag instanceof Array ? null : imgTag;
    if (rangeSlider && sliderWrapperTag && imgTag) {
        if (imgTag.src.includes('enabled')) {
            imgTag.src = src;
            rangeSlider.style.display = 'none';
            sliderWrapperTag.style.display = 'none';
        }
    }
}


trellidor.undoLimitAlertMsg = function () {
    trellidor.createSetOfElements(constants.backDropTag, trellidor.parentTag);
    trellidor.createSetOfElements(constants.undoRedoLimitTag, trellidor.parentTag);

    var ok = trellidor.getElements(constants.undoRedoLimitEvents[1]);
    ok.addEventListener('click', function () {
        trellidor.removeElement('#' + constants.undoRedoLimitEvents[0]);
        trellidor.removeElement('#' + constants.backDrop);
    });
}

/**
 * @method textSelectedOnCanvas
 * Text related tags wil be removed when keyboard is enabled.
 */
trellidor.textSelectedOnCanvas = function () {
}


trellidor.textUnSelectedOnCanvas = function () {
    var navigationBar = trellidor.getElements('ud_navigation_bar');
    navigationBar.style.display = 'flex';
}


trellidor.enableKeyboardListeners = function () {
    window.addEventListener('keyboardWillShow', onKeyboardShow);
    window.addEventListener('keyboardWillHide', onKeyboardHide);
}


/**
* @method saveImage
* Save the image based on given file name and type of format.
*/
trellidor.saveImage = function () {
    imageViewer.applyChanges();
    if (!(constants.fileTypes.includes(this.pluginInputParamters.fileType))) {
        this.pluginInputParamters.fileType = constants.fileTypes[0];
    }
    var fileName = this.pluginInputParamters.fileName || this.pluginInputParamters.editedFileName;
    if (this.pluginInputParamters.fileType) {
        fileName = fileName + '.' + this.pluginInputParamters.fileType;
    } else {
        fileName = fileName + '.' + constants.fileTypes[0];
    }

    if (this.pluginInputParamters.filePath) {
        var filePath = this.pluginInputParamters.filePath;
        if (!((this.pluginInputParamters.filePath).includes(constants.androidNativeUrl))) {
            filePath = constants.androidNativeUrl + filePath;
        }
        window.resolveLocalFileSystemURL(filePath,
            function () {
                console.log('correct file path');
                trellidor.generateImage(fileName);
            },
            function () {
                console.log('Incorrect file path');
                trellidor.pluginInputParamters.filePath = '';
                trellidor.accessFileSystem(fileName);
            });
    } else {
        this.accessFileSystem(fileName);
    }
}

/**
 * @method generateImage
 * this method will generate required png or pdf file.
 * 
 */
trellidor.generateImage = function (fileName) {
    trellidor.saveFinalImage(fileName);
}


/**
 * @method saveFinalImage
 * store the image in required location
 * @param {String} imageSource 
 * @param {String} fileNameWithType 
 */
trellidor.saveFinalImage = function (fileNameWithType) {
    this.showOrHideLoader(true);
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 5 * 1024 * 1024, function (fs) {
        console.log('file system open: ' + fs.name);


        var permissions = cordova.plugins.permissions;
        permissions.checkPermission(permissions.WRITE_EXTERNAL_STORAGE, checkPermissionCallback, null);

        function checkPermissionCallback(status) {
            console.log('hello');
            if (!status.hasPermission) {
                console.log('hi');
                var errorCallback = function () {
                    // trellidor.takePicture();
                    console.warn('Storage permission is not turned on');
                }
                permissions.requestPermission(
                    permissions.WRITE_EXTERNAL_STORAGE,
                    function (status) {
                        console.log('hi');
                        if (!status.hasPermission) {
                            trellidor.fileStatusMsg(false);
                            var fileContent = trellidor.getElements(constants.successMsgTagIds[1]);
                            if (fileContent) {
                                fileContent.innerHTML = (trellidor.pluginInputParamters.fileName || trellidor.pluginInputParamters.editedFileName) + ' ' + constants.labelHolder.failureMsg;
                            }
                        } else {
                            trellidor.getSampleFile(fs.root, fileNameWithType);
                        }
                    },
                    function () {
                        console.log('error call back');
                        //   trellidor.takePicture();
                    });
            } else {
                trellidor.getSampleFile(fs.root, fileNameWithType);
            }
        }


    }, function (err) {
        console.log(err);
        trellidor.fileStatusMsg(false);
        var fileContent = trellidor.getElements(constants.successMsgTagIds[1]);
        if (fileContent) {
            fileContent.innerHTML = (trellidor.pluginInputParamters.fileName || trellidor.pluginInputParamters.editedFileName) + ' ' + constants.labelHolder.failureMsg;
        }
    });
}


trellidor.getSampleFile = function (dirEntry, fileNameWithType) {
    var zoomValue = imageViewer.fabricCanvas.getZoom();
    if (zoomValue > 1) {
        imageViewer.fabricCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        imageViewer.presentZoom = 1;
    }
    var blob;
    if (fileNameWithType.includes(constants.fileTypes[1])) {
        var image = imageViewer.fabricCanvas.toDataURL({
            format: 'png',//,
            quality: 1,
            enableRetinaScaling: true
            // multiplier: 4
        });
        var block = image.split(";");
        // Get the content type of the image
        var contentType = block[0].split(":")[1];// In this case "image/gif"
        // get the real base64 content of the file
        var realData = block[1].split(",")[1];// In
        blob = trellidor.b64toBlob(realData, contentType);
        trellidor.fileExitsOrNot(dirEntry, blob, fileNameWithType);
    } else {

        var Imgwidth = imageViewer.origImgWidth,
            Imgheight = imageViewer.origImgHeight,
            width = 595,
            height = 842,
            marginTop = 0,
            marginLeft = 0,
            canvasHeight = imageViewer.origCanvasHeight,
            canvasWidth = imageViewer.origCanvasWidth,
            activeObj = null;
        orientationType = constants.orientation[1];
        if (trellidor.orientationType === constants.orientation[0]) {
            orientationType = constants.orientation[0];
        }
        if (Imgwidth > Imgheight) {
            if (orientationType === constants.orientation[1]) {
                (Imgwidth > 595) ? width = 595 : width = Imgwidth;
                (Imgheight > 842) ? height = 842 : height = Imgheight;
                (height >= 842) ? marginTop = 0 : marginTop = 842 - height;
                (width >= 595) ? marginLeft = 0 : marginLeft = 595 - width;
            } else {
                width = 842;
                height = 595;
                if (!trellidor.isTemplateFileValid) {
                    activeObj = trellidor.canvasImageScaling(canvasWidth, canvasHeight, width, height);
                }
                // var image = imageViewer.fabricCanvas.toDataURL({
                //     format: 'svg',//,
                //     quality: 1,
                //     enableRetinaScaling: true
                //     // multiplier: 4
                // });

                // fabricCanvas = new fabric.Canvas(imageViewer.canvas, imageViewer.canvasOptions);
                // fabric.Image.fromURL(image || imageViewer.canvasImg, function (img) {
                //     img.set({
                //         originX: 'left',
                //         scaleX: canvasWidth / img.width,
                //         scaleY: canvasHeight / img.height,
                //         originY: 'top'
                //     });
                //     img.set(imageViewer.defaultImageProps);
                //     fabricCanvas.sendToBack();
                //     fabricCanvas.sendBackwards(img);
                //     fabricCanvas.centerObject(img);
                //     fabricCanvas.requestRenderAll();


                //     var image = fabricCanvas.toDataURL({
                //         format: 'svg',//,
                //         quality: 1,
                //         enableRetinaScaling: true
                //         // multiplier: 4
                //     });

                //     var obj = {
                //         image: image,
                //         // margin: [marginLeft, marginTop],
                //         // absolutePosition: {
                //         //     x: 0,
                //         //     y: 0
                //         // },
                //         fit: [
                //             width,
                //             height,
                //         ],
                //         // height: height,
                //         // width: width,
                //     };
                //     trellidor._baseDocDefinition.pageSize = 'A4';
                //     trellidor._baseDocDefinition.pageMargins = [marginLeft / 2, marginTop / 2, 0, 0],
                //         trellidor._baseDocDefinition.pageOrientation = orientation;
                //     trellidor._baseDocDefinition.content.stack.push(obj);
                //     navigator.pdfmake.createPdf(trellidor._baseDocDefinition).getBuffer(function (buffer) {
                //         var utf8 = new Uint8Array(buffer);
                //         var binaryArray = utf8.buffer;
                //         trellidor.fileExitsOrNot(dirEntry, binaryArray, fileNameWithType);
                //     });

                // });
                // return;
            }
        } else {
            if (orientationType === constants.orientation[1]) {
                width = 595;
                height = 842;
                activeObj = trellidor.canvasImageScaling(canvasWidth, canvasHeight, width, height);
            } else {
                (Imgheight >= 595) ? height = 595 : height = Imgheight;
                (Imgwidth >= 842) ? width = 842 : width = Imgwidth;
                (height >= 595) ? marginTop = 0 : marginTop = 595 - height;
                // (width >= 842) ? marginLeft = 0 : marginLeft = 0;
            }
        }

        var image = imageViewer.fabricCanvas.toDataURL({
            format: 'svg',//,
            quality: 1,
            enableRetinaScaling: true
            // multiplier: 4
        });

        var obj = {
            image: image,
            // margin: [marginLeft, marginTop],
            // absolutePosition: {
            //     x: 0,
            //     y: 0
            // },
            fit: [
                width,
                height,
            ],
            // height: height,
            // width: width,
        };
        trellidor._baseDocDefinition.pageSize = 'A4';
        trellidor._baseDocDefinition.pageMargins = [marginLeft / 2, marginTop / 2, 0, 0],
            trellidor._baseDocDefinition.pageOrientation = orientationType;
        trellidor._baseDocDefinition.content.stack.push(obj);
        var pdfmakeInstance = navigator.pdfmake;
        pdfmakeInstance.createPdf(trellidor._baseDocDefinition).getBuffer(function (buffer) {
            var utf8 = new Uint8Array(buffer);
            var binaryArray = utf8.buffer;

            //setting the canvas to initial state
            if (activeObj) {
                var items = activeObj._objects;
                activeObj._restoreObjectsState();
                imageViewer.fabricCanvas.remove(activeObj);
                for (var i = 0; i < items.length; i++) {
                    imageViewer.fabricCanvas.add(items[i]);
                }
                imageViewer.fabricCanvas.renderAll();
            }
            var unChangedCanvas = imageViewer.cacheCanvasList[imageViewer.cacheCanvasList.length - 1];
            imageViewer.rerenderCanvas(unChangedCanvas);
            imageViewer.fabricCanvas.requestRenderAll();
            trellidor.fileExitsOrNot(dirEntry, binaryArray, fileNameWithType);
        });
    }
    console.log(JSON.stringify(blob));
}


trellidor.canvasImageScaling = function (canvasWidth, canvasHeight, a4Width, a4Height) {
    var localWidth = a4Width /* canvasWidth < a4Width ? a4Width : canvasWidth; */
    var localHeight = a4Height /* canvasHeight < a4Height ? a4Height : canvasHeight; */
    // localWidth += 150;
    // localHeight += 150;
    var objs = [];
    //get all the objects into an array
    objs = imageViewer.fabricCanvas._objects.filter(function (obj) {
        return obj;
    });

    //clear previous objects
    imageViewer.fabricCanvas._objects.forEach(function (obj) {
        imageViewer.fabricCanvas.remove(obj);
    });

    //group all the objects 
    var alltogetherObj = new fabric.Group(objs, {
    });

    imageViewer.fabricCanvas.add(alltogetherObj);
    alltogetherObj.setCoords();
    imageViewer.fabricCanvas.renderAll();

    imageViewer.fabricCanvas.setActiveObject(alltogetherObj);
    imageViewer.fabricCanvas.renderAll();
    var activeObj = imageViewer.fabricCanvas.getActiveObject();
    imageViewer.fabricCanvas.setWidth(localWidth);
    imageViewer.fabricCanvas.setHeight(localHeight);

    activeObj.set({
        originX: 'left',
        scaleX: localWidth / activeObj.width,
        scaleY: localHeight / activeObj.height,
        originY: 'top'
    });
    imageViewer.fabricCanvas.requestRenderAll();

    return activeObj;
    // var items = activeObj._objects;
    // activeObj._restoreObjectsState();
    // imageViewer.fabricCanvas.remove(activeObj);
    // for (var i = 0; i < items.length; i++) {
    //     imageViewer.fabricCanvas.add(items[i]);
    // }
    // imageViewer.fabricCanvas.renderAll();


    // var localWidth = canvasWidth < widthCmp ? widthCmp : canvasWidth;
    // var localHeight = canvasHeight < heightCmp ? heightCmp : canvasHeight;
    // imageViewer.fabricCanvas.setWidth(localWidth);
    // imageViewer.fabricCanvas.setHeight(localHeight);
    // imageViewer.updateCanvasToCenter(0, 50);
    // imageViewer.img.set({
    //     originX: 'left',
    //     scaleX: localWidth / imageViewer.img.width,
    //     scaleY: localHeight / imageViewer.img.height,
    //     originY: 'top'
    // });
    // imageViewer.setCorners();


}


trellidor.fileExitsOrNot = function (directory, blob, fileName) {
    var orginalName = fileName;
    if (trellidor.pluginInputParamters.filePath || trellidor.pluginInputParamters.selectedFilePath) {
        var path = trellidor.pluginInputParamters.filePath ? (trellidor.pluginInputParamters.filePath.replace(constants.androidNativeUrl, '')) : (trellidor.pluginInputParamters.selectedFilePath.replace(constants.androidNativeUrl, ''));
        fileName = path + '/' + fileName;
    }

    directory.getFile(fileName, { create: false },
        function (fileEntry) {
            trellidor.showOrHideLoader(false);
            if (trellidor.pluginInputParamters.filePath && trellidor.pluginInputParamters.fileName) {
                trellidor.createSetOfElements(constants.backDropTag, trellidor.parentTag);
                trellidor.createSetOfElements(constants.overrideConfirmationTag, trellidor.parentTag);
                var no = trellidor.getElements(constants.overrideEvents[2]);
                var contentTag = trellidor.getElements(constants.overrideEvents[1]);
                var yes = trellidor.getElements(constants.overrideEvents[3]);
                yes.addEventListener('click', function () {
                    trellidor.removeElement('#' + constants.overrideEvents[0]);
                    trellidor.removeElement('#' + constants.backDrop);
                    trellidor.saveFile(directory, blob, orginalName);
                });
                no.addEventListener('click', function () {
                    trellidor.removeElement('#' + constants.overrideEvents[0]);
                    trellidor.removeElement('#' + constants.backDrop);
                    trellidor.enableSavePopupListeners();
                })
            } else if (trellidor.pluginInputParamters.filePath) {
                trellidor.createSetOfElements(constants.backDropTag, trellidor.parentTag);
                trellidor.createSetOfElements(constants.fileAlreadyExitsTag, trellidor.parentTag);
                var ok = trellidor.getElements(constants.fileExitsEvents[2]);
                ok.addEventListener('click', function () {
                    trellidor.removeElement('#' + constants.fileExitsEvents[0]);
                    trellidor.removeElement('#' + constants.backDrop);
                    trellidor.enableSavePopupListeners();
                });
            } else if (trellidor.pluginInputParamters.fileName) {
                trellidor.createSetOfElements(constants.backDropTag, trellidor.parentTag);
                trellidor.createSetOfElements(constants.fileAlreadyExitsTag, trellidor.parentTag);
                var contentTag = trellidor.getElements(constants.fileExitsEvents[1]);
                contentTag.innerHTML = constants.labelHolder.chooseAnotherFile;
                var ok = trellidor.getElements(constants.fileExitsEvents[2]);
                ok.addEventListener('click', function () {
                    trellidor.removeElement('#' + constants.fileExitsEvents[0]);
                    trellidor.removeElement('#' + constants.backDrop);
                    trellidor.accessFileSystem(orginalName);
                });
            } else {
                trellidor.createSetOfElements(constants.backDropTag, trellidor.parentTag);
                trellidor.createSetOfElements(constants.fileAlreadyExitsTag, trellidor.parentTag);
                var contentTag = trellidor.getElements(constants.fileExitsEvents[1]);
                contentTag.innerHTML = constants.labelHolder.emptyFileInputs;
                var ok = trellidor.getElements(constants.fileExitsEvents[2]);
                ok.addEventListener('click', function () {
                    trellidor.removeElement('#' + constants.fileExitsEvents[0]);
                    trellidor.removeElement('#' + constants.backDrop);
                    trellidor.enableSavePopupListeners();
                });
            }

        },
        function (fileEntry) {
            trellidor.saveFile(directory, blob, orginalName);
        });
}


trellidor.saveFile = function (dirEntry, fileData, fileName) {
    trellidor.enableSaveBar.ShowSaveBar = false;
    trellidor.enableSaveBar.unSavedChanges = false;
    if (trellidor.pluginInputParamters.filePath || trellidor.pluginInputParamters.selectedFilePath) {
        var path = trellidor.pluginInputParamters.filePath ? (trellidor.pluginInputParamters.filePath.replace(constants.androidNativeUrl, '')) : (trellidor.pluginInputParamters.selectedFilePath.replace(constants.androidNativeUrl, ''));
        fileName = path + '/' + fileName;
    }

    dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {
        trellidor.writeFile(fileEntry, fileData);
    }, function (err) {
        trellidor.showOrHideLoader(false);
        trellidor.fileStatusMsg(false);
        var fileContent = trellidor.getElements(constants.successMsgTagIds[1]);
        if (fileContent) {
            fileContent.innerHTML = (trellidor.pluginInputParamters.fileName || trellidor.pluginInputParamters.editedFileName) + ' ' + constants.labelHolder.failureMsg;
        }
        console.log(err)
    });
}


trellidor.writeFile = function (fileEntry, dataObj, isAppend) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function () {
            console.log('file success fully saved');
            trellidor.showOrHideLoader(false);
            trellidor.fileStatusMsg(true);
            var fileContent = trellidor.getElements(constants.successMsgTagIds[1]);
            if (fileContent) {
                fileContent.innerHTML = (trellidor.pluginInputParamters.fileName || trellidor.pluginInputParamters.editedFileName) + ' ' + constants.labelHolder.successMsg;
            }
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
            trellidor.showOrHideLoader(false);
            trellidor.fileStatusMsg(false);
            var fileContent = trellidor.getElements(constants.successMsgTagIds[1]);
            if (fileContent) {
                fileContent.innerHTML = (trellidor.pluginInputParamters.fileName || trellidor.pluginInputParamters.editedFileName) + ' ' + constants.labelHolder.failureMsg;
            }
        };
        fileWriter.write(dataObj);
    });
}


trellidor.fileStatusMsg = function (status) {
    var index = status ? 2 : 3;
    trellidor.createSetOfElements(constants.backDropTag, trellidor.parentTag);
    trellidor.createSetOfElements(constants.succesMsgPopUp, trellidor.parentTag);
    var okTag = trellidor.getElements(constants.successMsgTagIds[0]);
    okTag.addEventListener('click', function () {
        trellidor.removeElement('#' + constants.backDrop);
        trellidor.removeElement('#' + constants.successMsgTagIds[0]);
        if (status) {
            var event = new CustomEvent(constants.pluginEvents[0], {
                detail: {
                    type: constants.pluginDestroyTypes[2]
                }
            });
            document.dispatchEvent(event);
        } else {
            trellidor.enableSaveBar.ShowSaveBar = true;
            trellidor.enableSaveBar.unSavedChanges = true;
            trellidor.ShowSaveBarElement();
        }
    });
}




trellidor.b64toBlob = function (b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: 'image/png' });
    return blob;
}


/**
 * @method accessFileSystem
 * Accessing the file system to save file in required location
 */
trellidor.accessFileSystem = function (fileName) {
    window.OurCodeWorld.Filebrowser.folderPicker.single({
        success: function (data) {
            if (!data.length) {
                trellidor.enableSaveBar.ShowSaveBar = true;
                trellidor.enableSaveBar.unSavedChanges = true;
                trellidor.ShowSaveBarElement();
                return;
            }
            trellidor.pluginInputParamters.selectedFilePath = data[0];
            trellidor.generateImage(fileName);
            console.log(data);
        },
        error: function (err) {
            trellidor.enableSaveBar.ShowSaveBar = true;
            trellidor.enableSaveBar.unSavedChanges = true;
            trellidor.ShowSaveBarElement()
            alert('Enable to access file system');
        }
    });
}


/**
* @method enableOrDisableUndoRedo
* Based on canvas response enabling or disabling the undo redo icons
*/
trellidor.enableOrDisableUndoRedo = function (event) {
    var undoRedoTags = trellidor.getElements(constants.undoRedoEventIds)
    undoRedoProperites = imageViewer.enableUndoRedo();
    (undoRedoProperites.undo === true) ? (undoRedoTags[1].src = 'assets/undo_enabled.svg') : (undoRedoTags[1].src = 'assets/undo_disabled.svg');
    (undoRedoProperites.redo === true) ? (undoRedoTags[2].src = 'assets/redo_enabled.svg') : (undoRedoTags[2].src = 'assets/redo_disabled.svg');
    return undoRedoProperites;
}




//global functions
function devicebackBtnEventHandling() {
    trellidor.backBtnConfiramtionPopup();
}


function onKeyboardShow() {
    if (trellidor.selectedNavigation === constants.navigationEventIds[4]) {
        var textOverlay = trellidor.getElements(constants.navigatorChilds[4]);
        var navigationBar = trellidor.getElements('ud_navigation_bar');
        navigationBar.style.display = 'none';
        textOverlay.style.display = 'none';
        console.log('keyboard open');
    }
}


function onKeyboardHide() {
    // Describe your logic which will be run each time keyboard is closed.
    if (trellidor.selectedNavigation === constants.navigationEventIds[4]) {
        var textOverlay = trellidor.getElements(constants.navigatorChilds[4]);
        textOverlay.style.display = 'flex';
        // trellidor.handleCanvasUnSelected();
        imageViewer.fabricCanvas.discardActiveObject();
    }
    var navigationBar = trellidor.getElements('ud_navigation_bar');
    navigationBar.style.display = 'flex';
    console.log('keyboard close');
}

document.addEventListener(constants.pluginEvents[0], function () {
    document.removeEventListener("backbutton", devicebackBtnEventHandling, false);
    window.removeEventListener('keyboardWillShow', onKeyboardShow, false);
    window.removeEventListener('keyboardWillHide', onKeyboardHide, false);
});

module.exports = trellidor;
});
