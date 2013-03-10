<div class="container">
	<div class="row">
		<div class="span12">
			<h2><%= title %></h2>
		</div>
	</div>
	<div class="row">
		<div class="project-gallery span12">
			<% for (var i = 1; i <= imagesCount; i++) { %>
			<a href="portfolio/<%= dir %>/<%= i %>.jpg" style="width: 21%; margin: 1%" class="thumbnail">
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
</div>
