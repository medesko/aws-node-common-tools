# sls-common-tools
These are all common utilities

## Installation 
```sh
npm install sls-common-tools --save
```

## Usage

### TypeScript
```typescript
import { getPlural } from 'sls-common-tools';
console.log(getPlural('Goose'))
console.log(getSingular('Guns'))
```
```sh
Output should be 'Geese'
Output should be 'Gun'
```

## Test 
```sh
npm run test
```
