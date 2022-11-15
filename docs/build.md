# demo

npx tsc --build

 node packages/cli/dist/index.js


## npm monorepo

first steps how the monorepo was set up

https://daveiscoding.com/nodejs-typescript-monorepo-via-npm-workspaces#heading-initialize-the-project

```bash
npm init -y

npm init -y --scope @rsdl-ts -w packages/rsdl
npm init -y --scope @rsdl-ts -w packages/cli

npm install @rsdl-ts/rsdl -w @rsdl-ts/cli
```
