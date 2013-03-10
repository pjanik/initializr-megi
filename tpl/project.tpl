<div class="container">
	<div class="row">
		<div class="span12">
			<h2><%= title %></h2>
		</div>
	</div>
	<div class="row">
		<div class="project-gallery span12">
			<% for (var i = 1; i <= imagesCount; i++) { %>
			<a data-toggle="lightbox" href="#lbox-<%= i %>" style="width: 21%; margin: 1%" class="thumbnail">
				<img src="portfolio/<%= dir %>/<%= i %>.jpg" alt="">
			</a>
			<% } %>
		</div>
	</div>
	<div class="row">
		<div class="span12">
			<p><%= text %></p>
		</div>
	</div>
	<% for (var i = 1; i <= imagesCount; i++) { %>
		<div id="lbox-<%= i %>" class="lightbox hide fade" tabindex="-1" role="dialog" aria-hidden="true">
		    <div class='lightbox-header'>
				<button type="button" class="close" data-dismiss="lightbox" aria-hidden="true">&times;</button>
			</div>
		    <div class='lightbox-content'>
		        <img src="portfolio/<%= dir %>/<%= i %>.jpg">
		    </div>
		</div>
	<% } %>
</div>
