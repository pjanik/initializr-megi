###
Define Sammy.js application.
###
app = $.sammy "#page-content", ->

  # Simple templating system.
  @use Sammy.Template, "tpl"

  # Define a "get" route that will be triggered at "#/path".
  @get "#/project/:name", ->

  @get "/", ->
    @partial "tpl/gallery.tpl", {}, ->
      new CoolGallery "#gallery-container", 
        galleryDir: "portfolio"
        realWidth: "100%"
        realHeight: "75%"
        columns: 3
        width: 1000
        height: 600
        paddingTop: 10
        paddingBottom: 0
        paddingLeft: 10
        paddingRight: 10
        titleFromLeft: 10
        tittlePadding: 20

        photosData: 
          width: 300
          height: 300
          symbolWidth: 190
          symbolHeight: 120
          charge: -100
          z: 1

        repulsionMult: 130
        hrefFunc: (d) ->
          "#/project/#{d.dir}"

# Start Sammy.js application when page is loaded.
$ ->
  app.run()
