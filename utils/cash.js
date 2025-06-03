export const cashedtems = {

}

export const cashItem = async (name, value, func) => {
    if (cashedtems[name]) {
        return cashedtems[name]
    } else {
        cashedtems[name] = await func(value)
        return cashedtems[name]
    }
}