# Problem solving
#### Assigment
Write a program that solves the most suitable (with most power) link station for a device at given
point [x,y].  
Please make this project as complete as you think it should be to be maintainable in the long
term by more than one maintainer. ​Provide instructions how to run the solution or if applicable
how to access a deployed running version.  
This problem can be solved in 2-dimensional space. Link stations have reach and power.
A link station’s power can be calculated:


```bash
power = (reach - device's distance from linkstation)^2
if distance > reach, power = 0
```
Program should output following line:

`Best link station for point x,y is x,y with power z`  
or:  
`No link station within reach for point x,y`  

#### Request

Link stations​ are located at points `(x, y)​` and have reach `​(r)` `([x, y, r])​`:  
```bash
[[0, 0, 10],[20, 20, 5],[10, 0, 12]]  
```

Print out function output from ​points​ `​(x, y)`: 
```bash
(0,0), (100, 100), (15,10)​ and ​(18, 18)
```

## Requirements
To create the implementation, you must have:
 * [Node.js](https://nodejs.org) `v6.4.0`+ installed (either system-wide or through [`nvm`](https://github.com/creationix/nvm) or similar). No global modules are required as all the necessary modules are locally installed.
 

## Setup
Before use the `Link stations` module, you must execute the following command to set up all the locally installed modules within the `node_modules` directory:

```bash
npm run setup
```

after that if you want to see the test case use the following command to run the [`Karma`](https://karma-runner.github.io) test runner (which includes all the tests):
```bash
npm test
```

## Tools  
The tools used for this task are :
* git commands, such as `git clone` ecc...
* Node.js scripts, such as e.g. `npm test`
* [`babel`](https://babeljs.io) 
* [`Karma`](https://karma-runner.github.io) for testing JavaScript code
* [`TypeScript`](https://www.typescriptlang.org/)  for adds common concepts such as classes, modules, interfaces, generics and (optional) static typing to JavaScript





