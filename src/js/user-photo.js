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
                    onSelect: function() {
                        console.log(arguments);
                    }
                }, function() {
                    cropper = this;
                }
            );
        });
        previewImage.attr('src', frEvent.target.result);
        sizingImage.src =  frEvent.target.result;

    };

    var loadImage = function(fileInputId) {
        var fileInput = document.getElementById(fileInputId);
        if (fileInput.files.length === 0) { return; }
        var oFile = fileInput.files[0];
        fileReader.readAsDataURL(oFile);
    };

    $(function() {
        console.log("User Photo running...");
        $('#user-photo-preview')
            .width('300px')
            .height('300px')
            .hide();
        $('#userphoto_image_file').on('change', function() {
            loadImage('userphoto_image_file');
        });
    });
})(jQuery);