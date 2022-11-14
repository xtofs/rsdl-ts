# RSDL library in



## npm monorepo
https://daveiscoding.com/nodejs-typescript-monorepo-via-npm-workspaces#heading-initialize-the-project


first steps how the monorepo was set up
```bash

npm init -y

npm init -y --scope @rsdl-ts -w packages/rsdl
npm init -y --scope @rsdl-ts -w packages/cli

npm install @rsdl-ts/rsdl -w @rsdl-ts/cli 

```