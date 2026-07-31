class DefineDbResultImpl {
  constructor(schema, plugins = []) {
    this.schema = schema;
    this.plugins = plugins;
  }
  use(plugin) {
    const mergedSchema = { ...this.schema };
    for (const [tableName, table] of Object.entries(plugin.schema)) {
      if (mergedSchema[tableName]) {
        mergedSchema[tableName] = {
          ...mergedSchema[tableName],
          fields: {
            ...mergedSchema[tableName].fields,
            ...table.fields
          }
        };
      } else {
        mergedSchema[tableName] = table;
      }
    }
    return new DefineDbResultImpl(mergedSchema, [...this.plugins, plugin]);
  }
  getSchema() {
    return this.schema;
  }
}
function defineDb(schema, options) {
  let result = new DefineDbResultImpl(schema);
  return result;
}
function createDbPlugin(name, schema) {
  return {
    name,
    schema
  };
}
export {
  createDbPlugin as c,
  defineDb as d
};
