$(function () {
    $('[data-toggle="tooltip"]').tooltip();


    const music = new Audio();

    const list = $('#searchlist');

    $("#reloadbutton").click(function(eo) {
        $('#reloadingdialog .progress-bar').addClass('active').addClass('progress-bar-warning');
        $('#reloadingdialog button[data-dismiss]').prop('disabled', true);

        $('#reloadingdialog').modal({backdrop: "static", keyboard: false});
        $.get('reload').done(function() {
            $('#reloadingdialog .progress-bar').text('Reloading Finished!');
            $('#reloadingdialog .progress-bar').addClass('progress-bar-success');
        }).fail(function() {
            $('#reloadingdialog .progress-bar').text('Reloading Failed!');
            $('#reloadingdialog .progress-bar').addClass('progress-bar-danger');
        }).always(function() {
            $('#reloadingdialog .progress-bar').removeClass('active').removeClass('progress-bar-warning');
            $('#reloadingdialog button[data-dismiss]').prop('disabled', false);
            $('#keyword').triggerHandler('input');
        });

        eo.preventDefault();
    });

    function playAt(elem) {
        const id = elem.attr('data-musicid');

        $('#searchlist > .musicitem').removeClass('active');
        elem.addClass('active');

        music.src = 'musicfile/' + id;
    }
    function playNext() {
        let elem = $('#searchlist > .active').next('.musicitem');
        if(elem.length == 0) {
            elem = $('#searchlist > .musicitem:first');
        }
        playAt(elem);
    }

    function playPrev() {
        let elem = $('#searchlist > .active').prev('.musicitem');
        if(elem.length == 0) {
            elem = $('#searchlist > .musicitem:last');
        }
        playAt(elem);
    }

    function shuffle() {
        const ul = document.querySelector('#searchlist');
        for (let i = ul.children.length; i >= 0; i--) {
            ul.appendChild(ul.children[Math.random() * i | 0]);
        }
    }

    function focusToCurrent() {
        let currentElem = $('#searchlist > .active');
        const listarea = $('#musiclistarea');
        listarea.animate({scrollTop: currentElem.position().top - listarea.height() / 2}, 1000);
    }

    function updateSearchList(keywords) {
        $.getJSON('query', {
            keyword: keywords
        }).done(function (data) {
            list.empty()
            for (let item of data) {
                const title = item.title_unicode || item.title;
                const artist = item.artist_unicode || item.artist;
                list.append(`<li class="musicitem list-group-item list-group-item-action" data-musicid="${item.id}">
${title}  <small>${artist}</small></li>`)
            }

            const firstItem = $('#searchlist > .musicitem:first')
            if (firstItem.length != 0)
                playAt(firstItem);
        });
    }

    {
        let search = '';
        if(location.hash)
            search = decodeURI(location.hash.slice(1));
        updateSearchList(search);
        $('#keyword').val(search);
    }

    let listUpdateTimer;
    let hashUpdateTimer;
    $('#keyword').on('input',function (eo) {

        keywords = $(this).val();

        clearTimeout(listUpdateTimer);
        clearTimeout(hashUpdateTimer);
        listUpdateTimer = setTimeout(function() {
            updateSearchList(keywords);
        }, 400);
        hashUpdateTimer = setTimeout(function() {
            location.hash = encodeURI(keywords);
        }, 2000);
    });

    $('#searchlist').on('click', '.musicitem', function (eo) {
        playAt($(this));
        music.play();
    });

    music.onplay = function () {
        $('#play > *').removeClass('fa-play');
        $('#play > *').addClass('fa-pause');
    };

    music.onpause = function () {
        $('#play > *').removeClass('fa-pause');
        $('#play > *').addClass('fa-play');
    };

    function updateSeekbar() {
        const pos = music.currentTime / music.duration;
        $('#seekbar > div').width(`${pos*100}%`);
    }

    music.ondurationchange = function () {
        updateSeekbar();
    };

    music.ontimeupdate = function () {
        updateSeekbar();
    };

    $('#seekbar').mousedown(function (eo) {
        const this_ = $(this);
        const seekbarleft = this_.offset().left;
        const seekbarwidth = this_.width();
        const playmusic = !music.paused;
        const doc = $(document);
        music.pause();
        this_.addClass('seeking');

        function updateTime(eo) {
            const pos = (eo.pageX - seekbarleft) / seekbarwidth;
            const time = music.duration * pos;
            music.currentTime = time;
        }

        updateTime(eo);
        doc.mouseup(function(eo) {
            doc.off('mouseup mousemove');
            this_.removeClass('seeking');
            updateTime(eo);
            if(playmusic)
                music.play();
            
            eo.preventDefault();
        });
        doc.mousemove(function(eo) {
            updateTime(eo);
            eo.preventDefault();
        });

        eo.preventDefault();
    });

    $('#play').click(function (eo) {
        if (music.paused)
            music.play();
        else
            music.pause();
    });

    $('#prev').click(function (eo) {
        playPrev();
        music.play();
    });

    $('#next').click(function (eo) {
        playNext();
        music.play();
    });

    $("#shuffle").click(function (eo) {
        shuffle();
    });

    $('#focusoncurrent').click(function (eo) {
        focusToCurrent();
    });

    music.onended = function () {
        playNext();
        music.play();
    };
})
