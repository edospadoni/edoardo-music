!(function(e) {
  "use strict";
  e(window).on("load", function() {
    e(".loader-inner").fadeOut(),
      e(".loader")
        .delay(200)
        .fadeOut("slow");

    // update cpyright date
    $("#current-date").text(new Date().getFullYear());

    // init particles in background
    var particleModes = {
      echoes: {
        particles: {
          number: { value: 9, density: { enable: true, value_area: 800 } },
          color: { value: "#161616" },
          shape: {
            type: "polygon",
            stroke: { width: 3, color: "#777777" },
            polygon: { nb_sides: 6 }
          },
          opacity: {
            value: 0.75,
            random: false,
            anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }
          },
          size: {
            value: 100,
            random: true,
            anim: { enable: true, speed: 10, size_min: 40, sync: false }
          },
          line_linked: {
            enable: true,
            distance: 300,
            color: "#ffffff",
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 8,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 1200 }
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "grab" },
            onclick: {
              enable: false
            },
            resize: true
          },
          modes: {
            grab: { distance: 400, line_linked: { opacity: 1 } }
          }
        },
        retina_detect: true
      },
      vitae: {
        particles: {
          number: {
            value: 100,
            density: {
              enable: true,
              value_area: 1000
            }
          },
          color: {
            value: ["#ffffff", "#9e9e9e"]
          },

          shape: {
            type: "circle",
            stroke: {
              width: 0,
              color: "#fff"
            }
          },
          opacity: {
            value: 0.6,
            random: false,
            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 2,
            random: true,
            anim: {
              enable: false,
              speed: 40,
              size_min: 0.1,
              sync: false
            }
          },
          line_linked: {
            enable: true,
            distance: 120,
            color: "#ffffff",
            opacity: 0.4,
            width: 1
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "grab"
            },
            onclick: {
              enable: false
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 140,
              line_linked: {
                opacity: 1
              }
            }
          }
        },
        retina_detect: true
      }
    };

    // apply style
    var style = "echoes";
    var pathname = window.location.pathname;
    switch (pathname) {
      case "/v/":
        style = "vitae";
        break;

      case "/e/":
        style = "echoes";
        break;
    }
    particlesJS("particles-js", particleModes[style]);
  }),
    e("a.scroll").smoothScroll({
      speed: 800,
      offset: -60
    });
  var i = e(".header"),
    a = i.offset(),
    s = e(".block-top");
  e(window).scroll(function() {
    e(this).scrollTop() > a.top + 500 && i.hasClass("default")
      ? i.fadeOut("fast", function() {
          e(this)
            .removeClass("default")
            .addClass("switched-header")
            .fadeIn(200),
            s.addClass("active");
        })
      : e(this).scrollTop() <= a.top + 500 &&
        i.hasClass("switched-header") &&
        i.fadeOut("fast", function() {
          e(this)
            .removeClass("switched-header")
            .addClass("default")
            .fadeIn(100),
            s.removeClass("active");
        });
  });
  var t = e(" .hero .main-slider .slides li");

  function l() {
    t.css("height", e(window).height());
  }
  e(function() {
    l();
  }),
    e(window).resize(function() {
      l();
    });
  var o = e(".mobile-but"),
    n = e(".main-nav ul");
  n.height();
  e(o).on("click", function() {
    return (
      e(".toggle-mobile-but").toggleClass("active"),
      n.slideToggle(),
      e(".main-nav li a").addClass("mobile"),
      !1
    );
  }),
    e(window).resize(function() {
      e(window).width() > 320 &&
        n.is(":hidden") &&
        (n.removeAttr("style"), e(".main-nav li a").removeClass("mobile"));
    }),
    e(".main-nav li a").on("click", function() {
      e(this).hasClass("mobile") &&
        (n.slideToggle(), e(".toggle-mobile-but").toggleClass("active"));
    }),
    e(".background-img").each(function() {
      var i = e(this)
        .children("img")
        .attr("src");
      e(this)
        .css("background-image", 'url("' + i + '")')
        .css("background-position", "initial");
    }),
    e(".popup-image").magnificPopup({
      type: "image",
      fixedContentPos: !1,
      fixedBgPos: !1,
      mainClass: "mfp-no-margins mfp-with-zoom",
      image: {
        verticalFit: !0
      },
      zoom: {
        enabled: !0,
        duration: 300
      }
    }),
    e(".popup-video").magnificPopup({
      disableOn: 700,
      type: "iframe",
      mainClass: "mfp-fade",
      removalDelay: 160,
      preloader: !1,
      fixedContentPos: !1
    });
  e.get(
    "https://wt-3124fd8f88a61e57a4cfca31da4ab788-0.sandbox.auth0-extend.com/instagram-photos",
    function(data) {
      if (data.feeds.length > 0) {
        for (var p in data.feeds) {
          var feed = data.feeds[p];
          var htmlFeed =
            "<img style=\"background-image: url('" +
            feed.images.standard_resolution.url +
            '\'" href="' +
            (feed.type == "video"
              ? feed.videos.standard_resolution.url
              : feed.images.standard_resolution.url) +
            '" class="popup-' +
            feed.type +
            ' mb-0 square animated">' +
            "</img>";
          e(".feed-container").append(htmlFeed);
        }

        e(".popup-image").magnificPopup({
          type: "image",
          fixedContentPos: !1,
          fixedBgPos: !1,
          mainClass: "mfp-no-margins mfp-with-zoom",
          image: {
            verticalFit: !0
          },
          zoom: {
            enabled: !0,
            duration: 300
          }
        });
        e(".popup-video").magnificPopup({
          type: "iframe",
          mainClass: "mfp-fade",
          removalDelay: 160,
          preloader: !1,
          fixedContentPos: !1
        });
      } else {
        e(".feed-container").append(
          '<p class="col-sm-12">No photos found.</p>'
        );
      }

      // hide loader
      e("#gallery-loader").hide();
    }
  );
})(jQuery);
