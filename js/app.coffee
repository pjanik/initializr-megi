###
Portfolio JSON data. Loaded using AJAX. 
First one is raw data, second is indexed by directory (dir property).
###
portfolioData = null
portfolio = {}
###
Define Sammy.js application.
###
app = $.sammy "#page-content", ->

  # Simple templating system.
  @use Sammy.Template, "tpl"

  # Define a "get" route that will be triggered at "#/path".
  @get "#/project/:dir", ->
    $("#gallery-container").hide()
    dir = @params.dir
    $.get "portfolio/#{dir}/long.txt", (description) =>
      @partial "tpl/project.tpl", 
        dir: dir
        imagesCount: portfolio[dir].imagesCount
        title: portfolio[dir].title
        text: description
      , ->
        $(".project-gallery img").load ->
          $(".project-gallery").isotope
            layoutModeString: "masonry"


  @get "/", ->
    @partial "tpl/gallery.tpl", {}, ->
      $("#page-content").html ""
      $("#gallery-container").fadeIn()


# Start Sammy.js application when portfolio JSON and page are loaded.
$.get "portfolio/index.json", (data) -> 
  portfolioData = data
  for project in data
    portfolio[project.dir] = project 
  $ ->
    new CoolGallery "#gallery-container",
      galleryData: portfolioData
      galleryDir: "portfolio"
      realWidth: "100%"
      realHeight: $(window).height() * 0.66
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

    app.run()



