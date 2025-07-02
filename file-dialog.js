// @ts-check

const exec = require('util').promisify(require('child_process').exec)
const path = require('path')
// const fs = require('fs')

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

/**
 * @typedef {Object} Config
 * @prop {string} vendorPath The path to the library executable. It is set according to the operating system.
 * @prop {Object} availableCommand The available commands and their attributes.
 * @prop {AvailableCommandItem} availableCommand.openFile The <code>open file</code> command and its attributes.
 * @prop {AvailableCommandItem} availableCommand.saveFile The <code>save file</code> command and its attributes.
 * @prop {AvailableCommandItem} availableCommand.openDirectory The <code>open directory</code> command and its attributes.
 * @prop {AvailableCommandItem} availableCommand.messageBox The <code>message box</code> command and its attributes.
 */

/**
 * @typedef {Object} AvailableCommandItem
 * @prop {string} name The name of the command. This is used by all library methods to invoke the executable that opens the popups.
 * @prop {AvailableCommandItemFlags} flags The differents flags of the command.
 */

/**
 * @typedef {Object} AvailableCommandItemFlags
 * @prop {AvailableCommandItemFlagsItem} title The title of the popup.
 * @prop {AvailableCommandItemFlagsItem} [message] The message written in the popup.
 * @prop {AvailableCommandItemFlagsItem} [dialogType] The type of message box.
 * @prop {AvailableCommandItemFlagsItem} [startPath] The path to the folder where the popup will be opened.
 * @prop {AvailableCommandItemFlagsItem} [filterPatterns] The pattern used to filter the files.
 * @prop {AvailableCommandItemFlagsItem} [filterPatternsDescription] The description of the filter patterns, wiewed by the user.
 * @prop {AvailableCommandItemFlagsItem} [allowMultipleSelects] The value that defines if the user can select several files.
 * @prop {AvailableCommandItemFlagsItem} [iconType] The type of icon (and sound) of the message box.
 * @prop {AvailableCommandItemFlagsDefaultDelected} [defaultSelected] The button that is selected by default in the message box.
 */

/**
 * @typedef {Object} AvailableCommandItemFlagsItem
 * @prop {string} name The name of the flag. For exemple, <code>--title</code>.
 * @prop {string} defaultValue The default value.
 * @prop {Object<string, string>} [typesMapper] An object that contains all the possible values of the flag.
 * @prop {Array<string>} [types] An array that contains all the possible values of the flag.
 */

/**
 * @typedef {Object} AvailableCommandItemFlagsDefaultDelected
 * @prop {string} name The name of the flag. For exemple, <code>--title</code>.
 * @prop {Object<string, number>} [typesMapper] An object that contains all the possible values of the flag.
 * @prop {number} default The default value.
 */

