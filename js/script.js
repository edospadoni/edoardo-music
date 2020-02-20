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
        value: 75,
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
        speed: 4,
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

function flutterMode() {
  const TAU = Math.PI * 2;

  const distanceBetween = (v1, v2) => {
    var x = v2.x - v1.x;
    var y = v2.y - v1.y;
    return (
      1.426776695 *
      Math.min(
        0.7071067812 * (Math.abs(x) + Math.abs(y)),
        Math.max(Math.abs(x), Math.abs(y))
      )
    );
  };

  class Stage {
    constructor(canvas, width, height) {
      this.canvas = canvas;
      this.context = this.canvas.getContext("2d");

      this.setSize(width, height);
    }

    clear() {
      this.context.globalCompositeOperation = "destination-out";
      this.context.fillStyle = "rgba(0, 0, 0, 0.15)";
      this.context.fillRect(0, 0, this.width, this.height);
      this.context.globalCompositeOperation = "lighter";
    }

    setSize(width, height) {
      this.width = width;
      this.height = height;

      this.centerX = this.width * 0.5;
      this.centerY = this.height * 0.5;

      this.radius = Math.min(this.width, this.height) * 0.5;

      this.canvas.width = this.width;
      this.canvas.height = this.height;

      this.center = new Vector(this.centerX, this.centerY);
    }

    getRandomPosition() {
      return new Vector(
        this.width * Math.random(),
        this.height * Math.random()
      );
    }
  }

  class Boid {
    constructor({ position, velocity, mass, maxVelocity = 1.5 }) {
      this.position = position;
      this.velocity = velocity;
      this.maxVelocity = maxVelocity;
      this.mass = mass;

      this.acceleration = new Vector();

      this.cellIndex = 0;
      this.regionCells = [];

      this.hue = 0;
    }

    applyForce(force) {
      this.acceleration.addSelf(force.divideSelf(this.mass));
    }

    update(hueTarget, stage) {
      this.hue += (hueTarget - this.hue) * 0.05;

      this.velocity.addSelf(this.acceleration);
      this.velocity.limit(this.maxVelocity);

      this.position.addSelf(this.velocity);

      this.acceleration.multiplySelf(0);

      this.checkBounds(stage);
    }

    draw(ctx, radius = 1.5) {
      const fill = `hsl(${this.hue}, 100%, 60%)`;

      ctx.save();
      ctx.translate(this.position.x, this.position.y);

      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(0, 0, scatter ? 3.5 : radius, 0, TAU, false);
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }

    getForces(
      boids,
      separationPerception,
      alignmentPerception,
      cohesionPerception
    ) {
      let separationCount = 0;
      const separation = new Vector();

      let alignmentCount = 0;
      const alignment = new Vector();

      let cohesionCount = 0;
      const cohesion = new Vector();

      boids.forEach(boid => {
        if (boid === this) {
          return;
        }

        if (!this.regionCells.includes(boid.cellIndex)) {
          return;
        }

        const difference = this.position.subtract(boid.position);
        const distance = distanceBetween(this.position, boid.position);

        // separation
        if (distance <= separationPerception) {
          difference.normalize();
          difference.divideSelf(Math.max(distance, 1));

          separation.addSelf(difference);

          separationCount++;
        }

        // alignment
        if (distance <= alignmentPerception) {
          alignment.addSelf(boid.velocity);

          alignmentCount++;
        }

        // cohesion
        if (distance <= cohesionPerception) {
          cohesion.addSelf(boid.position);

          cohesionCount++;
        }
      });

      if (separationCount > 0) {
        separation.divideSelf(separationCount);
      }

      if (alignmentCount > 0) {
        alignment.divideSelf(alignmentCount);
        alignment.multiplySelf(0.2);
      }

      if (cohesionCount > 0) {
        cohesion.divideSelf(cohesionCount);
        cohesion.subtractSelf(this.position);
        cohesion.length = 0.01;
      }

      return { separation, alignment, cohesion };
    }

    goto(destination) {
      return destination
        .clone()
        .subtract(this.position)
        .multiply(window.innerWidth < 768 ? 0.00075 : 0.00015);
    }

    getNearest(boids) {
      const sorted = boids
        .map(b => {
          const distance = distanceBetween(this.position, b.position);
          return { position: b.position, distance };
        })
        .sort((a, b) => a.distance - b.distance);

      return sorted[0];
    }

    checkBounds(stage) {
      const { width, height } = stage;

      if (this.position.x > width) {
        this.position.x = 0;
      }

      if (this.position.x < 0) {
        this.position.x = width;
      }

      if (this.position.y > height) {
        this.position.y = 0;
      }

      if (this.position.y < 0) {
        this.position.y = height;
      }
    }
  }

  class Vector {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }

    set(x, y) {
      this.x = x;
      this.y = y;
    }

    add(vec) {
      return new Vector(this.x + vec.x, this.y + vec.y);
    }

    addSelf(vec) {
      this.x += vec.x;
      this.y += vec.y;

      return this;
    }

    subtract(vec) {
      return new Vector(this.x - vec.x, this.y - vec.y);
    }

    subtractSelf(vec) {
      this.x -= vec.x;
      this.y -= vec.y;

      return this;
    }

    divide(val) {
      return new Vector(this.x / val, this.y / val);
    }

    divideSelf(val) {
      this.x = this.x / val;
      this.y = this.y / val;

      return this;
    }

    multiply(val) {
      return new Vector(this.x * val, this.y * val);
    }

    multiplySelf(val) {
      this.x *= val;
      this.y *= val;

      return this;
    }

    normalize() {
      if (this.length === 0) {
        return this;
      }

      const len = 1 / this.length;

      this.x *= len;
      this.y *= len;

      return this;
    }

    limit(max) {
      const length = this.length;

      if (length > max * max) {
        this.divideSelf(Math.sqrt(length));
        this.multiplySelf(max);
      }

      return this;
    }

    clone() {
      return new Vector(this.x, this.y);
    }

    get length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    set length(l) {
      const angle = this.angle;

      this.x = Math.cos(angle) * l;
      this.y = Math.sin(angle) * l;
    }

    get angle() {
      return Math.atan2(this.y, this.x);
    }

    set angle(a) {
      const l = this.length;

      this.x = Math.cos(a) * l;
      this.y = Math.sin(a) * l;
    }
  }

  const stage = new Stage(
    document.getElementById("particles-js"),
    window.innerWidth,
    window.innerHeight
  );

  let scatter = false;
  const numBoids = 300;

  const boids = new Array(numBoids).fill().map((_, i) => {
    const position = stage.getRandomPosition();
    const mass = 1;
    const maxVelocity = 1.5;

    const a = Math.random() * TAU;
    const velocity = new Vector();
    velocity.length = maxVelocity;
    velocity.angle = a;

    return new Boid({ position, mass, velocity, maxVelocity });
  });

  const loop = () => {
    stage.clear();

    const perception = 50;

    boids.forEach((boid, i) => {
      const { separation, alignment, cohesion } = boid.getForces(
        boids,
        perception * 0.5,
        perception,
        perception
      );
      const directionalForce = boid.goto(stage.center);

      boid.applyForce(directionalForce.multiplySelf(0.2));
      boid.applyForce(cohesion.multiplySelf(0.1));
      boid.applyForce(alignment.multiplySelf(0.1));
      boid.applyForce(separation.multiplySelf(0.1));

      const hue =
        180 + Math.cos((boid.position.x + boid.position.y) * 0.01) * 180;
      boid.update(hue, stage);
      boid.draw(stage.context);
    });

    requestAnimationFrame(loop);
  };

  loop();

  document.body.addEventListener("mousedown", () => {
    scatter = true;
  });
  document.body.addEventListener("mouseup", () => {
    scatter = false;
  });

  document.body.addEventListener("touchstart", () => {
    scatter = true;
  });
  document.body.addEventListener("touchend", () => {
    scatter = false;
  });
}

