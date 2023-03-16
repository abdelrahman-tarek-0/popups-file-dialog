const exec = require("util").promisify(require("child_process").exec);
const path = require("path");
const fs = require("fs");

exports.config = {
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

const commandBuilder = (command = "", opts) => {
    command = this.config.availableCommand[command];
  
    let final = "";
    if (command.name === this.config.availableCommand.open.name) {
      opts.startPath = path.resolve(opts?.startPath.replaceAll(" ", "-"));
      opts?.allowMultipleSelects
        ? (opts.allowMultipleSelects = 1)
        : (opts.allowMultipleSelects = 0);
      final = `${this.config.vendorPath} ${command.name} `;
  
      // title
      final += `${command.flags.title.name} \`${
        opts?.title.replaceAll(" ", "`") || command.flags.title.defaultValue
      } `;
  
      // startPath
      final += `${command.flags.startPath.name} ${
        opts?.startPath || command.flags.startPath.defaultValue
      } `;
  
      // filterPatterns
      final += `${command.flags.filterPatterns.name} ,${
        opts?.filterPatterns.join(",") ||
        command.flags.filterPatterns.defaultValue
      } `;
  
      // filterPatternsDescription
      final += `${command.flags.filterPatternsDescription.name} \`${
        opts?.filterPatternsDescription.replaceAll(" ", "`") ||
        opts?.filterPatterns.join(",") ||
        "*"
      } `;
  
      // allowMultipleSelects
      final += `${command.flags.allowMultipleSelects.name} ${
        opts?.allowMultipleSelects ||
        command.flags.allowMultipleSelects.defaultValue
      } `;
    }
  
    if (command.name === this.config.availableCommand.messageBox.name) {
      final = `${this.config.vendorPath} ${command.name} `;
  
      // title
      final += `${command.flags.title.name} \`${
        opts?.title.replaceAll(" ", "`") || command.flags.title.defaultValue
      } `;
  
      // message
      final += `${command.flags.message.name} \`${
        opts?.message.replaceAll(" ", "`") || command.flags.message.defaultValue
      } `;
  
      // dialogType
      final += `${command.flags.dialogType.name} ${
        command.flags.dialogType.typesMapper[opts?.dialogType] ||
        command.flags.dialogType.defaultValue
      } `;
  
      // iconType String
      final += `${command.flags.iconType.name} ${
        opts?.iconType || command.flags.iconType.defaultValue
      } `;
  
      // defaultSelected
      final += `${command.flags.defaultSelected.name} ${
        command.flags.defaultSelected.typesMapper[opts?.defaultSelected] ||
        command.flags.defaultSelected.default
      } `;
    }
  
    return final;
  };

/**
 * 
 * @param {Object} opts 
 * @param {String} opts.title -description: "the title of the popup" -default: "open"
 * @param {String} opts.startPath -description: "the start path of the popup" -default: "./"
 * @param {Array} opts.filterPatterns -description: "the filter patterns of the popup {*.exe,*.txt}" -default: ["*"]
 * @param {String} opts.filterPatternsDescription -description: "the filter patterns description of the popup {exe files,txt files}" -default: ""
 * @param {Boolean} opts.allowMultipleSelects -description: "allow multiple selects of files" -default: false
 * @returns {Array} -description: "the selected files" -ex: ["C:\\Users\\user\\Desktop\\file.exe"]
 * @throws {Error} -description: "if no files selected"
 */
exports.openFile = async (
  opts = {
    title: "",
    startPath: "",
    filterPatterns: [],
    filterPatternsDescription: "",
    allowMultipleSelects: 0,
  }
) => {
  let { stdout: out, stderr } = await exec(commandBuilder("open", opts));
  if (stderr) throw new Error(err);

  if (out.includes("-066944")) {
    const err = files?.slice(files?.indexOf("-066944"))?.split("~")?.at(1);
    throw new Error(err);
  }
  files = out
    ?.slice(out?.indexOf("-066945"))
    ?.split("~")
    ?.at(1)
    ?.split("|")
    .map((p) => path.resolve(p));

  if (files.length === 0) throw new Error("no files selected");

  return files;
};