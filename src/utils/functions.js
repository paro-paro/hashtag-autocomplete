const sortAsc = (a, b) => {
    if (a.toLowerCase() < b.toLowerCase()) {
        return -1
    }
    else if (a.toLowerCase > b.toLowerCase) {
        return 1
    }
    return 0
}

const normalize = (string) => {
    return string.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const replaceAtTo = (string, indexAt, indexTo, replacement) => {
    return string.substring(0, indexAt) + replacement + string.substring(indexTo, string.length)
}

export {
    sortAsc,
    normalize,
    replaceAtTo
}
