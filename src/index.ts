import _ from 'lodash';

class Mutator {
  context: any;
  constructor(context: any) {
    this.context = context;
  }

  updateContext(context: any) {
    this.context = _.merge(this.context, context);
  }

  mutateString(string: string) {
    try {
      const compiled = _.template(string);
      return compiled(this.context);
    } catch (error) {
      console.log(error);
      return string;
    }
  }

  mutateArray(array:any[]) {
    const mutantArray = _.cloneDeep(array);
    return _.map(mutantArray, (v, k) => {
      if (_.isObject(v)) {
        if (_.isString(v)) return this.mutateString(v);
        return this.mutateObject(v);
      }
      return v;
    });
  }

  mutateObject(object: any) {
    const mutantObject = _.reduce(
      _.cloneDeep(object),
      (r, v, k) => {
        if (_.isObject(v)) {
          if (_.isArray(v))
            return {
              ...r,
              [k]: this.mutateArray(
                v as any[]
              ),
            };
          return { ...r, [k]: this.mutateObject(v) };
        }
        if (_.isString(v)) return { ...r, [k]: this.mutateString(v) };
        return { ...r, [k]: v };
      },
      {}
    );
    return mutantObject;
  }

  mutate(item: any) {
    if (_.isString(item)) return this.mutateString(item);
    if (_.isObject(item)) {
        if (_.isArray(item)) return this.mutateArray(item);
        return this.mutateObject(item);
    } 
    return item;
  }
}

export default Mutator;