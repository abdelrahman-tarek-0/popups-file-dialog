declare module 'popups-file-dialog' {

    export const openFile: (opts?: {
        title?: string,
        startPath?: string,
        filterPatterns?: Array<string>,
        filterPatternsDescription?: string,
        allowMultipleSelects?: boolean
    }) => Promise<Array<string>>

    export const openDirectory: (opts?: { title?: string }) => Promise<string>


    export const messageBox: (opts?: {
        title?: string,
        message?: string,
        dialogType?: "ok" | "okCancel" | "yesNo" | "yesNoCancel",
        iconType?: "info" | "warning" | "error" | "question",
        defaultSelected?: "yes" | "no" | "ok" | "cancel"
    }) => Promise<0 | 1 | 2>

    export const saveFile: (opts?: {
        title?: string,
        startPath?: string,
        filterPatterns?: Array<string>,
        filterPatternsDescription?: string
    }) => Promise<string>

    export const config: {
        vendorPath: string,
        availableCommand: {
            [command: string]: {
                name: string,
                flags: {
                    [flag: string]: {
                        name: string,
                        defaultValue?: string,
                        typesMapper?: {
                            [mappedType: string]: string | number
                        },
                        types?: Array<string>,
                        default?: number
                    }
                }
            }
        }
    }

    export class NoSelectedFileError extends Error {
        constructor(message: string, options: ErrorOptions)
    }

    export class NoSelectedDirectoryError extends Error {
        constructor(message: string, options: ErrorOptions)
    }

    export class NoSavedFileError extends Error {
        constructor(message: string, options: ErrorOptions)
    }

    const pathFixer: (pathString: string) => string
}