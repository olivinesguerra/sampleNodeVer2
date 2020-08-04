[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# Environment

Node: 13.7 (Please use nvm)

If the database is already setup:

Please insert this on oauth_clients:
1.  { client_id: website, client_secret: "secretsite", "grant_types": "authorization", "name": "web, "redirect": "0.0.0.0", "scope": "admin"}
2. { client_id: mobile, client_secret: "secretmobile", "grant_types": "authorization", "name": "mobile, "redirect": "http://localhost/cb", "scope": "mobile"}

# sampleAPI
This is a [Moleculer](https://moleculer.services/)-based microservices project. Generated with the [Moleculer CLI](https://moleculer.services/docs/0.14/moleculer-cli.html).

## Usage
Start the project with `npm run dev` command. 
After starting, open the http://localhost:3000/ URL in your browser. 
On the welcome page you can test the generated services via API Gateway and check the nodes & services.

## Services
- **api**: API Gateway services
- **auth**: Sample service with `hello` and `welcome` actions.
- **test1**: Sample DB service. 
- **test2**: Sample DB service. 
- **test3**: Sample DB service. 

## Mixins
- **db.mixin**: Database access mixin for services. Based on [moleculer-db](https://github.com/moleculerjs/moleculer-db#readme)


## Useful links

* Moleculer website: https://moleculer.services/
* Moleculer Documentation: https://moleculer.services/docs/0.14/

## NPM scripts

- `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `npm run lint`: Run ESLint
- `npm run ci`: Run continuous test mode with watching
- `npm test`: Run tests & generate coverage report
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose
