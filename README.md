# Popups File Dialog

_This is a simple file dialog 0 dependencies for windows, linux and macos.<br>build on library in c language called [tinyfiledialogs](https://github.com/native-toolkit/libtinyfiledialogs)._<br>
_sence it is build on tinyfiledialogs whitch is build on c, so this lib is super fast_

<br>
so if this library is build on another library, so wtf is this lib doing?<br>
<br>
okay listen, sense node is not natively have a file dialog<br>
so i build this lib as a wrapper for the (tinyfiledialogs library build in c).<br>
i worked 2 days straight to make the cli version of the tinyfiledialogs library.<br>
and i only done 2 methods of the library.<br>
after that i build this lib as a wrapper for the cli version of the tinyfiledialogs library.<br>
<br>
still have a lot of work to do only done 2 functions (open dialog file explorer, and promote message box).<br>
<br>
and only build the lib for windows<br>
i am too lazy to download OS besides windows, so i can't compile and test it on linux and macos.
but in theory it should work.
feel free to compile and test it on linux and macos and send me a pull request. with the compiled binaries.
<br>
also feel free to contribute to this lib, i am not a pro in c, so i am sure there is a lot of bugs in this lib.<br>
i can really use some help.

<hr>

# Installation

```bash
npm install popups-file-dialog
```

```bash
yarn add popups-file-dialog
```

or

```bash
git clone https://github.com/native-toolkit/popups-file-dialog.git
cd popups-file-dialog
```

# Usage

```js
const fileDialog = require("../file-dialog");

const main = async () => {
  console.log(fileDialog.config.vendorPath); // check for the path of the vendor folder if the os is supported
  const result = await fileDialog.openFile({
    title: "Open File",
    startPath: "C:\\Users\\",
    filterPatterns: ["*.exe", "*.txt"],
    filterPatternsDescription: "exe files,txt files",
    allowMultipleSelects: true,
  });
  console.log(result);

  const result2 = await fileDialog.messageBox({
    title: "Message Box",
    message: "Hello World",
    dialogType: "yesNoCancel",
    iconType: "info",
    defaultSelected: "yes",
  });
  console.log(result2);
};
main();
```

# table of content
- [Popups File Dialog](#popups-file-dialog)
- [Installation](#installation)
- [Usage](#usage)
- [table of content](#table-of-content)
- [API](#api)
  - [fileDialog.config](#filedialogconfig)
  - [fileDialog.openFile(options)](#filedialogopenfileoptions)
    - [_example_ :](#example-)
    - [options](#options)
  - [fileDialog.messageBox(options)](#filedialogmessageboxoptions)
    - [_example_ 1:](#example-1)
    - [_example_ 2:](#example-2)
    - [_example_ 3:](#example-3)
    - [options](#options-1)

# API

## fileDialog.config

super important, and big object, that contain
all the config of the lib
all the flags with the commands
and the path of the vendor folder
part of it:

```js
config = {
  vendorPath: path.join(
    __dirname,
    "lib",
    "vendors",
    "bin",
    `${process.platform}${process.platform === "win32" ? ".exe" : ""}`
  ),
  availableCommand: {
    open: {
      name: "-open-file",
      flags: {
        title: {
          name: "--title",
          defaultValue: "open",
        },
        startPath: {
          name: "--startPath",
          defaultValue: path.resolve("./"),
        },
        filterPatterns: {
          name: "--filterPatterns",
          defaultValue: "*",
        },
        filterPatternsDescription: {
          name: "--filterPatternsDescription",
          defaultValue: "",
        },
        allowMultipleSelects: {
          name: "--allowMultipleSelects",
          defaultValue: "0",
        },
      },
    },
  },
};
```
<hr>

## fileDialog.openFile(options)
open file dialog menu

### _example_ :
multiple select example:
```js
const result = await fileDialog.openFile({
        title: "Open File",
        startPath: "./",
        filterPatterns: ["*"],
        filterPatternsDescription: "all files",
        allowMultipleSelects: true
    })
    console.log(result);

```
image on windows 10:

![multiple select](https://cdn.discordapp.com/attachments/778971669879455774/1085988242773528717/image.png)

expected result:
```js
[
  'C:\\Users\\pc\\Desktop\\workingdir\\projects\\popups-file-dialog\\.gitignore',
  'C:\\Users\\pc\\Desktop\\workingdir\\projects\\popups-file-dialog\\.npmignore',
  'C:\\Users\\pc\\Desktop\\workingdir\\projects\\popups-file-dialog\\file-dialog.js'
]
```

### options
| option | type | default | description         |example|
| ---    | ---  | ---     | ---                 |---    |
| title  |string| "open"  | title of the dialog | "Open File" |
| startPath | string | path.resolve("./") | start path of the dialog | "C:\\Users\\" |
| filterPatterns | string[] | ["*"] | filter patterns of the dialog | ["\*.exe", "\*.txt"] |
| filterPatternsDescription | string | "" | filter patterns description of the dialog | "exe files,txt files" |
| allowMultipleSelects | boolean | false | allow multiple selects of the dialog | true |


<hr>

## fileDialog.messageBox(options)
promote message box

### _example_ 1:
```js
const result = await fileDialog.messageBox({
        title: "Message Box",
        message: "Hello World",
        dialogType: "yesNoCancel",
        iconType: "info",
        defaultSelected: "yes"
    })
    console.log(result);
```
image on windows 10:

![message box](https://cdn.discordapp.com/attachments/778971669879455774/1085990463812677732/image.png)

expected result:
```js
yes -> 1
no -> 2
cancel -> 0
```

### _example_ 2:
```js
const result = await fileDialog.messageBox({
        title: "Message Box",
        message: "Hello World",
        dialogType: "okCancel",
        iconType: "info",
        defaultSelected: "ok"
    })
    console.log(result);
```
expected result:
```js
ok -> 1
cancel -> 0
```
### _example_ 3:

```js
const result = await fileDialog.messageBox({
        title: "Message Box",
        message: "Hello World",
        dialogType: "yesNo",
        iconType: "info",
        defaultSelected: "ok"
    })
    console.log(result);
```
expected result:
```js
yes -> 1
no -> 0
```

### options
| option | type | default | description         |example| available options |
| ---    | ---  | ---     | ---                 |---    | --- |
| title  |string| "message"  | title of the dialog | "Message Box" | |
| message | string | "message" | message of the dialog | "Hello World" | |
| dialogType | string | "ok" | dialog type of the dialog | "okCancel" | "ok", "okCancel", "yesNo", "yesNoCancel" |
| iconType | string | "info" | icon type of the dialog | "info" | "info", "warning", "error","question" |
| defaultSelected | string | "ok" | default selected of the dialog | "ok" | "ok", "cancel", "yes", "no" |

<hr>







