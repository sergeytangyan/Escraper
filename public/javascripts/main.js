$('#new_product_form').submit(function (event) {
    event.preventDefault();
    // console.log($(this).serialize());
    $.post({
        url: '/api/product',
        type: 'post',
        dataType: 'json',
        data: $(this).serialize(),
        success: function (data) {
            // console.log(data);
            window.location.href = "/";
        },
        error: function (xhr) {
            alert('error, zangi inds');
            console.error(xhr.responseText);
        }
    });
});

$('td.actions > button.scan_action').click(function (event) {
    event.preventDefault();
    // console.log($(this).serialize());
    var self = $(this);
    self.attr('disabled', true);
    $.post({
        url: `/api/product/${self.data('id')}/scan`,
        type: 'post',
        // dataType: 'json',
        success: function (data) {
            console.log(data);
            window.location.reload();
        },
        error: function (xhr) {
            alert('error, zangi inds');
            console.error(xhr.responseText);
        },
        complete: function () {
            // console.log('complete');
            self.attr('disabled', false);
        }
    });
});

$('td.actions > button.delete_action').click(function (event) {
    event.preventDefault();
    alert('mi bzbza');
});
