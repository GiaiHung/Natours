class APIFeatures {
  constructor(query, queryStr) {
    // query: Model, queryStr: req.query
    // after every method, return this so we can chain calling together
    this.query = query
    this.queryStr = queryStr
  }

  filter() {
    // 1) Filtering excluded
    const queryObject = { ...this.queryStr }
    const excludedFields = ['sort', 'page', 'limit', 'fields']
    excludedFields.forEach((field) => delete queryObject[field])
    // 2) Filtering advanced (gt, gte, lt, lte)
    // \b means match exact word not lt in difficulty
    // g means match every word, else it only matches thr first one
    const queryStr = JSON.stringify(queryObject).replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    )
    this.query = this.query.find(JSON.parse(queryStr))
    return this
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.replaceAll(',', ' ')
      this.query = this.query.sort(sortBy)
    } else {
      // Default sort by the newest
      this.query = this.query.sort('createdAt')
    }
    return this
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.replaceAll(',', ' ')
      this.query.select(fields)
    } else {
      // Defautl always version
      this.query.select('-__v')
    }
    return this
  }

  paginate() {
    const page = this.queryStr.page * 1 || 1
    const limit = this.queryStr.limit * 1 || 10
    // Page 1 1-10, page 2 11-20, page 3 21-30
    const skip = (page - 1) * limit
    this.query = this.query.skip(skip).limit(limit)
    return this
  }
}

module.exports = APIFeatures
