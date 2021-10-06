// Not yet implemented

const { c, cpp, node, python, java } = require('compile-run')

const commands = {
    compile: async (message, arg2) => {
       if (arg2.startsWith('```js') || arg2.startsWith('```javascript') ) {
         node.runSource(message.content.replace(/```/g, '').replace(/^.+\n/, ''))
         .then(res => {
           message.channel.send('**Output:** \n\n`'+res.stdout+'`')
         })
       } else if (arg2.startsWith('```java')) {
         java.runSource(message.content.replace(/```/g, '').replace(/^.+\n/, ''))
         .then(res => {
           message.channel.send('**Output:** \n\n`'+res.stdout+'`')
         })
       } else if (arg2.startsWith('```c')) {
         c.runSource(message.cjsontent.replace(/```/g, '').replace(/^.+\n/, ''))
         .then(res => {
           message.channel.send('**Output:** \n\n`'+res.stdout+'`')
         })
       } else if (arg2.startsWith('```cpp') || arg2.startsWith('```c++')) {
         cpp.runSource(message.content.replace(/```/g, '').replace(/^.+\n/, ''))
         .then(res => {
           message.channel.send('**Output:** \n\n`'+res.stdout+'`')
         })
       } else if (arg2.startsWith('```py') || arg2.startsWith('```python') ) {
         python.runSource(message.content.replace(/```/g, '').replace(/^.+\n/, ''))
         .then(res => {
           message.channel.send('**Output:** \n\n`'+res.stdout+'`')
         })
       }
    }
}

module.exports = commands