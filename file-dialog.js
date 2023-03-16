const exec = require("util").promisify(require("child_process").exec);
const path = require("path");
const fs = require("fs");

const conf = {
    vendorPath: path.join(__dirname,"lib","vendors", "bin",`${process.platform}${process.platform==="win32"?".exe":""}`),
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
      messageBox: {
        name: "-message",
        flags: {
          title: {
            name: "--title",
            defaultValue: "message",
          },
          message: {
            name: "--message",
            defaultValue: "message",
          },
          dialogType: {
            name: "--type-D",
            typesMapper: {
              ok: "ok",
              okCancel: "okcancel",
              yes: "yes",
              yesNo: "yesno",
              yesNoCancel: "yesnocancel",
            },
            defaultValue: "ok", // ok okcancel yesno yesnocancel
          },
          iconType: {
            name: "--type-I",
            types: ["info", "warning", "error", "question"],
            defaultValue: "info", // ok okcancel yesno yesnocancel
          },
  
          defaultSelected: {
            name: "--default",
            typesMapper: {
              no: 2,
              cancel: 0,
              yes: 1,
              ok: 1,
            },
            default: 1,
          },
        },
      },
    },
  };