const exec = require('util').promisify(require('child_process').exec)
const path = require('path')
const fs = require('fs')

// to fix the white space issue
const pathFixer = (pathString = '') => {
   const prefix = pathString.includes('/') ? '/' : '\\'

   pathString = pathString
      .replaceAll(`${prefix + prefix}`, prefix)
      .split(prefix)
      .map((p) => {
         return `${p.includes(' ') ? `"${p}"` : p}`
      })
      .join(prefix)

   return path.resolve(pathString)
}

exports.config = {
   vendorPath: pathFixer(
      path.join(
         __dirname,
         'lib',
         'vendors',
         'bin',
         `${process.platform}${process.platform === 'win32' ? '.exe' : '.app'}`
      )
   ),
   availableCommand: {
      openFile: {
         name: '-open-file',
         flags: {
            title: {
               name: '--title',
               defaultValue: 'open',
            },
            startPath: {
               name: '--startPath',
               defaultValue: path.resolve('./'),
            },
            filterPatterns: {
               name: '--filterPatterns',
               defaultValue: '*',
            },
            filterPatternsDescription: {
               name: '--filterPatternsDescription',
               defaultValue: '',
            },
            allowMultipleSelects: {
               name: '--allowMultipleSelects',
               defaultValue: '0',
            },
         },
      },
      saveFile: {
         name: '-save-file',
         flags: {
            title: {
               name: '--title',
               defaultValue: 'save',
            },
            startPath: {
               name: '--startPath',
               defaultValue: path.resolve('./'),
            },
            filterPatterns: {
               name: '--filterPatterns',
               defaultValue: '*',
            },
            filterPatternsDescription: {
               name: '--filterPatternsDescription',
               defaultValue: '',
            },
         },
      },
      openDirectory: {
         name: '-open-folder',
         flags: {
            title: {
               name: '--title',
               defaultValue: 'message',
            },
         },
      },
      messageBox: {
         name: '-message',
         flags: {
            title: {
               name: '--title',
               defaultValue: 'message',
            },
            message: {
               name: '--message',
               defaultValue: 'message',
            },
            dialogType: {
               name: '--type-D',
               typesMapper: {
                  ok: 'ok',
                  okCancel: 'okcancel',
                  yes: 'yes',
                  yesNo: 'yesno',
                  yesNoCancel: 'yesnocancel',
               },
               defaultValue: 'ok', // ok okcancel yesno yesnocancel
            },
            iconType: {
               name: '--type-I',
               types: ['info', 'warning', 'error', 'question'],
               defaultValue: 'info', // ok okcancel yesno yesnocancel
            },

            defaultSelected: {
               name: '-default',
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
}

const commandBuilder = (command = '', opts) => {
   command = this.config.availableCommand[command]

   let final = ''
   if (command.name === this.config.availableCommand.openFile.name) {
      opts?.allowMultipleSelects
         ? (opts.allowMultipleSelects = 1)
         : (opts.allowMultipleSelects = 0)

      final = `${this.config.vendorPath} ${command.name} `

      // title
      final += `${command.flags.title.name} "${
         opts?.title || command.flags.title.defaultValue
      }" `

      // startPath
      final += `${command.flags.startPath.name} "${
         opts?.startPath || command.flags.startPath.defaultValue
      }/" `

      // filterPatterns
      final += `${command.flags.filterPatterns.name} ",${
         opts?.filterPatterns?.join(',') ||
         command.flags.filterPatterns.defaultValue
      }" `

      // filterPatternsDescription
      final += `${command.flags.filterPatternsDescription.name} "${
         opts?.filterPatternsDescription ||
         command.flags.filterPatternsDescription.defaultValue
      }" `

      // allowMultipleSelects
      final += `${command.flags.allowMultipleSelects.name} ${
         opts?.allowMultipleSelects ||
         command.flags.allowMultipleSelects.defaultValue
      } `
   }

   if (command.name === this.config.availableCommand.saveFile.name) {
      final = `${this.config.vendorPath} ${command.name} `

      // title
      final += `${command.flags.title.name} "${
         opts?.title || command.flags.title.defaultValue
      }" `

      // startPath
      final += `${command.flags.startPath.name} "${
         opts?.startPath || command.flags.startPath.defaultValue
      }" `

      // filterPatterns
      final += `${command.flags.filterPatterns.name} ",${
         opts?.filterPatterns?.join(',') ||
         command.flags.filterPatterns.defaultValue
      }" `

      // filterPatternsDescription
      final += `${command.flags.filterPatternsDescription.name} "${
         opts?.filterPatternsDescription ||
         command.flags.filterPatternsDescription.defaultValue
      }" `
   }

   if (command.name === this.config.availableCommand.openDirectory.name) {
      final = `${this.config.vendorPath} ${command.name} `

      // title
      final += `${command.flags.title.name} "${
         opts?.title || command.flags.title.defaultValue
      }" `
   }

   if (command.name === this.config.availableCommand.messageBox.name) {
      final = `${this.config.vendorPath} ${command.name} `

      // title
      final += `${command.flags.title.name} "${
         opts?.title || command.flags.title.defaultValue
      }" `

      // message
      final += `${command.flags.message.name} "${
         opts?.message || command.flags.message.defaultValue
      }" `

      // dialogType
      final += `${command.flags.dialogType.name} ${
         command.flags.dialogType.typesMapper[opts?.dialogType] ||
         command.flags.dialogType.defaultValue
      } `

      // iconType String
      final += `${command.flags.iconType.name} ${
         opts?.iconType || command.flags.iconType.defaultValue
      } `

      // defaultSelected
      final += `${command.flags.defaultSelected.name} ${
         command.flags.defaultSelected.typesMapper[opts?.defaultSelected] ||
         command.flags.defaultSelected.default
      } `
   }

   return final
}

/**
 *
 * @param {Object} opts
 * @param {String} opts.title "the title of the popup" default: "open"
 * @param {String} opts.startPath "the start path of the popup" default: "./"
 * @param {Array} opts.filterPatterns "the filter patterns of the popup {*.exe,*.txt}" default: ["*"]
 * @param {String} opts.filterPatternsDescription "the filter patterns description of the popup" default: ""
 * @param {Boolean} opts.allowMultipleSelects "allow multiple selects of files" default: false
 * @returns {Array} "the selected files" ex: ["C:\\Users\\user\\Desktop\\file.exe"]
 * @throws {Error} "if no files selected"
 */
exports.openFile = async (
   opts = {
      title: '',
      startPath: '',
      filterPatterns: [],
      filterPatternsDescription: '',
      allowMultipleSelects: 0,
   }
) => {
   let { stdout: out, stderr } = await exec(commandBuilder('openFile', opts))
   if (stderr) throw new Error(stderr)

   if (out.includes('-066944')) {
      const err = out?.slice(out?.indexOf('-066944'))?.split('~')?.at(1)
      throw new Error(err)
   }
   files = out
      ?.slice(out?.indexOf('-066945'))
      ?.split('~')
      ?.at(1)
      ?.split('|')
      .map((p) => path.resolve(p))

   if (files.length === 0) throw new Error('no files selected')

   return files
}

/**
 * @param {Object} opts
 * @param {String} opts.title "the title of the popup" default: "message"
 * @returns {String} "the selected directory" ex: "C:\\Users\\user\\Desktop\\
 * @throws {Error} "if no directory selected"
 */
exports.openDirectory = async (opts = { title: '' }) => {
   let { stdout: out, stderr } = await exec(
      commandBuilder('openDirectory', opts)
   )
   if (stderr) throw new Error(stderr)

   if (out.includes('-066944')) {
      const err = out?.slice(out?.indexOf('-066944'))?.split('~')?.at(1)
      throw new Error(err)
   }
   folder = out?.slice(out?.indexOf('-066945'))?.split('~')?.at(1)

   return folder
}

/**
 * @param {Object} opts
 * @param {String} opts.title "the title of the popup" default: "message"
 * @param {String} opts.message "the message of the popup" default: "message"
 * @param {String} opts.dialogType "the dialog type of the popup {ok,okCancel,yesNo,yesNoCancel}" default: "ok"
 * @param {String} opts.iconType "the icon type of the popup {info,warning,error,question} with sounds" default: "info"
 * @param {String} opts.defaultSelected "the default selected button of the popup {no,cancel,yes,ok}" default: "ok"
 * @returns {Number} "the selected button {yes/ok=1,no=2,cancel/no=0}" -ex: 1
 */
exports.messageBox = async (
   opts = {
      title: '',
      message: '',
      dialogType: '',
      iconType: '',
      defaultSelected: 0,
   }
) => {
   let { stdout: answer, stderr } = await exec(
      commandBuilder('messageBox', opts)
   )
   if (stderr) throw new Error(stderr)

   if (answer.includes('-066944')) {
      const err = answer?.slice(answer?.indexOf('-066944'))?.split('~')?.at(1)
      throw new Error(err)
   }
   answer = Number(
      answer // yes/ok=1 no=2 cancel=0
         ?.slice(answer?.indexOf('-066945'))
         ?.split('~')
         ?.at(1)
   )
   return answer
}

/**
 * @param {Object} opts
 * @param {String} opts.title "the title of the popup" default: "save"
 * @param {String} opts.startPath "the start path of the popup and the savedFile name" default: "./default.txt"
 * @param {Array} opts.filterPatterns "the filter patterns of the popup ex:{*.exe,*.txt}" default: ["*"]
 * @param {String} opts.filterPatternsDescription "the filter patterns description of the popup" default: ""
 * @returns {String} "the saved file" ex: "C:\\Users\\user\\Desktop\\default.txt"
 * @throws {Error} "if no file saved"
 */
exports.saveFile = async (
   opts = {
      title: '',
      startPath: '',
      filterPatterns: [],
      filterPatternsDescription: '',
   }
) => {
   let { stdout: out, stderr } = await exec(commandBuilder('saveFile', opts))
   if (stderr) throw new Error(stderr)

   if (out.includes('-066944')) {
      const err = out?.slice(out?.indexOf('-066944'))?.split('~')?.at(1)
      throw new Error(err)
   }
   file = out?.slice(out?.indexOf('-066945'))?.split('~')?.at(1)

   return file
}

/* this function is for my own personal use, i did changed some of the c lib core functionally to match my needs */
exports['custom-input-number-password-we-login'] = async () => {
   let { stdout: answer, stderr } = await exec(
      `${this.config.vendorPath} -custom-input-number-password-we-login`
   )
   if (stderr) throw new Error(stderr)

   if (answer.includes('-066945')) {
      answer = answer.replace('-066945 ', '').split('|')
      if (!answer?.at(0)) throw new Error('no number entered')
      if (!answer?.at(1)) throw new Error('no password entered')

      return {
         number: `${answer[0]}`,
         password: `${answer[1]}`,
      }
   }
   throw new Error(answer)
}
