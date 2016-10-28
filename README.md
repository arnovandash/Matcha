# Matcha

First note: for the Macs, you have to create the project folder in a local folder, so the goinfre, otherwise neo4j can't access the database. linux shouldn't have this problem

Requirements:
	node:	(Mac)	brew install node
	 		(Linux)	sudo apt install nodejs

	neo4j:	(Mac)	Install java from the Managed software center, then 'brew install neo4j'
			(Linux)	wget -O - https://debian.neo4j.org/neotechnology.gpg.key | sudo apt-key add - && echo 'deb http://debian.neo4j.org/repo stable/' | sudo tee /etc/apt/sources.list.d/neo4j.list && sudo apt update && sudo apt install neo4j

Config changes:
	Neo4j:
		Config file: neo4j.conf
			Mac: ~/.brew/Cellar/neo4j/3.0.6/libexec/conf/neo4j.conf
			Linux: /etc/neo4j/conf/neo4j.conf (not nessessarry to change this)
		Uncomment line 9, change the location (not inside the project folder, this will create merge issues, rather export csv to sync databases):
			eg: dbms.directories.data=/nfs/zfs-student-6/users/adippena/goinfre/matcha_db

		When you log into neo4j for the first time, it will ask you to change the password, change it to 'sparewheel'. That way all of us have the same login for the database

Get required packages:
	'npm install' from the root directory of the project

	NOTE: node_modules has been ignored from git, so it will not be pushed. This is intentional: it's a big folder. Include any new packages in the packages.json and inform the team of the new required packages. use --save with any new packages to save them to the package file automatically. Please try and use express versions of the packages if possible

Start the server:
	make sure that apache is stopped
	'npm start' or 'npm test' (server restarts when files change) from the root directory of the project
	'npm start' from the root directory of the project (you will need to install nodemon: 'npm install -g nodemon')