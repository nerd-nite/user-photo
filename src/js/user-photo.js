/**jshint jQuery:true */
(function($) {
    /**
     * @type {Jcrop}
     */
    var cropper;

    /**
     * Restrict the boundaries of an image to those defined by `limits`
     *
     * @param {Image} image
     * @param {Object} limits
     * @param {number} limits.height
     * @param {number} limits.width
     * @return {Object}
     */
    var imageLimiter = function(image, limits) {
        var imgDims = {
            width:  image.width,
            height: image.height
        };
        var targetDim = (imgDims.width > imgDims.height) ? 'width' : 'height';
        var scaleFactor = Math.max(1,imgDims[targetDim] / limits[targetDim]);

        return {
            width: imgDims.width / scaleFactor,
            height: imgDims.height / scaleFactor
        };
    };

    /**
     * Show the size of the currently selected crop region
     * @param newSize
     */
    var updateSizeDisplay = function(newSize) {
        var height = Math.round(newSize.height || newSize.h),
            width  = Math.round(newSize.width || newSize.w);

        $('#userphoto-size-display .height').text(height);
        $('#userphoto-size-display .width').text(width);
        $('#userphoto-size-display').toggleClass('ok-size',  width >= 150);
        $('#userphoto-size-display').toggleClass('bad-size', width < 150);
    };

    /**
     *
     * @param coords
     */
    var updateCropSelection = function(coords) {
        $("input[name=cropX]").val(Math.round(coords.x));
        $("input[name=cropY]").val(Math.round(coords.y));
        $("input[name=cropW]").val(Math.round(coords.w));
        $("input[name=cropH]").val(Math.round(coords.h));
    };

        var fileReader = new FileReader();
    fileReader.onload = function(frEvent) {
        if(cropper) {
            cropper.destroy();
        }
        var previewImage = $('#user-photo-preview');
        var sizingImage = new Image();
        $(sizingImage).on('load', function() {

            /*
             * Now that the sizingImage has loaded, we can figure out the actual size of the image
             * and make sure it renders properly.
             */
            var previewSize = imageLimiter(sizingImage, {width:300, height: 300});

            previewImage.width(previewSize.width  + 'px')
                        .height(previewSize.height + 'px')
                        .show();
            cropper = $.Jcrop('#user-photo-preview',
                {
                    aspectRatio: 1,
                    trueSize: [sizingImage.width, sizingImage.height],
                    boxWidth: 350,
                    boxHeight: 350,
                    setSelect: [0, 0, 250, 250],
                    onSelect: updateCropSelection,
                    onChange: updateSizeDisplay
                }, function() {
                    cropper = this;
                }
            );
            $('#userphoto-upload-cropper').show();
        });
        previewImage.attr('src', frEvent.target.result);
        sizingImage.src =  frEvent.target.result;
        updateCropSelection({x:-1, y:-1, h:-1, w:-1});

    };

    var loadImage = function(fileInputId) {
        var fileInput = document.getElementById(fileInputId);
        if (fileInput.files.length === 0) { return; }
        var oFile = fileInput.files[0];
        fileReader.readAsDataURL(oFile);

        $('#userphoto-upload-cropper').hide();
    };

    $(function() {
        console.log("User Photo running...");
        $('#userphoto-upload-cropper').hide();
        $('#user-photo-preview')
            .width('300px')
            .height('300px')
            .hide();
        $('#userphoto_image_file').on('change', function() {
            loadImage('userphoto_image_file');
        });
    });
})(jQuery);