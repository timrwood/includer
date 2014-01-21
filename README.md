Includer
========

> Concat javascript with include statements.

## Add `include` statements to your js files.

```js
// a.js
var a = 1;

// b.js
var b = 2;

// c.js
include('./a');
include('./b');
```

## Run Includer.

```js
includer('c.js', opts, function (err, src) {
	fs.writeFile('out.js', src, 'utf8');
});
```

```js
// out.js
(function (){
(function (){
var a = 1;
}());
(function (){
var b = 2;
}());
}());
```
