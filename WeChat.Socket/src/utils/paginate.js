function paginate(obj, total, limit, skip) {
    return {
        ...obj,
        total,
        limit,
        skip
    }
}

function getPaginateQuery(req) {
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || Math.max(0, 10);
    return {
        skip, limit
    }
}

module.exports = { paginate, getPaginateQuery };