cordova.define("photoeditor.constants", function(require, exports, module) {
var constants = {
    labelHolder: {
        "brightness": "Brightness",
        "contrast": "Contrast",
        "fillColor": "Fill Color",
        "borderColor": "Border Color",
        "borderDiameter": "Border Width",
        "textColor": "Text Color",
        "textSize": "Text Size",
        "save": "Save",
        "placeHolder": "Name",
        "chooseColor": "Choose Color",
        "cancel": "Cancel",
        "ok": "OK"
    },
    navigationParentEventIds: ['ud_crop_block', 'ud_brightness_block', 'ud_drawShape_block', 'ud_draw_block', 'ud_text_block'],
    navigationEventIds: ['ud_crop', 'ud_brightness', 'ud_drawShape', 'ud_draw', 'ud_text'],
    cropEventIds: ['cropResize', 'rotate'],
    cropChildIconIds: ['cropIcon', 'rotateIcon'],
    brightnessEventIds: ['brightnessRanger', 'contrastRanger'],
    brightnessLanscapeEventIds: ['ud_brightness_ranger', 'ud_contrast_ranger'],
    brightnessPortraitEventIds: ['ud_brightness_ranger', 'ud_contrast_ranger'],
    drawShapeEventIds: ['ud_discard', 'line', 'square', 'circle', 'triangle'],
    drawShapeChildEventIds: ['fill_colorPicker', 'border_colorPicker', 'shape_border_diameter', 'discard', 'confirm'],
    drawShapeColorFiller: ['fill_Color', 'border_Color'],
    drawEventIds: ['colorPicker', 'border_Diameter'],
    drawChildEventIds: ['border_Color', 'border_Diameter'],
    textEventIds: ['text_colorPicker', 'text_ranger', 'text_rotate'],
    textChildEventIds: ['text_color'],
    textTopBlkEventIds: ['fontStyle_block', 'fontFamily_block'],
    textTopChildEventIds: ['fontStyle', 'fontFamily'],
    fontFamily: ['Times New Roman', 'Arial', 'Open Sans', 'Roboto', 'Calibri', 'Comic Sans'],
    fontStyle: [{ label: 'R', value: 'normal' }, { label: '/', value: 'italic' }, { label: 'B', value: 'bold' }],
    confirmDiscard: ['confirm', 'discard'],
    navigatorChilds: ['cropContainer', 'brightnessContainer', 'shapeContainer', 'drawContainer', 'textContainer'],
    rangeSliders: ['ud_shape_slider', 'ud_draw_slider', 'ud_text_slider'],
    undoRedoEventIds: ['back', 'undo', 'redo', 'save'],
    undoRedo: 'undoRedo',
    savePopupEventIds: ['cancel', 'ok', 'nameToSave'],
    savePopupChildEventIds: ['backDrop', 'savePopup'],
    colorPickerContainer: 'ud-color-picker-container',
    colorPickerCloseBtnId: 'ud_close_color_picker',
    colorPickerIds: ['ud_colorPicker_popUp', 'backDrop'],
    transparentIconSrc: 'url("assets/transparentIcon.svg")',
    RtlLanguage: ['ud_text_align_reverse'],
    LtrLanguage: 'ud-flex-direction-forward',
    backDrop: 'backDrop',
    okCancel: ['ok', 'cancel'],
    transparent: 'transparent',
    url: 'url',
    fileTypes: ['pdf', 'png'],
    orientation: ['landscape', 'portrait'],
    hebrew: 'he',
    androidNativeUrl: 'file:///storage/emulated/0/',
    multilanguage: ['en', 'he'],
    validateTokenUrl: 'http://192.168.1.122:63376/AppHistory/ValidateToken',
    colorPickerLabel: 'ud_color_picker_label',
    rangeSliderWrappers: ['ud_brightness_wrapper', 'ud_contrast_wrapper', 'ud_common_wrapper'],
    sliderBgColor: ['#114792', '#90A9CC'],
    controlColor: 'rgb(0, 51, 153)',
    transparentWrapper: 'ud-transparent-layer',
    successMsgTagIds: ['ud_successTag', 'ud_file_name', 'ud_success_msg_ok'],
    pluginEvents: ['destroyplugin'],
    fileExitsEvents: ['ud_file_wrapper', 'ud_file_content', 'ud_file_ok'],
    overrideEvents: ['ud_override_popup', 'ud_override_content', 'ud_override_no', 'ud_override_yes'],
    fileExitsLabel: 'Image with same name already exists, please save with different name',
    chooseAnotherFile: 'Image with same name Already exits please choose another directory',
    emptyFileInputs: 'Image name Already exits please choose another name or directory',
    overrideFile: 'Image name Already exits do you want to override the image',
    successMsg: 'saved successfully',
    failureMsg: 'failed to save',
    undoRedoLimitEvents: ['ud_undo_limit_popup', 'ud_undo_limit_ok'],
    pluginDestroyTypes: ['camerCancelled', 'back', 'fileSaved', 'fileFailed', 'deviceBackButton', 'deniedPermissions'],
    discardNotification: 'Do you really want to discard the changes',
    discardNotifyEvents: ['ud_discard_wrapper', 'ud_discard_ok', 'ud_discard_cancel', 'ud_discard_label'],
    backBtnEventIds: ['ud_back_button_Wrapper', 'ud_back_btn'],
    backBtnconfirmationEventIds: ['ud_back_btn_wrapper', 'ud_back_btn_label', 'ud_back_btn_yes', 'ud_back_btn_no'],
    landScapeOrPortraitEvents: ['ud_landscape_portrait_wrapper', 'ud_land_port_label', 'ud_land_port_landscape', 'ud_land_port_portrait', 'ud_portrait', 'ud_landscape'],
    orientationType: null,
    whiteColorRgb: ["rgba(255, 255, 255)", "rgb(255, 255, 255)"],
    textTopOverlay: ['ud_font_family_overlay', 'ud_family_icon'],
    fontEventIds: ['ud_timesNewRoman', 'ud_arial', 'ud_opensans', 'ud_roboto', 'ud_calibri', 'ud_comicsans'],
    colorPickerColors: [
        { colorCode: '#CC0000', colorName: 'ud_thick_red' },
        { colorCode: '#FF3300', colorName: 'ud_light_red' },
        { colorCode: '#FF6600', colorName: 'ud_orange' },
        { colorCode: '#FF9900', colorName: 'ud_light_yellow' },
        { colorCode: '#FFFF00', colorName: 'ud_thick_yellow' },
        { colorCode: '#00CC00', colorName: 'ud_light_green' },
        { colorCode: '#006600', colorName: 'ud_thick_green' },
        { colorCode: '#009999', colorName: 'ud_deep_blue' },
        { colorCode: '#003399', colorName: 'ud_blue' },
        { colorCode: '#6600CC', colorName: 'ud_voilet' },
        { colorCode: '#663399', colorName: 'ud_dark_voilet' },
        { colorCode: '#9933CC', colorName: 'ud_light_voilet' },
        { colorCode: '#FFFFFF', colorName: 'ud_white' },
        { colorCode: '#000000', colorName: 'ud_black' },
        { colorCode: 'transparent', colorName: 'ud_transparent' },
    ],
    brightness: {
        step: 0.003921,
        min: -1,
        max: 1,
        value: 0
    },
    contrast: {
        step: 0.003921,
        min: -1,
        max: 1,
        value: 0
    },
    drawShapeProperties: {
        step: 1,
        min: 1,
        max: 20,
        value: 10,
        borderColor: 'rgba(204, 0, 0, 1)',
        fillColor: 'url("assets/transparentIcon.svg")',
        lineColor: '#CC0000'
    },
    drawProperties: {
        step: 1,
        min: 1,
        max: 50,
        value: 1,
        color: '#CC0000',
        width: 1,
    },
    textProperties: {
        step: 1,
        min: 1,
        max: 100,
        value: 50,
        textColor: '#CC0000',
        textLabel: 'Insert Text',
    },
    bottomToolbarHeight: 70,
    loadingMaskId: 'ud-loading-mask',
    loaderTag: [
        { tagName: 'div', className: ['ud-loader-backdrop'], selectionType: 'ud-loading-mask' },
        [
            { tagName: 'div', className: ['ud-loader'] }
        ],
    ],
    backDropTag: [
        { tagName: 'div', className: ['ud-back-drop'], selectionType: 'backDrop' },
    ],

};


/* 
* tags information. 
*/
constants.potraitTags = function () {

    this.navigationImageSources = [
        { tagName: 'div', className: ['ud-navigation-icon-container'], selectionType: constants.navigationParentEventIds[0] },
        [
            { tagName: 'img', src: 'assets/crop_disabled.svg', className: ['ud-navigation-bar-icon'], selectionType: 'ud_crop' },
        ],
        { tagName: 'div', className: ['ud-navigation-icon-container'], selectionType: constants.navigationParentEventIds[1] },
        [
            { tagName: 'img', src: 'assets/brightness_disabled.svg', className: ['ud-navigation-bar-icon'], selectionType: 'ud_brightness' },
        ],
        { tagName: 'div', className: ['ud-navigation-icon-container'], selectionType: constants.navigationParentEventIds[2] },
        [
            { tagName: 'img', src: 'assets/drawShape_disabled.svg', className: ['ud-navigation-bar-icon'], selectionType: 'ud_drawShape' },
        ],
        { tagName: 'div', className: ['ud-navigation-icon-container'], selectionType: constants.navigationParentEventIds[3] },
        [
            { tagName: 'img', src: 'assets/draw_disabled.svg', className: ['ud-navigation-bar-icon'], selectionType: 'ud_draw' },
        ],
        { tagName: 'div', className: ['ud-navigation-icon-container'], selectionType: constants.navigationParentEventIds[4] },
        [
            { tagName: 'img', src: 'assets/text_disabled.svg', className: ['ud-navigation-bar-icon'], selectionType: 'ud_text' }
        ],
    ];

    this.rootContainerChilds = [
        // { tagName: 'body', className: '' },
        // [
        // { tagName: 'div', className: ['ud-main-container'], selectionType: 'ud_main_container' },
        // [
        // { tagName: 'div', className: ['ud-edit-image-container'], selectionType: 'ud_imageContainer' },
        // [
        { tagName: 'canvas', className: ['ud-canvas-cls', 'ud-canvas-container'], selectionType: 'ud-canvas' },
        // ],
        // { tagName: 'div', className: ['ud-bottom-navigation'], selectionType: 'ud_navigation_bar' },
        // this.navigationImageSources
        // ],
        // ]
    ];

    this.navigationBar = [
        { tagName: 'div', className: ['ud-bottom-navigation', 'ud-discard-apply-heigth'], selectionType: 'ud_navigation_bar' },
        this.navigationImageSources,
    ];

    this.applyOrDiscard = [
        { tagName: 'div', className: ['ud-discard-apply-icon'], selectionType: 'discard' },
        [
            { tagName: 'img', src: 'assets/discard.svg', className: ['ud-discard-icon-size'], selectionType: '' },
        ],
        { tagName: 'div', className: ['ud-discard-apply-icon'], selectionType: 'confirm' },
        [
            { tagName: 'img', src: 'assets/confirm.svg', className: ['ud-icon-size'], selectionType: '' }
        ]
    ];

    this.cropChildTags = [
        { tagName: 'div', className: ['ud-crop-childs-container', 'ud-discard-apply-heigth'], selectionType: constants.navigatorChilds[0] },
        [
            this.applyOrDiscard[0],
            this.applyOrDiscard[1],
            { tagName: 'div', className: ['ud-items-center-wrapper'] },
            [
                { tagName: 'div', className: ['ud-crop-rotate-block'], selectionType: constants.cropEventIds[0] },
                [
                    { tagName: 'img', src: 'assets/cropIcon_disabled.png', className: ['ud-icon-size', 'ud-crop-rotate-icon'], selectionType: constants.cropChildIconIds[0] },
                ],
                { tagName: 'div', className: ['ud-crop-rotate-block', 'ud-rotate-font'], selectionType: constants.cropEventIds[1] },
                [
                    { tagName: 'img', src: 'assets/rotate_enabled.png', className: ['ud-icon-size', 'ud-rotate-icon'], selectionType: constants.cropChildIconIds[1] },
                ],
            ],
            this.applyOrDiscard[2],
            this.applyOrDiscard[3],
        ],
    ];

    this.brightnessChildTags = [
        { tagName: 'div', className: ['ud-brightness-childs-container', 'ud-all-navigation-items-alignment', 'ud-discard-apply-heigth'], selectionType: constants.navigatorChilds[1] },
        [
            this.applyOrDiscard[0],
            this.applyOrDiscard[1],
            { tagName: 'div', className: ['ud-items-center-wrapper'] },
            [
                { tagName: 'div', className: ['ud-range-position'] },
                [
                    { tagName: 'img', src: 'assets/ud_brightness_ranger_disabled.svg', className: ['ud-wrapper-padding', 'ud-nav-icon-size'], selectionType: constants.brightnessPortraitEventIds[0] },
                    { tagName: 'div', className: ['ud-landscape-wrapper'], selectionType: constants.rangeSliderWrappers[0] },
                    [
                        { tagName: 'input', type: 'range', value: constants.brightness.value, step: constants.brightness.step, min: constants.brightness.min, max: constants.brightness.max, className: ['ud-landscape-input', 'ud-range-slider-input'], selectionType: constants.brightnessEventIds[0] },
                    ],
                ],
                { tagName: 'div', className: ['ud-range-position'] },
                [
                    { tagName: 'img', src: 'assets/ud_contrast_ranger_disabled.svg', className: ['ud-wrapper-padding', 'ud-nav-icon-size'], selectionType: constants.brightnessPortraitEventIds[1] },
                    { tagName: 'div', className: ['ud-landscape-wrapper'], selectionType: constants.rangeSliderWrappers[1] },
                    [
                        { tagName: 'input', type: 'range', step: constants.contrast.step, value: constants.contrast.value, min: constants.contrast.min, max: constants.contrast.max, className: ['ud-landscape-input', 'ud-range-slider-input'], selectionType: constants.brightnessEventIds[1] },
                    ],
                ],
            ],
            this.applyOrDiscard[2],
            this.applyOrDiscard[3],
        ]
    ];

    this.drawShapeChildTags = [
        { tagName: 'div', className: ['ud-draw-childs-container', 'ud-draw-shape-child-overlay', 'ud-discard-apply-heigth'], selectionType: constants.navigatorChilds[2] },
        [
            { tagName: 'div', className: ['ud-draw-shape-icon-block'], selectionType: this.drawShapeEventIds[0] },
            [
                { tagName: 'img', src: 'assets/discard.svg', className: ['ud-discard-icon-size'], selectionType: '' },
            ],
            { tagName: 'div', className: ['ud-draw-shape-icon-block'], selectionType: 'line' },
            [
                { tagName: 'img', src: 'assets/line_disabled.svg', className: ['ud-draw-shape-icon', 'ud-line-icon-size'], selectionType: '' },
            ],
            { tagName: 'div', className: ['ud-draw-shape-icon-block'], selectionType: 'square' },
            [
                { tagName: 'img', src: 'assets/square_disabled.svg', className: ['ud-draw-shape-icon'], selectionType: '' },
            ],
            { tagName: 'div', className: ['ud-draw-shape-icon-block'], selectionType: 'circle' },
            [
                { tagName: 'img', src: 'assets/circle_disabled.svg', className: ['ud-draw-shape-icon'], selectionType: '' },
            ],
            { tagName: 'div', className: ['ud-draw-shape-icon-block'], selectionType: 'triangle' },
            [
                { tagName: 'img', src: 'assets/triangle_disabled.svg', className: ['ud-draw-shape-icon', 'ud-triangle-icon-size'], selectionType: '' },
            ]
        ],
    ];

    this.drawShapeInnerChildTags = [
        { tagName: 'div', className: ['ud-brightness-childs-container', 'ud-all-navigation-items-alignment', 'ud-discard-apply-heigth'], selectionType: 'shape-innerchilds' },
        [
            this.applyOrDiscard[0],
            this.applyOrDiscard[1],
            { tagName: 'div', className: ['ud-range-position'] },
            [
                { tagName: 'img', src: 'assets/line_disabled.svg', className: ['ud-wrapper-padding', 'ud-nav-icon-size', 'ud-line-icon-size'], selectionType: constants.drawShapeChildEventIds[2] },
                { tagName: 'div', className: ['ud-landscape-wrapper'], selectionType: constants.rangeSliderWrappers[2] },
                [
                    { tagName: 'input', type: 'range', value: constants.drawShapeProperties.value, step: constants.drawShapeProperties.step, min: constants.drawShapeProperties.min, max: constants.drawShapeProperties.max, className: ['ud-landscape-input', 'ud-range-slider-input'], selectionType: constants.rangeSliders[0] },
                ],
            ],
            { tagName: 'div', className: ['ud'], selectionType: 'fillColorContainer' },
            [
                { tagName: 'div', className: ['ud-wrapper-padding'], selectionType: constants.drawShapeChildEventIds[0] },
                [
                    { tagName: 'div', className: ['ud-applied-color'], label: 'F', background: constants.drawShapeProperties.fillColor, selectionType: constants.drawShapeColorFiller[0] },
                ],
            ],
            { tagName: 'div', className: ['ud-wrapper-padding'], selectionType: constants.drawShapeChildEventIds[1] },
            [
                { tagName: 'div', className: ['ud-applied-color'], label: 'B', background: constants.drawShapeProperties.borderColor, selectionType: constants.drawShapeColorFiller[1] },
            ],
            this.applyOrDiscard[2],
            this.applyOrDiscard[3],
        ]
    ];

    this.drawChildTags = [
        { tagName: 'div', className: ['ud-brightness-childs-container', 'ud-all-navigation-items-alignment', 'ud-discard-apply-heigth'], selectionType: constants.navigatorChilds[3] },
        [
            this.applyOrDiscard[0],
            this.applyOrDiscard[1],
            { tagName: 'div', className: ['ud-items-center-wrapper'] },
            [
                { tagName: 'div', className: ['ud-range-position'] },
                [
                    { tagName: 'img', src: 'assets/line_disabled.svg', className: ['ud-wrapper-padding', 'ud-nav-icon-size', 'ud-line-icon-size'], selectionType: constants.drawEventIds[1] },
                    { tagName: 'div', className: ['ud-landscape-wrapper'], selectionType: constants.rangeSliderWrappers[2] },
                    [
                        { tagName: 'div', className: ['ud-draw-transparent-wrapper'] },
                        { tagName: 'input', type: 'range', value: constants.drawProperties.value, min: constants.drawProperties.min, max: constants.drawProperties.max, step: constants.drawProperties.step, className: ['ud-landscape-input', 'ud-range-slider-input'], selectionType: constants.rangeSliders[1] },
                    ],
                ],
                { tagName: 'div', className: ['ud-wrapper-padding'], selectionType: constants.drawEventIds[0] },
                [
                    { tagName: 'div', className: ['ud-applied-color'], label: 'B', background: constants.drawProperties.color, selectionType: constants.drawChildEventIds[0] },
                ],
            ],
            this.applyOrDiscard[2],
            this.applyOrDiscard[3],
        ],

    ];

    this.textChildTags = [
        { tagName: 'div', className: ['ud-brightness-childs-container', 'ud-all-navigation-items-alignment', 'ud-discard-apply-heigth'], selectionType: constants.navigatorChilds[4] },
        [
            this.applyOrDiscard[0],
            this.applyOrDiscard[1],
            { tagName: 'div', className: ['ud-range-position'] },
            [
                { tagName: 'img', src: 'assets/textIcon_disabled.svg', className: ['ud-wrapper-padding', 'ud-nav-icon-size', 'ud-line-icon-size'], selectionType: constants.textEventIds[1] },
                { tagName: 'div', className: ['ud-landscape-wrapper'], selectionType: constants.rangeSliderWrappers[2] },
                [
                    { tagName: 'input', type: 'range', value: constants.textProperties.value, min: constants.textProperties.min, max: constants.textProperties.max, step: constants.textProperties.step, className: ['ud-landscape-input', 'ud-range-slider-input'], selectionType: constants.rangeSliders[2] },
                ],
            ],
            { tagName: 'div', className: ['ud-wrapper-padding'], selectionType: constants.textEventIds[0] },
            [
                { tagName: 'div', className: ['ud-applied-color'], label: 'C', background: constants.textProperties.textColor, selectionType: constants.textChildEventIds[0] },
            ],
            { tagName: 'div', className: ['ud-rotate-icon-block'], selectionType: constants.textEventIds[2] },
            [
                { tagName: 'img', src: 'assets/rotate_enabled.png', className: ['ud-icon-size', 'ud-crop-rotate-icon', 'ud-rotate-icon'], selectionType: '' },
            ],
            this.applyOrDiscard[2],
            this.applyOrDiscard[3],
        ],
    ];

    this.redoUndoWithSave = [
        { tagName: 'div', className: ['ud-undo-redo-save'], selectionType: constants.undoRedo },
        [
            { tagName: 'img', src: 'assets/back.png', className: ['ud-icon-size', 'ud-back'], selectionType: 'back' },
            { tagName: 'div', className: ['ud-undo-redo'], selectionType: '' },
            [
                { tagName: 'img', src: 'assets/undo_disabled.svg', className: ['ud-undo-redo-icons'], selectionType: 'undo' },
                { tagName: 'img', src: 'assets/redo_disabled.svg', className: ['ud-undo-redo-icons'], selectionType: 'redo' }
            ],
            { tagName: 'div', className: ['ud-save-icon-block'], selectionType: 'save' },
            [
                { tagName: 'img', src: 'assets/save.png', className: ['ud-icon-size'], selectionType: '' }
            ],
        ]
    ];

    this.backDropTag = [
        { tagName: 'div', className: ['ud-back-drop'], selectionType: constants.backDrop },
    ];

    this.succesMsgPopUp = [
        { tagName: 'div', className: ['ud-save-popup-container'], selectionType: constants.successMsgTagIds[0] },
        [
            { tagName: 'div', className: ['ud-file-confirmation'] },
            [
                { tagName: 'div', className: ['ud-file-confirmation-header'], label: constants.labelHolder.confirmation },
                { tagName: 'div', className: ['ud-file-content-wrapper'] },
                [
                    { tagName: 'div', className: ['ud-file-content', constants.labelHolder.className], selectionType: constants.successMsgTagIds[1] },
                ],
                { tagName: 'div', className: ['ud-file-ok'] },
                [
                    { tagName: 'input', className: ['ud-success-cancel'], type: 'button', value: constants.labelHolder.ok, selectionType: constants.successMsgTagIds[2] },
                ]
            ],
        ]
    ];

    this.undoRedoLimitTag = [
        { tagName: 'div', className: ['ud-save-popup-container'], selectionType: constants.undoRedoLimitEvents[0] },
        [
            { tagName: 'div', className: ['ud-save-popup'] },
            [
                { tagName: 'div', className: ['ud-file-content-wrapper'] },
                [
                    { tagName: 'div', className: ['ud-file-content', constants.labelHolder.className], label: constants.labelHolder.undoLimit, selectionType: '' },
                ],
                { tagName: 'div', className: ['ud-file-ok'] },
                [
                    { tagName: 'input', className: ['ud-success-cancel'], type: 'button', value: constants.labelHolder.ok, selectionType: constants.undoRedoLimitEvents[1] },
                ],
            ],
        ],
    ];

    this.fileAlreadyExitsTag = [
        { tagName: 'div', className: ['ud-save-popup-container'], selectionType: constants.fileExitsEvents[0] },
        [
            { tagName: 'div', className: ['ud-save-popup'] },
            [
                { tagName: 'div', className: ['ud-file-content-wrapper'] },
                [
                    { tagName: 'div', className: ['ud-file-content', constants.labelHolder.className], label: constants.labelHolder.fileExitsLabel, selectionType: constants.fileExitsEvents[1] },
                ],
                { tagName: 'div', className: ['ud-file-ok'] },
                [
                    { tagName: 'input', className: ['ud-success-cancel'], type: 'button', value: constants.labelHolder.ok, selectionType: constants.fileExitsEvents[2] },
                ],
            ],
        ],
    ];

    this.discardConfirmationTag = [
        { tagName: 'div', className: ['ud-save-popup-container'], selectionType: constants.discardNotifyEvents[0] },
        [
            { tagName: 'div', className: ['ud-save-popup'] },
            [
                { tagName: 'div', className: ['ud-discard-content-wrapper', constants.labelHolder.className], label: constants.labelHolder.discardNotification, selectionType: constants.discardNotifyEvents[3] },
                { tagName: 'div', className: ['ud-cancel-ok', 'ud-discard-alert'] },
                [
                    { tagName: 'input', className: ['ud-cancel-button'], type: 'button', value: constants.labelHolder.no, selectionType: constants.discardNotifyEvents[2] },
                    { tagName: 'input', className: ['ud-ok-button'], type: 'button', value: constants.labelHolder.yes, selectionType: constants.discardNotifyEvents[1] },
                ],
            ],
        ],
    ];


    this.overrideConfirmationTag = [
        { tagName: 'div', className: ['ud-save-popup-container'], selectionType: constants.overrideEvents[0] },
        [
            { tagName: 'div', className: ['ud-save-popup'] },
            [
                { tagName: 'div', className: ['ud-discard-content-wrapper', constants.labelHolder.className], label: constants.labelHolder.overrideFile },
                { tagName: 'div', className: ['ud-cancel-ok', 'ud-discard-alert'] },
                [
                    { tagName: 'input', className: ['ud-cancel-button'], type: 'button', value: constants.labelHolder.no, selectionType: constants.overrideEvents[2] },
                    { tagName: 'input', className: ['ud-ok-button'], type: 'button', value: constants.labelHolder.yes, selectionType: constants.overrideEvents[3] },
                ],
            ],
        ],
    ];


    this.savePopup = [
        { tagName: 'div', className: ['ud-save-popup-container'], selectionType: constants.savePopupChildEventIds[1] },
        [
            { tagName: 'div', className: ['ud-save-popup'] },
            [
                { tagName: 'div', className: ['ud-popup-header'], label: constants.labelHolder.save },
                { tagName: 'div', className: ['ud-save-input-container'] },
                [
                    { tagName: 'input', className: ['ud-save-input', constants.labelHolder.className], type: 'text', value: '', placeholder: constants.labelHolder.placeHolder, selectionType: constants.savePopupEventIds[2] },
                ],
                { tagName: 'div', className: ['ud-cancel-ok'] },
                [
                    { tagName: 'input', className: ['ud-cancel-button'], type: 'button', value: constants.labelHolder.cancel, selectionType: constants.savePopupEventIds[0] },
                    { tagName: 'input', className: ['ud-ok-button', 'ud-ok-enable-disable'], disabled: true, type: 'submit', value: constants.labelHolder.ok, selectionType: constants.savePopupEventIds[1] },
                ]
            ],
        ]
    ];

    this.textInnerChildTags = [
        { tagName: 'div', className: ['ud-font-style-family'], selectionType: 'textTopBar' },
        [
            { tagName: 'div', className: ['ud-font-style-block'], selectionType: constants.textTopBlkEventIds[0] },
            [
                { tagName: 'div', className: ['ud-text-font-type', 'ud-text-font'], label: constants.fontStyle[0].label, selectionType: constants.textTopChildEventIds[0] },
            ],
            { tagName: 'div', className: ['ud-font-family-block'], selectionType: constants.textTopBlkEventIds[1] },
            [
                { tagName: 'div', className: ['ud-text-font-family', 'ud-text-font'], label: constants.fontFamily[0], selectionType: constants.textTopChildEventIds[1] },
            ],
            { tagName: 'div', className: ['ud-delete-icon-block'], selectionType: 'delete' },
            [
                { tagName: 'img', src: 'assets/delete.svg', className: ['ud-delete-icon'], label: constants.fontStyle[0], selectionType: '' },
            ],
        ]
    ];


    this.deleteIconTag = [
        { tagName: 'div', className: ['ud-delete-icon-container'], selectionType: 'deleteContainer' },
        [
            { tagName: 'img', src: 'assets/back.png', className: ['ud-icon-size', 'ud-back'], selectionType: constants.backBtnEventIds[1] },
            { tagName: 'div', className: ['ud-delete-icon-block'], selectionType: 'delete' },
            [
                { tagName: 'img', src: 'assets/delete.svg', className: ['ud-delete-icon'], selectionType: '' },
            ],
        ]
    ];



    this.backButtonTag = [
        { tagName: 'div', className: ['ud-back-only-button'], selectionType: constants.backBtnEventIds[0] },
        [
            { tagName: 'img', src: 'assets/back.png', className: ['ud-icon-size', 'ud-back'], selectionType: constants.backBtnEventIds[1] },
        ]
    ];

    this.backBtnConfirmationTag = [
        { tagName: 'div', className: ['ud-save-popup-container'], selectionType: constants.backBtnconfirmationEventIds[0] },
        [
            { tagName: 'div', className: ['ud-save-popup'] },
            [
                { tagName: 'div', className: ['ud-discard-content-wrapper', constants.labelHolder.className], label: constants.labelHolder.closeApplication, selectionType: constants.backBtnconfirmationEventIds[1] },
                { tagName: 'div', className: ['ud-cancel-ok', 'ud-discard-alert'] },
                [
                    { tagName: 'input', className: ['ud-cancel-button'], type: 'button', value: constants.labelHolder.no, selectionType: constants.backBtnconfirmationEventIds[3] },
                    { tagName: 'input', className: ['ud-ok-button'], type: 'button', value: constants.labelHolder.yes, selectionType: constants.backBtnconfirmationEventIds[2] },
                ],
            ],
        ],
    ];


    this.colorPickerColorTags = [];
    this.colorPickerColors.forEach(function (color, index) {
        if (color.colorCode === constants.transparent) {
            constants.colorPickerColorTags.push({ tagName: 'div', className: ['ud-color-background-transparent', 'ud-color-picker-color'], background: constants.transparentIconSrc, selectionType: color.colorName });
            return
        }
        constants.colorPickerColorTags.push({ tagName: 'div', className: ['ud-color-picker-color'], background: color.colorCode, selectionType: color.colorName });

    });

    this.colorPickerPopupTag = [
        { tagName: 'div', className: [constants.colorPickerContainer], selectionType: 'ud_colorPicker_popUp' },
        [
            { tagName: 'div', className: ['ud-color-picker-popUp'] },
            [
                { tagName: 'div', className: ['ud-color-picker-header'] },
                [
                    { tagName: 'div', className: ['ud-color-header-label'], label: constants.labelHolder.chooseColor, selectionType: constants.colorPickerLabel },
                    { tagName: 'img', className: ['ud-color-picker-close'], src: 'assets/discard.svg', selectionType: constants.colorPickerCloseBtnId }
                ],
                { tagName: 'div', className: ['ud-color-holder'] },
                this.colorPickerColorTags,
            ],
        ],
    ];
}


constants.landScapeTags = function () {
    this.navigationImageSources = [
        { tagName: 'div', className: ['ud-landscape-navigation-icon-container'], selectionType: constants.navigationParentEventIds[0] },
        [
            { tagName: 'img', src: 'assets/crop_disabled.svg', className: ['ud-landscape-navigation-bar-icon'], selectionType: 'ud_crop' },
        ],
        { tagName: 'div', className: ['ud-landscape-navigation-icon-container'], selectionType: constants.navigationParentEventIds[1] },
        [
            { tagName: 'img', src: 'assets/brightness_disabled.svg', className: ['ud-landscape-navigation-bar-icon'], selectionType: 'ud_brightness' },
        ],
        { tagName: 'div', className: ['ud-landscape-navigation-icon-container'], selectionType: constants.navigationParentEventIds[2] },
        [
            { tagName: 'img', src: 'assets/drawShape_disabled.svg', className: ['ud-landscape-navigation-bar-icon'], selectionType: 'ud_drawShape' },
        ],
        { tagName: 'div', className: ['ud-landscape-navigation-icon-container'], selectionType: constants.navigationParentEventIds[3] },
        [
            { tagName: 'img', src: 'assets/draw_disabled.svg', className: ['ud-landscape-navigation-bar-icon'], selectionType: 'ud_draw' },
        ],
        { tagName: 'div', className: ['ud-landscape-navigation-icon-container'], selectionType: constants.navigationParentEventIds[4] },
        [
            { tagName: 'img', src: 'assets/text_disabled.svg', className: ['ud-landscape-navigation-bar-icon'], selectionType: 'ud_text' }
        ],
    ];

    this.rootContainerChilds = [
        // { tagName: 'body', className: '' },
        // [
        { tagName: 'canvas', className: ['ud-canvas-cls', 'ud-landscape-canvas-container'], selectionType: 'ud-canvas' },
        // { tagName: 'div', className: ['ud-landscape-bottom-navigation'], selectionType: 'ud_navigation_bar' },
        // this.navigationImageSources,
        // ],
    ];

    this.navigationBar = [
        { tagName: 'div', className: ['ud-landscape-bottom-navigation'], selectionType: 'ud_navigation_bar' },
        this.navigationImageSources,
    ]

    this.applyOrDiscard = [
        { tagName: 'div', className: ['ud-discard-apply-icon'], selectionType: 'discard' },
        [
            { tagName: 'img', src: 'assets/discard.svg', className: ['ud-discard-icon-size'], selectionType: '' },
        ],
        { tagName: 'div', className: ['ud-discard-apply-icon'], selectionType: 'confirm' },
        [
            { tagName: 'img', src: 'assets/confirm.svg', className: ['ud-icon-size'], selectionType: '' }
        ]
    ];



    this.cropChildTags = [
        { tagName: 'div', className: ['ud-landscape-crop-childs-container', 'ud-landscape-common-width'], selectionType: constants.navigatorChilds[0] },
        [
            this.applyOrDiscard[0],
            this.applyOrDiscard[1],
            { tagName: 'div', className: ['ud-landscape-items-center-wrapper'] },
            [
                { tagName: 'div', className: ['ud-crop-rotate-block'], selectionType: constants.cropEventIds[0] },
                [
                    { tagName: 'img', src: 'assets/cropIcon_disabled.png', className: ['ud-icon-size', 'ud-crop-rotate-icon'], selectionType: constants.cropChildIconIds[0] },
                ],
                { tagName: 'div', className: ['ud-crop-rotate-block', 'ud-rotate-font'], selectionType: constants.cropEventIds[1] },
                [
                    { tagName: 'img', src: 'assets/rotate_enabled.png', className: ['ud-icon-size', 'ud-rotate-icon'], selectionType: constants.cropChildIconIds[1] },
                ],
            ],
            this.applyOrDiscard[2],
            this.applyOrDiscard[3],
        ],
    ];


    this.brightnessChildTags = [
        { tagName: 'div', className: ['ud-landscape-draw-childs-container', 'ud-landscape-common-width'], selectionType: constants.navigatorChilds[1] },
        [
            this.applyOrDiscard[0],
            this.applyOrDiscard[1],
            { tagName: 'div', className: ['ud-landscape-items-center-wrapper'] },
            [
                { tagName: 'div', className: ['ud-range-position'] },
                [
                    { tagName: 'img', src: 'assets/ud_brightness_ranger_disabled.svg', className: ['ud-wrapper-padding', 'ud-nav-icon-size'], selectionType: constants.brightnessPortraitEventIds[0] },
                    { tagName: 'div', className: ['ud-input-wrapper'], selectionType: constants.rangeSliderWrappers[0] },
                    [
                        { tagName: 'input', type: 'range', value: constants.brightness.value, step: constants.brightness.step, min: constants.brightness.min, max: constants.brightness.max, className: ['ud-navigation-input', 'ud-range-slider-input'], selectionType: constants.brightnessEventIds[0] },
                    ],
                ],
                { tagName: 'div', className: ['ud-range-position'] },
                [
                    { tagName: 'img', src: 'assets/ud_contrast_ranger_disabled.svg', className: ['ud-wrapper-padding', 'ud-nav-icon-size'], selectionType: constants.brightnessPortraitEventIds[1] },
                    { tagName: 'div', className: ['ud-input-wrapper'], selectionType: constants.rangeSliderWrappers[1] },
                    [
                        { tagName: 'input', type: 'range', step: constants.contrast.step, value: constants.contrast.value, min: constants.contrast.min, max: constants.contrast.max, className: ['ud-navigation-input', 'ud-range-slider-input'], selectionType: constants.brightnessEventIds[1] },
                    ],
                ],
            ],
            this.applyOrDiscard[2],
            this.applyOrDiscard[3],
        ]
    ];


    this.drawShapeChildTags = [
        { tagName: 'div', className: ['ud-landscape-draw-childs-container', 'ud-landscape-common-width'], selectionType: constants.navigatorChilds[2] },
        [
            { tagName: 'div', className: ['ud-draw-shape-icon-block'], selectionType: this.drawShapeEventIds[0] },
            [
                { tagName: 'img', src: 'assets/discard.svg', className: ['ud-discard-icon-size'], selectionType: '' },
            ],
            { tagName: 'div', className: ['ud-draw-shape-icon-block'], selectionType: 'line' },
            [
                { tagName: 'img', src: 'assets/line_disabled.svg', className: ['ud-draw-shape-icon', 'ud-line-icon-size'], selectionType: '' },
            ],
            { tagName: 'div', className: ['ud-draw-shape-icon-block'], selectionType: 'square' },
            [
                { tagName: 'img', src: 'assets/square_disabled.svg', className: ['ud-draw-shape-icon'], selectionType: '' },
            ],
            { tagName: 'div', className: ['ud-draw-shape-icon-block'], selectionType: 'circle' },
            [
                { tagName: 'img', src: 'assets/circle_disabled.svg', className: ['ud-draw-shape-icon'], selectionType: '' },
            ],
            { tagName: 'div', className: ['ud-draw-shape-icon-block'], selectionType: 'triangle' },
            [
                { tagName: 'img', src: 'assets/triangle_disabled.svg', className: ['ud-draw-shape-icon', 'ud-triangle-icon-size'], selectionType: '' },
            ]
        ],
    ];

    this.drawShapeInnerChildTags = [
        { tagName: 'div', className: ['ud-landscape-brightness-childs-container', 'ud-landscape-common-width'], selectionType: 'shape-innerchilds' },
        [
            this.applyOrDiscard[0],
            this.applyOrDiscard[1],
            { tagName: 'div', className: ['ud-range-position'] },
            [
                { tagName: 'img', src: 'assets/line_disabled.svg', className: ['ud-wrapper-padding', 'ud-nav-icon-size', 'ud-line-icon-size'], selectionType: constants.drawShapeChildEventIds[2] },
                { tagName: 'div', className: ['ud-input-wrapper'], selectionType: constants.rangeSliderWrappers[2] },
                [
                    { tagName: 'input', type: 'range', value: constants.drawShapeProperties.value, step: constants.drawShapeProperties.step, min: constants.drawShapeProperties.min, max: constants.drawShapeProperties.max, className: ['ud-navigation-input', 'ud-range-slider-input'], selectionType: constants.rangeSliders[0] },
                ],
            ],
            { tagName: 'div', className: ['ud'], selectionType: 'fillColorContainer' },
            [
                { tagName: 'div', className: ['ud-wrapper-padding'], selectionType: constants.drawShapeChildEventIds[0] },
                [
                    { tagName: 'div', className: ['ud-applied-color'], label: 'F', background: constants.drawShapeProperties.fillColor, selectionType: constants.drawShapeColorFiller[0] },
                ],
            ],
            { tagName: 'div', className: ['ud-wrapper-padding'], selectionType: constants.drawShapeChildEventIds[1] },
            [
                { tagName: 'div', className: ['ud-applied-color'], label: 'B', background: constants.drawShapeProperties.borderColor, selectionType: constants.drawShapeColorFiller[1] },
            ],
            this.applyOrDiscard[2],
            this.applyOrDiscard[3],
        ]
    ];

    this.drawChildTags = [
        { tagName: 'div', className: ['ud-landscape-brightness-childs-container', 'ud-landscape-common-width'], selectionType: constants.navigatorChilds[3] },
        [
            this.applyOrDiscard[0],
            this.applyOrDiscard[1],
            { tagName: 'div', className: ['ud-landscape-items-center-wrapper'] },
            [
                { tagName: 'div', className: ['ud-range-position'] },
                [
                    { tagName: 'img', src: 'assets/line_disabled.svg', className: ['ud-wrapper-padding', 'ud-nav-icon-size', 'ud-line-icon-size'], selectionType: constants.drawEventIds[1] },
                    { tagName: 'div', className: ['ud-input-wrapper'], selectionType: constants.rangeSliderWrappers[2] },
                    [
                        { tagName: 'div', className: ['ud-draw-transparent-wrapper'] },
                        { tagName: 'input', type: 'range', value: constants.drawProperties.value, min: constants.drawProperties.min, max: constants.drawProperties.max, step: constants.drawProperties.step, className: ['ud-navigation-input', 'ud-range-slider-input'], selectionType: constants.rangeSliders[1] },
                    ],
                ],
                { tagName: 'div', className: ['ud-wrapper-padding'], selectionType: constants.drawEventIds[0] },
                [
                    { tagName: 'div', className: ['ud-applied-color'], label: 'B', background: constants.drawProperties.color, selectionType: constants.drawChildEventIds[0] },
                ],
            ],
            this.applyOrDiscard[2],
            this.applyOrDiscard[3],
        ],

    ];

    this.textChildTags = [
        { tagName: 'div', className: ['ud-landscape-brightness-childs-container', 'ud-landscape-common-width'], selectionType: constants.navigatorChilds[4] },
        [
            this.applyOrDiscard[0],
            this.applyOrDiscard[1],
            { tagName: 'div', className: ['ud-range-position'] },
            [
                { tagName: 'img', src: 'assets/textIcon_disabled.svg', className: ['ud-wrapper-padding', 'ud-nav-icon-size', 'ud-line-icon-size'], selectionType: constants.textEventIds[1] },
                { tagName: 'div', className: ['ud-input-wrapper'], selectionType: constants.rangeSliderWrappers[2] },
                [
                    { tagName: 'input', type: 'range', value: constants.textProperties.value, min: constants.textProperties.min, max: constants.textProperties.max, step: constants.textProperties.step, className: ['ud-navigation-input', 'ud-range-slider-input'], selectionType: constants.rangeSliders[2] },
                ],
            ],
            { tagName: 'div', className: ['ud-wrapper-padding'], selectionType: constants.textEventIds[0] },
            [
                { tagName: 'div', className: ['ud-applied-color'], label: 'C', background: constants.textProperties.textColor, selectionType: constants.textChildEventIds[0] },
            ],
            { tagName: 'div', className: ['ud-rotate-icon-block'], selectionType: constants.textEventIds[2] },
            [
                { tagName: 'img', src: 'assets/rotate_enabled.png', className: ['ud-icon-size', 'ud-crop-rotate-icon', 'ud-rotate-icon'], selectionType: '' },
            ],
            this.applyOrDiscard[2],
            this.applyOrDiscard[3],
        ],
    ];

    this.redoUndoWithSave = [
        { tagName: 'div', className: ['ud-landscape-undo-redo-save'], selectionType: constants.undoRedo },
        [
            { tagName: 'img', src: 'assets/back.png', className: ['ud-icon-size', 'ud-back', 'ud-back-btn-size'], selectionType: 'back' },
            { tagName: 'div', className: ['ud-landscape-undo-redo'], selectionType: '' },
            [
                { tagName: 'img', src: 'assets/undo_disabled.svg', className: ['ud-landscape-undo-redo-icons'], selectionType: 'undo' },
                { tagName: 'img', src: 'assets/redo_disabled.svg', className: ['ud-landscape-undo-redo-icons'], selectionType: 'redo' }
            ],
            { tagName: 'div', className: ['ud-save-icon-block'], selectionType: 'save' },
            [
                { tagName: 'img', src: 'assets/save.png', className: ['ud-icon-size'], selectionType: '' }
            ],
        ]
    ];

    this.backDropTag = [
        { tagName: 'div', className: ['ud-back-drop'], selectionType: constants.backDrop },
    ];

    this.succesMsgPopUp = [
        { tagName: 'div', className: ['ud-save-popup-container'], selectionType: constants.successMsgTagIds[0] },
        [
            { tagName: 'div', className: ['ud-landscape-file-confirmation'] },
            [
                { tagName: 'div', className: ['ud-file-confirmation-header'], label: constants.labelHolder.confirmation },
                { tagName: 'div', className: ['ud-file-content-wrapper'] },
                [
                    { tagName: 'div', className: ['ud-file-content', constants.labelHolder.className], selectionType: constants.successMsgTagIds[1] },
                ],
                { tagName: 'div', className: ['ud-file-ok'] },
                [
                    { tagName: 'input', className: ['ud-success-cancel'], type: 'button', value: constants.labelHolder.ok, selectionType: constants.successMsgTagIds[2] },
                ]
            ],
        ]
    ];

    this.undoRedoLimitTag = [
        { tagName: 'div', className: ['ud-save-popup-container'], selectionType: constants.undoRedoLimitEvents[0] },
        [
            { tagName: 'div', className: ['ud-landscape-save-popup'] },
            [
                { tagName: 'div', className: ['ud-file-content-wrapper'] },
                [
                    { tagName: 'div', className: ['ud-file-content', constants.labelHolder.className], label: constants.labelHolder.undoLimit, selectionType: '' },
                ],
                { tagName: 'div', className: ['ud-file-ok'] },
                [
                    { tagName: 'input', className: ['ud-success-cancel'], type: 'button', value: constants.labelHolder.ok, selectionType: constants.undoRedoLimitEvents[1] },
                ],
            ],
        ],
    ];

    this.fileAlreadyExitsTag = [
        { tagName: 'div', className: ['ud-save-popup-container'], selectionType: constants.fileExitsEvents[0] },
        [
            { tagName: 'div', className: ['ud-landscape-save-popup'] },
            [
                { tagName: 'div', className: ['ud-file-content-wrapper'] },
                [
                    { tagName: 'div', className: ['ud-file-content', constants.labelHolder.className], label: constants.labelHolder.fileExitsLabel, selectionType: constants.fileExitsEvents[1] },
                ],
                { tagName: 'div', className: ['ud-file-ok'] },
                [
                    { tagName: 'input', className: ['ud-success-cancel'], type: 'button', value: constants.labelHolder.ok, selectionType: constants.fileExitsEvents[2] },
                ],
            ],
        ],
    ];

    this.discardConfirmationTag = [
        { tagName: 'div', className: ['ud-save-popup-container'], selectionType: constants.discardNotifyEvents[0] },
        [
            { tagName: 'div', className: ['ud-landscape-save-popup'] },
            [
                { tagName: 'div', className: ['ud-discard-content-wrapper', constants.labelHolder.className], label: constants.labelHolder.discardNotification, selectionType: constants.discardNotifyEvents[3] },
                { tagName: 'div', className: ['ud-cancel-ok', 'ud-discard-alert'] },
                [
                    { tagName: 'input', className: ['ud-cancel-button'], type: 'button', value: constants.labelHolder.no, selectionType: constants.discardNotifyEvents[2] },
                    { tagName: 'input', className: ['ud-ok-button'], type: 'button', value: constants.labelHolder.yes, selectionType: constants.discardNotifyEvents[1] },
                ],
            ],
        ],
    ];


    this.overrideConfirmationTag = [
        { tagName: 'div', className: ['ud-save-popup-container'], selectionType: constants.overrideEvents[0] },
        [
            { tagName: 'div', className: ['ud-landscape-save-popup'] },
            [
                { tagName: 'div', className: ['ud-discard-content-wrapper', constants.labelHolder.className], label: constants.labelHolder.overrideFile },
                { tagName: 'div', className: ['ud-cancel-ok', 'ud-discard-alert'] },
                [
                    { tagName: 'input', className: ['ud-cancel-button'], type: 'button', value: constants.labelHolder.no, selectionType: constants.overrideEvents[2] },
                    { tagName: 'input', className: ['ud-ok-button'], type: 'button', value: constants.labelHolder.yes, selectionType: constants.overrideEvents[3] },
                ],
            ],
        ],
    ];


    this.savePopup = [
        { tagName: 'div', className: ['ud-save-popup-container'], selectionType: constants.savePopupChildEventIds[1] },
        [
            { tagName: 'div', className: ['ud-landscape-save-popup'] },
            [
                { tagName: 'div', className: ['ud-popup-header'], label: constants.labelHolder.save },
                { tagName: 'div', className: ['ud-save-input-container'] },
                [
                    { tagName: 'input', className: ['ud-save-input', constants.labelHolder.className], type: 'text', value: '', placeholder: constants.labelHolder.placeHolder, selectionType: constants.savePopupEventIds[2] },
                ],
                { tagName: 'div', className: ['ud-cancel-ok'] },
                [
                    { tagName: 'input', className: ['ud-cancel-button'], type: 'button', value: constants.labelHolder.cancel, selectionType: constants.savePopupEventIds[0] },
                    { tagName: 'input', className: ['ud-ok-button', 'ud-ok-enable-disable'], disabled: true, type: 'submit', value: constants.labelHolder.ok, selectionType: constants.savePopupEventIds[1] },
                ]
            ],
        ]
    ];

    this.fontFamilyTags = [];
    var fontFamily = constants.fontFamily;
    for (var i = 0; i < fontFamily.length; i++) {
        var family = { tagName: 'div', className: ['ud-landscape-family-content'], label: fontFamily[i], selectionType: constants.fontEventIds[i] }
        this.fontFamilyTags.push(family);
    }

    this.textInnerChildTags = [
        { tagName: 'div', className: ['ud-landscape-font-family'], selectionType: 'textTopBar' },
        [
            { tagName: 'div', className: ['ud-font-style-block'], selectionType: constants.textTopBlkEventIds[0] },
            [
                { tagName: 'div', className: ['ud-text-font-type', 'ud-text-font'], label: constants.fontStyle[0].label, selectionType: constants.textTopChildEventIds[0] },
            ],
            { tagName: 'div', className: ['ud-land-family-wrapper'], selectionType: constants.textTopBlkEventIds[1] },
            [
                { tagName: 'img', src: 'assets/family_disabled.svg', className: ['ud-land-family-icon'], selectionType: constants.textTopOverlay[1] },
                { tagName: 'div', className: ['ud-landscape-family-wrapper'], selectionType: constants.textTopOverlay[0] },
                this.fontFamilyTags
            ],
            { tagName: 'div', className: ['ud-delete-icon-block'], selectionType: 'delete' },
            [
                { tagName: 'img', src: 'assets/delete.svg', className: ['ud-delete-icon'], label: constants.fontStyle[0], selectionType: '' },
            ],
        ]
    ];


    this.deleteIconTag = [
        { tagName: 'div', className: ['ud-landscape-delete-icon-container'], selectionType: 'deleteContainer' },
        [
            { tagName: 'img', src: 'assets/back.png', className: ['ud-icon-size', 'ud-back', 'ud-back-btn-size'], selectionType: constants.backBtnEventIds[1] },
            { tagName: 'div', className: ['ud-delete-icon-block'], selectionType: 'delete' },
            [
                { tagName: 'img', src: 'assets/delete.svg', className: ['ud-delete-icon'], selectionType: '' },
            ],
        ]
    ];



    this.backButtonTag = [
        { tagName: 'div', className: ['ud-landscape-back-only-button'], selectionType: constants.backBtnEventIds[0] },
        [
            { tagName: 'img', src: 'assets/back.png', className: ['ud-icon-size', 'ud-back', 'ud-back-btn-size'], selectionType: constants.backBtnEventIds[1] },
        ]
    ];

    this.backBtnConfirmationTag = [
        { tagName: 'div', className: ['ud-save-popup-container'], selectionType: constants.backBtnconfirmationEventIds[0] },
        [
            { tagName: 'div', className: ['ud-landscape-save-popup'] },
            [
                { tagName: 'div', className: ['ud-discard-content-wrapper', constants.labelHolder.className], label: constants.labelHolder.closeApplication, selectionType: constants.backBtnconfirmationEventIds[1] },
                { tagName: 'div', className: ['ud-cancel-ok', 'ud-discard-alert'] },
                [
                    { tagName: 'input', className: ['ud-cancel-button'], type: 'button', value: constants.labelHolder.no, selectionType: constants.backBtnconfirmationEventIds[3] },
                    { tagName: 'input', className: ['ud-ok-button'], type: 'button', value: constants.labelHolder.yes, selectionType: constants.backBtnconfirmationEventIds[2] },
                ],
            ],
        ],
    ];


    this.colorPickerColorTags = [];
    this.colorPickerColors.forEach(function (color, index) {
        if (color.colorCode === constants.transparent) {
            constants.colorPickerColorTags.push({ tagName: 'div', className: ['ud-color-background-transparent', 'ud-landscape-color-picker-color'], background: constants.transparentIconSrc, selectionType: color.colorName });
            return
        }
        constants.colorPickerColorTags.push({ tagName: 'div', className: ['ud-landscape-color-picker-color'], background: color.colorCode, selectionType: color.colorName });

    });

    this.colorPickerPopupTag = [
        { tagName: 'div', className: [constants.colorPickerContainer], selectionType: 'ud_colorPicker_popUp' },
        [
            { tagName: 'div', className: ['ud-landscape-color-picker-popUp'] },
            [
                { tagName: 'div', className: ['ud-landscape-color-picker-header'] },
                [
                    { tagName: 'div', className: ['ud-landscape-color-header-label'], label: constants.labelHolder.chooseColor, selectionType: constants.colorPickerLabel },
                    { tagName: 'img', className: ['ud-landscape-color-picker-close'], src: 'assets/discard.svg', selectionType: constants.colorPickerCloseBtnId }
                ],
                { tagName: 'div', className: ['ud-color-holder'] },
                this.colorPickerColorTags,
            ],
        ],
    ];


}

module.exports = constants;
});
