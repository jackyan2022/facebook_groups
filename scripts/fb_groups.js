function FBGroups(){
    console.log('FBGroups');

    this.isIOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;
    this.isAndroid = navigator.userAgent.match(/(Android)/g) ? true : false;

    this.inputMethod = (this.isIOS || this.isAndroid) ? 'touchstart' : 'click';

    //time for slide to display in milliseconds;
    this.slideshowTime = 4000;
    this.slideshowInt = null;

}

FBGroups.prototype.init = function() {
  this.setupPagePiling();
  this.setupStoreLinks();
  this.setupLogoLink();
  this.setupChevronLink();
  $(window).bind('load', $.proxy(this.setupBgSlideshows, this));
  $(window).bind('orientationchange', $.proxy(this.orientationChangeHandler, this) );
  this.orientationChangeHandler();
}

FBGroups.prototype.setupPagePiling = function() {
      $('#wrapper').pagepiling({
        anchors: ['', 'create', 'share', 'discover', 'more'],
        verticalCentered: false,
        animateAnchor: true,
        navigation: {
            'position': 'right',
            'tooltips': ['', '', '', '', '']
        },
        onLeave: function(index, nextIndex, direction){
            if(nextIndex == 1 || nextIndex == 5) {
                $('header').addClass('hide');
            } else {
                $('header').removeClass('hide');
            }

            if(nextIndex == 1) {
                $("#pp-nav").fadeOut();
            }

            if(nextIndex == 5) {
                $("#pp-nav li").removeClass('on-image');
            } else {
                $("#pp-nav li").addClass('on-image');
            }
        },

        afterLoad: function(anchorLink, index){
            //using index
            if(index != 1 && index != 5) {
                $("#pp-nav").fadeIn();
            }
        },

        afterRender: $.proxy(this.postPagePiling, this)
    });
}

FBGroups.prototype.postPagePiling = function() {
    console.log('postPagePiling');

    $("#pp-nav").hide();

    var windowWidth = $(window).width();
    if(windowWidth <= 800) {
        var sectionHeight = $('.create .content-wrapper').outerHeight();
        var headerHeight = $('header').outerHeight();
        var windowHeight = $(window).height();
        var bodyCopyHeight = sectionHeight + headerHeight;
        var bodyImageHeight = windowHeight - bodyCopyHeight;

        if(windowWidth <= 599) {
            var imageRatio = 456/640;
            $("#pp-nav").css({top: bodyCopyHeight + 2 + 'px'});
        } else {
            var imageRatio = 432/768;
            $("#pp-nav").css({top: bodyCopyHeight + 14 + 'px'});
        }

        $('.create, .share, .discover').css({backgroundPosition: 'center ' + bodyCopyHeight + 'px'});


        var availableRatio = bodyImageHeight/windowWidth;

        if(availableRatio > imageRatio) {
            $('.create, .share, .discover').css({backgroundSize: 'auto ' + bodyImageHeight + 'px'});
        } else {
            $('.create, .share, .discover').css({backgroundSize: '100% auto'});
        }

    }
}

FBGroups.prototype.setupBgSlideshows = function() {
    console.log('setupBgSlideshows');
    //hide all images except first one
    $('.section.home .bgs div:gt(0)').hide();
    $('.section.home .bg.invisible').removeClass('invisible');

    $('.site-loader').fadeOut(300, function() {
      $(this).remove();
    });
    //fade in bg container
    $('.section.home .bgs').fadeIn(this.slideshowTime, "easeInOutQuint");
    this.startBgSlideshows();
};

FBGroups.prototype.startBgSlideshows = function() {
    console.log('startBgSlideshows');
    var _self = this
    this.slideshowInt = setInterval(function(){
      $('.section.home .bgs :first-child').fadeOut(_self.slideshowTime - 1000, "easeInOutQuint")
         .next('div').fadeIn(_self.slideshowTime - 1000, "easeInOutQuint")
         .end().appendTo('.section.home .bgs');},
    this.slideshowTime);
};

FBGroups.prototype.setupLogoLink = function() {
  $('.logo').bind(this.inputMethod, $.proxy(this.logoHandler, this))
}

FBGroups.prototype.logoHandler = function(e) {
  e.preventDefault();
  $('#wrapper').pagepiling.moveTo(1);
}

FBGroups.prototype.setupChevronLink = function() {
  $('.btn-more').bind(this.inputMethod, $.proxy(this.chevronHandler, this))
}

FBGroups.prototype.chevronHandler = function(e) {
  e.preventDefault();
  $('#wrapper').pagepiling.moveTo(2);
}

FBGroups.prototype.setupStoreLinks = function() {
  var _self = this;

  if(this.isIOS || this.isAndroid) {
    $('.btn-store').hide();

    $('.platformCTA').each(function(idx, item) {
      if(_self.isIOS) {
        var href = $(item).attr('data-iOS');
      } else {
        var href = $(item).attr('data-android');
      }
      $(item).attr('href', href);
    });

    $('.mobile').css({display: 'inline-block'});
  } else {
    $('.platformCTA').hide();
  }
}

FBGroups.prototype.orientationChangeHandler = function() {
  console.log('orientationChangeHandler');

  var winOrientation = (window.orientation != undefined) ? window.orientation : 0;

  //some android devices have 0 based orientation as landscape
  //this checks actual screen dimensions to determine orientation
  if(this.isAndroid) {
    winOrientation = (window.screen.width > window.screen.height) ? 90 : 0;
  }

  switch(winOrientation) {
    case -90:
    case 90:
      console.log(' > landscape');
      $('#wrapper').hide();
      $('.landscape-orientation').show();
      break;
    default:
      console.log(' > portrait');
      $('.landscape-orientation').hide();
      $('#wrapper').show();
      break;
  }
}