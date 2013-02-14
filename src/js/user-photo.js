/**jshint jQuery:true */
(function($) {
    var cropper;

    var fileReader = new FileReader();
    fileReader.onload = function(frEvent) {
        console.log(frEvent);
        cropper.destroy();
        $('#user-photo-preview').attr('src', frEvent.target.result);
        cropper = $('#user-photo-preview').Jcrop(
            {
                aspectRatio: 1,
                boxWidth: 250,
                boxHeight: 250
            }, function() {
                cropper = this;
            }
        );
    };

    var loadImage = function(fileInputId) {
        var fileInput = document.getElementById(fileInputId);
        if (fileInput.files.length === 0) { return; }
        var oFile = fileInput.files[0];
        fileReader.readAsDataURL(oFile);
    };

    $(function() {
        console.log("User Photo running...");
        cropper = $('#user-photo-preview').Jcrop(
            {aspectRatio: 1}, function() {
                cropper = this;
            }
        );
        $('#userphoto_image_file').on('change', function() {
            loadImage('userphoto_image_file');
        });
    });
})(jQuery);