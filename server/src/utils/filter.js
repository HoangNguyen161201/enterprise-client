class Filter {
  query;
  constructor(query) {
    this.query = query;
  }
  getAll() {
    this.query = this.query.find({});
    return this;
  }
  search({ name, query }) {
    this.query = this.query.find({ [name]: { $regex: '.*' + query + '.*' } });
    return this;
  }
  searchGte({ name, query }) {
    this.query = this.query.find({ [name]: { $gte: query } });
    return this;
  }
  pagination({ page, limit }) {
    console.log(page, limit);
    this.query = this.query.skip(page * limit).limit(limit);
    return this;
  }
  sort({name, NorO}){
    console.log(name, NorO);
      this.query = this.query.sort({[name]:NorO});
      return this;
  }
}

module.exports = Filter;

