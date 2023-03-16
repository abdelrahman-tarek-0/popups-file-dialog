const fileDialog = require("../file-dialog");


const main = async () => {
    console.log(fileDialog.config.vendorPath);

    const result = await fileDialog.openFile({
        title: "Open File",
        startPath: "C:\\Users\\",
        filterPatterns: ["*.exe", "*.txt"],
        filterPatternsDescription: "exe files,txt files",
        allowMultipleSelects: true
    })
    console.log(result);


    const result2 = await fileDialog.messageBox({
        title: "Message Box",
        message: "Hello World",
        dialogType: "yesNoCancel",
        iconType: "info",
        defaultSelected: "yes"
    })

    console.log(result2);

    const result3 = await fileDialog['custom-input-number-password-we-login']()

    console.log(result3);
}

main();