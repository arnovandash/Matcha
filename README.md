# Matcha

Requirements:
	node:	(Mac)	brew install node
	 		(Linux)	sudo apt install nodejs

	neo4j:	(Mac)	?
			(Linux)	wget -O - https://debian.neo4j.org/neotechnology.gpg.key | sudo apt-key add - && echo 'deb http://debian.neo4j.org/repo stable/' | sudo tee /etc/apt/sources.list.d/neo4j.list && sudo apt update && sudo apt install neo4j

Get required packages:
	'npm install' from the root directory of the project
	NOTE: node_modules has been ignored from git, so it will not be pushed. This is intentional; it's a big folder. Include any new packages in the packages.json and inform the team of the new required packages

Start the server:
	'./bin/www' from the root directory of the project