/**
 * An object that contains the entire configuration of the library.
 * @type {Config}
 */
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

   const referencedCommand = this.config.availableCommand[command]

   let final = ''
   if (referencedCommand.name === this.config.availableCommand.openFile.name) {
      opts?.allowMultipleSelects
         ? (opts.allowMultipleSelects = 1)
         : (opts.allowMultipleSelects = 0)

      final = `${this.config.vendorPath} ${referencedCommand.name} `

      // title
      final += `${referencedCommand.flags.title.name} "${
         opts?.title || referencedCommand.flags.title.defaultValue
      }" `

      // startPath
      final += `${referencedCommand.flags.startPath.name} "${
         opts?.startPath || referencedCommand.flags.startPath.defaultValue
      }/" `

      // filterPatterns
      final += `${referencedCommand.flags.filterPatterns.name} ",${
         opts?.filterPatterns?.join(',') ||
         referencedCommand.flags.filterPatterns.defaultValue
      }" `

      // filterPatternsDescription
      final += `${referencedCommand.flags.filterPatternsDescription.name} "${
         opts?.filterPatternsDescription ||
         referencedCommand.flags.filterPatternsDescription.defaultValue
      }" `

      // allowMultipleSelects
      final += `${referencedCommand.flags.allowMultipleSelects.name} ${
         opts?.allowMultipleSelects ||
         referencedCommand.flags.allowMultipleSelects.defaultValue
      } `
   }

   if (referencedCommand.name === this.config.availableCommand.saveFile.name) {
      final = `${this.config.vendorPath} ${referencedCommand.name} `

      // title
      final += `${referencedCommand.flags.title.name} "${
         opts?.title || referencedCommand.flags.title.defaultValue
      }" `

      // startPath
      final += `${referencedCommand.flags.startPath.name} "${
         opts?.startPath || referencedCommand.flags.startPath.defaultValue
      }" `

      // filterPatterns
      final += `${referencedCommand.flags.filterPatterns.name} ",${
         opts?.filterPatterns?.join(',') ||
         referencedCommand.flags.filterPatterns.defaultValue
      }" `

      // filterPatternsDescription
      final += `${referencedCommand.flags.filterPatternsDescription.name} "${
         opts?.filterPatternsDescription ||
         referencedCommand.flags.filterPatternsDescription.defaultValue
      }" `
   }

   if (referencedCommand.name === this.config.availableCommand.openDirectory.name) {
      final = `${this.config.vendorPath} ${referencedCommand.name} `

      // title
      final += `${referencedCommand.flags.title.name} "${
         opts?.title || referencedCommand.flags.title.defaultValue
      }" `
   }

   if (referencedCommand.name === this.config.availableCommand.messageBox.name) {
      final = `${this.config.vendorPath} ${referencedCommand.name} `

      // title
      final += `${referencedCommand.flags.title.name} "${
         opts?.title || referencedCommand.flags.title.defaultValue
      }" `

      // message
      final += `${referencedCommand.flags.message.name} "${
         opts?.message || referencedCommand.flags.message.defaultValue
      }" `

      // dialogType
      final += `${referencedCommand.flags.dialogType.name} ${
         referencedCommand.flags.dialogType.typesMapper[opts?.dialogType] ||
         referencedCommand.flags.dialogType.defaultValue
      } `

      // iconType String
      final += `${referencedCommand.flags.iconType.name} ${
         opts?.iconType || referencedCommand.flags.iconType.defaultValue
      } `

      // defaultSelected
      final += `${referencedCommand.flags.defaultSelected.name} ${
         referencedCommand.flags.defaultSelected.typesMapper[opts?.defaultSelected] ||
         referencedCommand.flags.defaultSelected.default
      } `
   }

   return final
}

/**
 * An error class that occurs when the user donesn't select any file in the [openFile()]{@linkcode openFile} function.
 * @class
 * @extends Error
 */
exports.NoSelectedFileError = class extends Error {
   /**
    * Create a [NoSelectedFileError]{@linkcode NoSelectedFileError} instance.
    * @param {string} [message] The message of the error.
    * @param {ErrorOptions} [options] The error options. These are the same as those for the basic [<code>Error</code>]{@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error} class.
    */
   constructor(message, options) {
      super(message, options)
      this.name = "NoSelectedFileError"
   }
}

/**
 * Open an "Open file" window.
 * @param {Object} [opts] The options of the window.
 * @param {string} [opts.title="open"] The title of the popup
 * @param {string} [opts.startPath="./"] The start path of the popup
 * @param {Array<string>} [opts.filterPatterns=["*"]] The filter patterns of the popup. For example, <code>["*.exe", "*.txt"]</code>
 * @param {string} [opts.filterPatternsDescription=""] The filter patterns description of the popup, separated by commas; for example, <code>"Executable files,Text files"</code>
 * @param {boolean|number} [opts.allowMultipleSelects=false] The boolean that define if the window allow multiple selects of files
 * @returns {Promise<Array<string>>} A promise representing an array that contains the paths to the selected files. For example, <code>["C:\\Users\\user\\Desktop\\file.exe"]</code>
 * @throws {NoSelectedFileError} If the user didn't select any file.
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
   let files = out
      ?.slice(out?.indexOf('-066945'))
      ?.split('~')
      ?.at(1)
      ?.split('|')
      .map((p) => path.resolve(p))

   if (files?.length === 0) throw new this.NoSelectedFileError('no files selected')

   return files || [""]
}

/**
 * An error class that occurs when the user donesn't select any directory in the [openDirectory()]{@linkcode openDirectory} function.
 * @class
 * @extends Error
 */
exports.NoSelectedDirectoryError = class extends Error {
   /**
    * Create a [NoSelectedDirectoryError]{@linkcode NoSelectedDirectoryError} instance.
    * @param {string} [message] The message of the error.
    * @param {ErrorOptions} [options] The error options. These are the same as those for the basic [<code>Error</code>]{@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error} class.
    */
   constructor(message, options) {
      super(message, options)
      this.name = "NoSelectedDirectoryError"
   }
}

