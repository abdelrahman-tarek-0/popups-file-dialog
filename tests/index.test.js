const fileDialog = require('../file-dialog')

const main = async () => {
   console.log(fileDialog.config.vendorPath)

   const result = await fileDialog.openFile({
      title: 'Open File',
      startPath: 'C:\\Users\\pc\\Desktop\\New folder (36)',
      filterPatterns: ['*'],
      filterPatternsDescription: "all",
      allowMultipleSelects: true,
   })
   console.log(result)

   const result2 = await fileDialog.messageBox({
      title: 'Message Box',
      message: 'Hello World',
      dialogType: 'yesNoCancel',
      iconType: 'info',
      defaultSelected: 'yes',
   })
   console.log(result2)

   const result3 = await fileDialog.openDirectory({
      title: 'Message Box',
   })
   console.log(result3)

   const result4 = await fileDialog.saveFile({
      title: 'Save File',
      startPath: 'C:\\Users\\pc\\Desktop\\New folder (36)\\test.txt',
      filterPatterns: ['*'],
      filterPatternsDescription: "all",
   })
   console.log(result4)
}

main()
