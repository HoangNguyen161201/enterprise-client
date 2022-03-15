const pageIndex = ({count, limit})=> {
    console.log(count)
    if(count == 0) return 0
    return Math.ceil(count / limit)
}

module.exports = pageIndex