/**
 * Open an "Open directory" window.
 * @async
 * @param {Object} [opts] The options of the window.
 * @param {string} [opts.title="message"] The title of the popup.
 * @returns {Promise<string>} A Promise representing the path to the selected directory. For example, <code>"C:\\Users\\user\\Desktop\\"</code>
 * @throws {NoSelectedDirectoryError} If the user didn't select any directory.
 */
exports.openDirectory = async (opts = { title: '' }) => {
   let { stdout: out, stderr } = await exec(
      commandBuilder('openDirectory', opts)
   )
   if (stderr) throw new this.NoSelectedDirectoryError(stderr)

   if (out.includes('-066944')) {
      const err = out?.slice(out?.indexOf('-066944'))?.split('~')?.at(1)
      throw new this.NoSelectedDirectoryError(err)
   }
   let folder = out?.slice(out?.indexOf('-066945'))?.split('~')?.at(1)

   return folder || ""
}

/**
 * Open a dialog box.
 * @async
 * @param {Object} opts
 * @param {string} [opts.title="message"] The title of the popup
 * @param {string} [opts.message="message"] The message of the popup
 * @param {"ok"|"okCancel"|"yesNo"|"yesNoCancel"|""} [opts.dialogType="ok"] The dialog type of the popup
 * @param {"info"|"warning"|"error"|"question"|""} [opts.iconType="info"] The icon and sound types of the popup
 * @param {"ok"|"cancel"|"yes"|"no"|0} [opts.defaultSelected="ok"] The default selected button of the popup
 * @return {Promise<0|1|2>} A Promise representing the selected button number: <style type="text/css">#messagebox-return-table {border-collapse: collapse;} #messagebox-return-table td {border: 1px solid black; padding: 5px;} #messagebox-return-table tr:first-child td:first-child {border:none;}</style><br/><table id="messagebox-return-table"><tr><td><td><code>0</code><td><code>1</code><td><code>2</code><tr><td><code>"ok"</code><td><td>Ok<td><tr><td><code>"okCancel"</code><td>Cancel<td>Ok<td><tr><td><code>"yesNo"</code><td>No<td>Yes<td><tr><td><code>"yesNoCancel"</code><td>Cancel<td>Yes<td>No</table>
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

   let result = Number(
      answer // yes/ok=1 no=2 cancel=0
         ?.slice(answer?.indexOf('-066945'))
         ?.split('~')
         ?.at(1)
   )
   return /** @type {0|1|2} */ (result % 3)
}

/**
 * An error class that occurs when the user donesn't select any file in the [saveFile()]{@linkcode openFile} function.
 * @class
 * @extends Error
 */
exports.NoSavedFileError = class extends Error {
   /**
    * Create a [NoSavedFileError]{@linkcode NoSavedFileError} instance.
    * @param {string} [message] The message of the error.
    * @param {ErrorOptions} [options] The error options. These are the same as those for the basic [<code>Error</code>]{@linkcode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error} class.
    */
   constructor(message, options) {
      super(message, options)
      this.name = "NoSavedFileError"
   }
}


/**
 * Open a "Save file" window.
 * @param {Object} opts The options of the window.
 * @param {string} [opts.title="save"] The title of the popup.
 * @param {string} [opts.startPath="./default.txt"] The start path of the popup and the saved file name
 * @param {Array<string>} [opts.filterPatterns=["*"]] The filter patterns of the popup. For example, <code>["*.exe", "*.txt"]</code>
 * @param {string} [opts.filterPatternsDescription=""] The filter patterns description of the popup, separated by commas; for example, <code>"Executable files,Text files"</code>
 * @returns {Promise<string>} A Promise representing the path to the saved file. Example: <code>"C:\\Users\\user\\Desktop\\default.txt"</code>
 * @throws {NoSavedFileError} If the user cancelled and didn't select any file to save in.
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
   if (stderr) throw new this.NoSavedFileError(stderr)

   if (out.includes('-066944')) {
      const err = out?.slice(out?.indexOf('-066944'))?.split('~')?.at(1)
      throw new this.NoSavedFileError(err)
   }
   let file = out?.slice(out?.indexOf('-066945'))?.split('~')?.at(1)

   return file || ""
}

