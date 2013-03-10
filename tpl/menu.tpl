<% for (var i = 0; i < projects.length; i++) { %>
	<% var proj = projects[i]; %>
	<li><a href="#/project/<%= proj.dir %>"><%= proj.name %></a></li>
<% } %>