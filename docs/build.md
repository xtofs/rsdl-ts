# demo

```bash
npm run demo -- paths
```

## npm monorepo

first steps used to set up the monorepo

https://daveiscoding.com/nodejs-typescript-monorepo-via-npm-workspaces#heading-initialize-the-project

```bash
npm init -y

npm init -y --scope @rsdl-ts -w packages/rsdl
npm init -y --scope @rsdl-ts -w packages/demo

npm install @rsdl-ts/rsdl -w @rsdl-ts/demo
```
