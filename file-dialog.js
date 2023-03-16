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
    command = conf.availableCommand[command];
  
    let final = "";
    if (command.name === conf.availableCommand.open.name) {
      opts.startPath = path.resolve(opts?.startPath.replaceAll(" ", "-"));
      opts?.allowMultipleSelects
        ? (opts.allowMultipleSelects = 1)
        : (opts.allowMultipleSelects = 0);
      final = `${conf.vendorPath} ${command.name} `;
  
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
  
    if (command.name === conf.availableCommand.messageBox.name) {
      final = `${conf.vendorPath} ${command.name} `;
  
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

  if (file.length === 0) throw new Error("no files selected");

  return file;
};
