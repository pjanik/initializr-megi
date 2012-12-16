/*global $:false, d3:false */

// ============================================================================
// CoolGallery
// author: Piotr Janik janikpiotrek@gmail.com
// ============================================================================
window.CoolGallery = function CoolGallery(container, config) {
  
  // Private variables.      
      // Main SVG container.
  var svg,

      // Photos data.
      photos,
      // Photos roots, which keeps photos in place using links. 
      photosRoots,

      // Selected project title.
      title,

      // Force variables.
      force,
      nodes = [],
      links = [],

      // Cool colors.
      shuffle = function (o) {
          for (var j, x, i = o.length; i; j = parseInt(Math.random() * i, 10), x = o[--i], o[i] = o[j], o[j] = x);
          return o;
      },
      coolColors = shuffle([
        "#AF57A4",
        "#DAFF7F",
        "#FFFA7F",
        "#4D959B",
        "#15667F",
        "#C65621",
        "#C6C421",
        "#D76363",
        "#A2d56C"
      ]),

      // Used for auto-move.
      timeoutID,

      // Cached selections (optimization).
      linksSelection,
      photosSelection,

      // Private methods.
      processPhotosData = function (photosRawData) {
        photosRawData.forEach(function (el) {
          var attr, 
              extraAttrs = config.photosData;
          for(attr in extraAttrs) {
            if (extraAttrs.hasOwnProperty(attr) && el[attr] === undefined) {
              el[attr] = extraAttrs[attr];
            }
          }
        });

        photos = photosRawData;

        initPhotosRoots();
      },

      preloadImages = function () {
        var images = svg.selectAll("image.node").data(photos);

        images
          .enter().append("svg:image")
          .attr("xlink:href", function (d) { return config.galleryDir + "/" + d.dir + "/" + d.galleryImage; })
          .attr("width", 0)
          .attr("height", 0)
          .style("opacity", 0);

        images.remove();
      },
      
      initSVG = function () {
        svg = d3.select(container).append("svg:svg")
          .attr("width", config.realWidth)
          .attr("height", config.realHeight)
          .attr("viewBox", "0 0 " + config.width + " " + config.height)
          .attr("preserveAspectRatio", "xMidYMin")
          .attr("class", "gallery");

        if ($("svg.gallery").width() < config.width / 2) {
          config.columns = Math.round(config.columns / 2);
        }
      },

      initForce = function () {
        var i, len;

        force = d3.layout.force()
          .nodes(nodes)
          .links(links)
          .size([config.width, config.height])
          .gravity(0.0)
          .charge(function (d) { return d.charge; })
          .linkStrength(1.0)
          .linkDistance(0.0);

        force.on("tick", function() {
          photosSelection
            .attr("x", function(d) { return d.x - d3.select(this).attr("width") / 2.0; })
            .attr("y", function(d) { return d.y - d3.select(this).attr("height") / 2.0; });

          svg.selectAll("image.node")
            .attr("x", function(d) { return d.x - d3.select(this).attr("width") / 2.0; })
            .attr("y", function(d) { return d.y - d3.select(this).attr("height") / 2.0; });
        });

        // Add photos roots (fixed points).
        nodes.push.apply(nodes, photosRoots);
        // Add photos to nodes.
        nodes.push.apply(nodes, photos);


        // And add links between photos and roots.
        for (i = 0, len = photos.length; i < len; i++) {
          links.push({
            source: i,
            target: i + len
          });
        }
      },

      initPhotosRoots = function () {
        var rows = Math.ceil(photos.length / config.columns),
            dx = Math.round((config.width - config.paddingLeft - config.paddingRight) / (config.columns + 1)),
            dy = Math.round((config.height - config.paddingTop - config.paddingBottom) / (rows + 1)),
            x = config.paddingLeft,
            y = config.paddingTop,
            i, len;

        photosRoots = new Array(photos.length);
        for (i = 0, len = photos.length; i < len; i ++) {
          if (i % config.columns === 0) {
            y += dy;
            x = config.paddingLeft;
          }
          x += dx;          
          photosRoots[i] = { 
            x: x, 
            y: y, 
            r: 0,
            fixed: true,
            charge: 0
          };
        }
      },

      
      // FIXME: each load of gallery causes that a new timeout is set.
      autoMove = function () {
        /*
        function incRep() {
          var i = Math.floor(Math.random() * photos.length);
          photos[i].charge *= 35;
          force.start();

          timeoutID = setTimeout(decRep, 50);
        }

        function decRep() {
          var i, len;
          for (i = 0, len = photos.length; i < len; i++) {
            photos[i].charge = config.photosData.charge;
          }
          force.start();

          timeoutID = setTimeout(incRep, Math.random() * 5000 + 1000);
        }
        timeoutID = setTimeout(incRep, 2000);
        */
      },

      stopAutoMove = function () {
        //clearTimeout(timeoutID);
      },


      mouseOverPhotoEffect = function () {
        var selectThis = d3.select(this),
            d = selectThis.datum();

        stopAutoMove();

        // Workaround for z-index.
        d.z = 2;
        linksSelection.sort(function(a, b) { 
          var az = a.z !== undefined ? a.z : 0,
              bz = b.z !== undefined ? b.z : 0;
          return az - bz; 
        });

        // Change dimensions.
        selectThis.transition()
          .attr("opacity", 0.5)
          .attr("width", function (d) { return d.width; })
          .attr("height", function (d) { return d.height; });

        selectThis.transition().delay(250)
          .attr("opacity", 0.0);

        // Switch to photo.
        svg.selectAll("image.node").data([d])
          .enter().insert("svg:image", ":hover")
          .attr("class", "node")
          .attr("xlink:href", function (d) { return config.galleryDir + "/" + d.dir + "/" + d.galleryImage; })
          .attr("preserveAspectRatio", "none")
          .attr("width", function (d) { return d.width; })
          .attr("height", function (d) { return d.height; })
          .style("opacity", 0);

        svg.selectAll("image.node").data([d])
          .transition().delay(300)
          .style("opacity", 1);

        // Update title.
        title.transition().delay(250).text(d.name);
        title.transition().delay(250).attr("x", config.titleFromLeft);

        // Change charge.
        d.charge *= config.repulsionMult;
        force.start();
      },

      mouseOutPhotoEffect = function () {
        var selectThis = d3.select(this),
            d = selectThis.datum();
        
        d.z = 1;

        // Change dimensions.
        selectThis.transition()
          .attr("opacity", 1)
          .attr("width", function (d) { return d.symbolWidth; })
          .attr("height", function (d) { return d.symbolHeight; });

        // Remove photo.
        svg.selectAll("image.node").data([d])
          .remove();

        // Update title.
        title.transition().attr("x", -500);

        d.charge /= config.repulsionMult;
        force.start();

        autoMove();
      },

      init = function () {
        initSVG();
        initForce();

        // Init photos visualization.
        // Save links selection.
        linksSelection = svg.selectAll("a").data(photos)
          .enter().append("svg:a")
          .attr("xlink:href", config.hrefFunc);

        photosSelection = linksSelection
          .append("svg:rect")
          .attr("class", "node")
          .attr("fill", function () {
            return coolColors.pop();
          })
          .attr("preserveAspectRatio", "none")
          .attr("rx", 6)
          .attr("ry", 6)
          .attr("width", function (d) { return d.symbolWidth; })
          .attr("height", function (d) { return d.symbolHeight; });

        photosSelection.on("mouseover", mouseOverPhotoEffect);
        photosSelection.on("mouseout", mouseOutPhotoEffect);

        // Init title visualization.
        title = svg.append("text")
          .attr("class", "title")
          .attr("x", -500) // so, invisible.
          .attr("y", config.tittlePadding)
          .text("");

        // Finally, use the force!
        force.start();

        // Move something from time to time. 
        autoMove();
      };
  // ============================================================================

  processPhotosData(config.galleryData);
  // Call initialization.
  init();
  // Preload photos.
  preloadImages();
};
