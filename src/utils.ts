export const ICON_URL = 'https://icon.chainge.finance/'

export enum StoreKey {
    ImportedList = 'chainge.imported'
}

export const checkIsBrowser = (): boolean => {
    return typeof window !== "undefined" && typeof document !== "undefined";
}

export const setStore = (key: string, value: any): void => {
    if(!checkIsBrowser()) return
    key = key.trim()
    if(!key) {
        throw new Error('key is empty')
    }
    if(!value && value !== 0) value = ''
    const valueStr = JSON.stringify(value)
    window.localStorage.setItem(key, valueStr)
}

export const getStore = (key: string) : any => {
    if(!checkIsBrowser()) return
    key = key.trim()
    if(!key) {
        throw new Error('key is empty')
    }
    const valueStr = window.localStorage.getItem(key)
    if(valueStr) {
        return JSON.parse(valueStr)
    } else {
        return ''
    }
}

export const removeStore = (key: string) => {
    if(!checkIsBrowser()) return
    key = key.trim()
    if(!key) {
        throw new Error('key is empty')
    }
    window.localStorage.removeItem(key)
}