function vitae() {
  var parent = document.getElementById("cover-parent");
  var elem = document.createElement("div");
  elem.setAttribute("id", "particles-js");
  elem.setAttribute("class", "flex-active-slide particles-cover");
  parent.appendChild(elem);

  particlesJS("particles-js", particleModes["vitae"]);
}

function echoes() {
  var parent = document.getElementById("cover-parent");

  // particles.js case
  var elem = document.createElement("div");
  elem.setAttribute("id", "particles-js");
  elem.setAttribute("class", "flex-active-slide particles-cover");
  parent.appendChild(elem);
  particlesJS("particles-js", particleModes["echoes"]);

  // color case
  /* var elem = document.createElement("canvas");
  elem.setAttribute("id", "particles-js");
  elem.setAttribute("class", "flex-active-slide particles-cover");
  parent.appendChild(elem);
  flutterMode() */
}

!(function(e) {
  "use strict";
  e(window).on("load", function() {
    e(".loader-inner").fadeOut(),
      e(".loader")
        .delay(200)
        .fadeOut("slow");

    // update copyright date
    $("#current-date").text(new Date().getFullYear());

    // init particles in background
    var pathname = window.location.pathname;
    switch (pathname) {
      case "/":
        echoes();
        break;
      case "/v/":
        particlesJS("particles-js", particleModes["vitae"]);
        break;

      case "/e/":
        particlesJS("particles-js", particleModes["echoes"]);
        break;
    }
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
