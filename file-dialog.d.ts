declare module 'popups-file-dialog'

export const openFile: (opts?: {
    title?: string,
    startPath?: string,
    filterPatterns?: Array<string>,
    filterPatternsDescription?: string,
    allowMultipleSelects?: boolean
}) => Promise<Array<string>>

export const openDirectory: (opts?: { title?: string }) => Promise<string>

export type dialogType = "ok" | "okCancel" | "yesNo" | "yesNoCancel"
export type iconType = "info" | "warning" | "error" | "question"
export type defaultSelectedButton = "yes" | "no" | "ok" | "cancel"
export type dialogResult = 0 | 1 | 2

export const messageBox: (opts?: {
    title?: String,
    message?: String,
    dialogType?: dialogType,
    iconType?: iconType,
    defaultSelected?: defaultSelectedButton
}) => Promise<dialogResult>

export const saveFile: (opts?: {
    title?: string,
    startPath?: string,
    filterPatterns?: Array<string>,
    filterPatternsDescription?: String
}) => Promise<string>