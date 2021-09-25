# jdoodleCodeRunner

Run programs using jdoodle compiler

## Installation

```js
# using npm
npm install jdoodlecoderunner

# using yarn
yarn add jdoodlecoderunner
```

## Usage

```js
# using require
const codeRunner = require('jdoodlecoderunner');

# using import
import codeRunner from 'jdoodlecoderunner';
```

## Example

### Using promises:

```js
codeRunner.runCode(
 fileUrl,
 python3,
 3,
 41,
 clientId,
 clientSecret
).then((output) => console.log(output));
```

### Using async/await:

```js
const output = await codeRunner.runCode(
 fileUrl,
 python3,
 3,
 41,
 clientId,
 clientSecret
)
console.log(output)
```
refer https://github.com/Pai026/coderBot/

