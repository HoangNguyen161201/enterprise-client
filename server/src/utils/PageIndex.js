const pageIndex = async ({query, limit})=> {
    const count = await query.count()
    if(count == 0) return 0
    return Math.ceil(count / limit)
}

module.exports = pageIndex