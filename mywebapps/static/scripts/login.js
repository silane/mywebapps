$(function () {
    $('#form').submit(function () {
        const formData = $('#form').serialize();
        $.post($SCRIPT_ROOT + '/login', formData, undefined, 'json').done(function (data,status) {
            if (data.redirect)
                location.href = data.redirect;
            else (data.message)
            {
                const alarts = $('#alert-area');
                alarts.empty();
                alarts.append(`<div class="alert alert-danger alert-dismissible">
<button type="button" class ="close" data-dismiss="alert" aria-label="閉じる"><span aria-hidden="true">×</span></button>
<span>${data.message}</span>
</div>`)

            }
        });
        return false;
    });
});