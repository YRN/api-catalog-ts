init:
	@npm install --save-dev express
	@npm install mysql2

compile:
	@tsc
run:
	@node dist/server.js