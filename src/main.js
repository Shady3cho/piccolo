/**
 * Created by Zesa on 12/3/2016.
 */
var Piccolo = (function ($, me){

    me = me || {};


    //Private properts
    var _this = {

        /**
         * List of events in library
         */
        events: {
            onready: [],
            onimageready: [],
            onimageloaded: [],
            onimageuploaded: [],
            oncropstart: [],
            oncropend: [],
            onrotatestart: [],
            onrotateend: []
        }

    };


    /**
     * Default settings
     */
    me.settings = {
        imagesdirectory: '',
        uploadurl: '',
        postvariablename: '',
        multiplefileupload: false
    };


    /**
     * Registers event listener
     * @param event
     * @param callback
     */
    me.on = function(event, callback){

        if(_.isFunction(callback)){

            var callback_index = _this.events[event].indexOf(callback);
            callback_index || _this.events[event].push(callback);

        }

    };


    /**
     * Unregisters event listeners
     * @param event
     * @param callback
     */
    me.un = function(event, callback){

        if(_.isFunction(callback)){

            var callback_index = _this.events[event].indexOf(callback);
            callback_index && _this.events[event].splice(callback_index, 1);

        }

    };


    /**
     * Raise event
     * @param event
     * @param evt
     */
    me.raise = function(event, evt){

        //Raise event on seperate thread
        _.defer(function(){

            _this.events[event] && _this.events[event].forEach(function(fxn){
                fxn(evt);
            });

        })

    };


    /**
     * Do preliminary setup here of dom and of script
     */
    $.fn.piccolo = function(options){

        //Extend settings with options passed
        me.settings = $.extend(me.settings, options);

        //Create dropzone
        _this.createDropzone(this);

        return this;        //Return object for chain

    };


    /**
     * DOM
     */
    _this.createDropzone = function(parent){

        $parent = $(parent);

        //Test drag and drop support
        var canDragAndDrop = _this.supportsFileAPI();

        if(canDragAndDrop){

            //Register drag and drop events on dropzone
            $parent.on('dragover', _this.handleDragOver);
            $parent.on('drop', _this.handleDropzoneFileSelect);

        }


        //Card DIV
        $card = $('<div/>', {
            "class": "mdl-card mdl-shadow--2dp"
        });

        //Card content
        $card_content = $('<div/>', {
            "class": "mdl-card__title mdl-card--expand"
        });

        //Card title
        $card_title = $('<h2/>', {
            "class": "mdl-card__title-text"
        }).text("Upload photo");

        //Card supporting text
        $card_stext = $('<div/>', {
            "class": "mdl-card__supporting-text"
        }).text('Drag and drop photos, or pick photo to upload.');

        //Card Actions
        $card_actions = $('<div/>',{
            "class": "mdl-card__actions mdl-card--border"
        }).append($('<a/>',{
            "class": "mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"
        }).text('Pick Photo'));


        //Add card title to card content
        $card_content.append($card_title);

        //Add card content, summary text, and actions
        //to material card
        $card.append($card_content)
            .append($card_stext)
            .append($card_actions);

        //Add material card to parent
        //container
        $parent.append($card);

    };


    /**
     * Test File API support
     * @returns {boolean}
     */
    _this.supportsFileAPI = function(){

        return (window.File && window.FileReader && window.FileList && window.Blob) ? true : false;

    };


    /**
     * Handles dragover event
     * @param evt
     */
    _this.handleDragOver = function(evt){

        evt.stopPropagation();
        evt.preventDefault();
        evt.originalEvent.dataTransfer.dropEffect = 'copy';

    };


    /**
     * Handles dropzone file selection
     * @param evt
     */
    _this.handleDropzoneFileSelect = function(evt){

        evt.stopPropagation();
        evt.preventDefault();

        //Get valid files dropped
        _this.files = _this.getValidFiles(evt.originalEvent.dataTransfer.files);

        _this.currentfileindex = 0;
        _this.files.length && _this.loadFileAt(_this.currentfileindex);


    };


    /**
     * Loads image file at index
     * @param index
     */
    _this.loadFileAt = function(index){

        var file = _this.files[index];

        //Load image
        console.log(file);

    };


    /**
     * Validates files and gets only those that match images
     * @param files
     * @returns {Array}
     */
    _this.getValidFiles = function(files){

        var images = [];
        _.each(files, function(file){

            file.type.match('image.*') && images.push(file);

        });

        return images;

    };


    return me;

}(jQuery, {}));