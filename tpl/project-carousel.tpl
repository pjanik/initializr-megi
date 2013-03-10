<div class="container">
	<div class="row">
		<div class="span12">
			<h2><%= title %></h2>
		</div>
	</div>
	<div class="row">
		<div class="span12">
			<div id="myCarousel" class="carousel slide">
			  <ol class="carousel-indicators">
			  	<% for (var i = 1; i <= imagesCount; i++) { %>
			    <li data-target="#myCarousel" data-slide-to="<%= i - 1 %>" <% if (i === 1) { %> class="active" <% } %>></li>
			    <% } %>
			  </ol>
			  <!-- Carousel items -->
			  <div class="carousel-inner">
			  	<% for (var i = 1; i <= imagesCount; i++) { %>
			  	<div class= <% if (i === 1) { %> "item active" <% } else { %> "item" <% } %>>
		    		<img src="portfolio/<%= dir %>/<%= i %>.jpg" alt="" style="height: 300px; margin: auto">
				</div>
				<% } %>
			  </div>
			  <!-- Carousel nav -->
			  <a class="carousel-control left" href="#myCarousel" data-slide="prev">&lsaquo;</a>
			  <a class="carousel-control right" href="#myCarousel" data-slide="next">&rsaquo;</a>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="span12">
			<p><%= text %></p>
		</div>
	</div>
</div>

