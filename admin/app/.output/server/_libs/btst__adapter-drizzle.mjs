import { c as createAdapterFactory, l as logger, B as BetterAuthError } from "./better-auth__core.mjs";
import { i as inArray, c as count, d as desc, a as asc, n as notInArray, l as like, b as lt, e as lte, f as isNotNull, g as ne, h as gt, j as gte, k as isNull, m as eq, o as and, p as or, s as sql, q as ilike } from "./drizzle-orm.mjs";
function insensitiveIlike(column, pattern, provider) {
  return provider === "pg" ? ilike(column, pattern) : sql`LOWER(${column}) LIKE LOWER(${pattern})`;
}
function insensitiveInArray(column, values) {
  if (values.length === 0) {
    return sql`false`;
  }
  return sql`LOWER(${column}) IN (${sql.join(
    values.map((v) => sql`LOWER(${v})`),
    sql`, `
  )})`;
}
function insensitiveNotInArray(column, values) {
  if (values.length === 0) {
    return sql`true`;
  }
  return sql`LOWER(${column}) NOT IN (${sql.join(
    values.map((v) => sql`LOWER(${v})`),
    sql`, `
  )})`;
}
function insensitiveEq(column, value) {
  return sql`LOWER(${column}) = LOWER(${value})`;
}
function insensitiveNe(column, value) {
  return sql`LOWER(${column}) <> LOWER(${value})`;
}
const drizzleAdapter = (db, config) => {
  let lazyOptions = null;
  let mysqlNoIdWarned = false;
  const createCustomAdapter = (db2, inTransaction = false) => ({
    getFieldName,
    getDefaultFieldName,
    getDefaultModelName,
    options,
    schema: baSchema
  }) => {
    if (config.provider === "mysql" && options.advanced?.database?.generateId === false && !mysqlNoIdWarned) {
      mysqlNoIdWarned = true;
      logger.warn(
        `[Drizzle Adapter] MySQL does not support INSERT...RETURNING. With generateId set to false, the adapter uses best-effort fallback strategies (unique columns, full-field match) to retrieve inserted rows. For reliable behavior, use Better Auth's default ID generation, a custom generateId function, or generateId: "serial" for auto-increment.`
      );
    }
    function getSchema(model) {
      const schema = config.schema || db2._.fullSchema;
      if (!schema) {
        throw new BetterAuthError(
          "Drizzle adapter failed to initialize. Schema not found. Please provide a schema object in the adapter options object."
        );
      }
      const schemaModel = schema[model];
      if (!schemaModel) {
        throw new BetterAuthError(
          `[# Drizzle Adapter]: The model "${model}" was not found in the schema object. Please pass the schema directly to the adapter options.`
        );
      }
      return schemaModel;
    }
    const withReturning = async (model, builder, data, where) => {
      if (config.provider !== "mysql") {
        const c = await builder.returning();
        return c[0];
      }
      await builder.execute();
      const schemaModel = getSchema(model);
      const builderVal = builder.config?.values;
      if (where?.length) {
        const updatedWhere = where.map((w) => {
          if (data[w.field] !== void 0) {
            return { ...w, value: data[w.field] };
          }
          return w;
        });
        const clause = convertWhereClause(updatedWhere, model);
        const res = await db2.select().from(schemaModel).where(...clause);
        return res[0];
      }
      const fetchInserted = async (tx) => {
        const builderId = builderVal?.[0]?.id?.value;
        if (builderId) {
          const res = await tx.select().from(schemaModel).where(eq(schemaModel.id, builderId)).limit(1).execute();
          return res[0] ?? null;
        }
        if (data.id) {
          const res = await tx.select().from(schemaModel).where(eq(schemaModel.id, data.id)).limit(1).execute();
          return res[0] ?? null;
        }
        if (options.advanced?.database?.generateId === "serial" && schemaModel.id) {
          const lastInsertId = await tx.select({ id: sql`LAST_INSERT_ID()` }).from(schemaModel).limit(1).execute();
          const lastId = lastInsertId[0]?.id;
          if (lastId) {
            const res = await tx.select().from(schemaModel).where(eq(schemaModel.id, lastId)).limit(1).execute();
            return res[0] ?? null;
          }
        }
        const modelSchema = baSchema[getDefaultModelName(model)]?.fields;
        if (modelSchema) {
          for (const [fieldKey, fieldAttr] of Object.entries(modelSchema)) {
            if (!fieldAttr.unique) continue;
            const dbFieldName = getFieldName({
              model,
              field: fieldKey
            });
            const val = data[dbFieldName];
            if (val === void 0 || val === null) continue;
            if (!schemaModel[dbFieldName]) continue;
            const res = await tx.select().from(schemaModel).where(eq(schemaModel[dbFieldName], val)).limit(1).execute();
            if (res[0]) return res[0];
          }
        }
        const conditions = [];
        for (const [key, val] of Object.entries(data)) {
          if (val === void 0 || !schemaModel[key]) continue;
          conditions.push(
            val === null ? isNull(schemaModel[key]) : eq(schemaModel[key], val)
          );
        }
        if (conditions.length > 0) {
          const combined = and(...conditions);
          if (combined) {
            const res = await tx.select().from(schemaModel).where(combined).limit(2).execute();
            if (res.length === 1) return res[0];
          }
        }
        logger.warn(
          `[Drizzle Adapter] Unable to safely identify the inserted "${model}" row on MySQL. Enable Better Auth ID generation or use generateId: "serial" for reliable behavior.`
        );
        return null;
      };
      return inTransaction ? fetchInserted(db2) : db2.transaction(fetchInserted);
    };
    function convertWhereClause(where, model) {
      const schemaModel = getSchema(model);
      if (!where) return [];
      if (where.length === 1) {
        const w = where[0];
        if (!w) {
          return [];
        }
        const field = getFieldName({ model, field: w.field });
        if (!schemaModel[field]) {
          throw new BetterAuthError(
            `The field "${w.field}" does not exist in the schema for the model "${model}". Please update your schema.`
          );
        }
        const mode = w.mode ?? "sensitive";
        const isInsensitive = mode === "insensitive" && (typeof w.value === "string" || Array.isArray(w.value) && w.value.every((v) => typeof v === "string"));
        if (w.operator === "in") {
          if (!Array.isArray(w.value)) {
            throw new BetterAuthError(
              `The value for the field "${w.field}" must be an array when using the "in" operator.`
            );
          }
          if (isInsensitive) {
            return [
              insensitiveInArray(schemaModel[field], w.value)
            ];
          }
          return [inArray(schemaModel[field], w.value)];
        }
        if (w.operator === "not_in") {
          if (!Array.isArray(w.value)) {
            throw new BetterAuthError(
              `The value for the field "${w.field}" must be an array when using the "not_in" operator.`
            );
          }
          if (isInsensitive) {
            return [
              insensitiveNotInArray(schemaModel[field], w.value)
            ];
          }
          return [notInArray(schemaModel[field], w.value)];
        }
        if (w.operator === "contains") {
          if (isInsensitive && typeof w.value === "string") {
            return [
              insensitiveIlike(
                schemaModel[field],
                `%${w.value}%`,
                config.provider
              )
            ];
          }
          return [like(schemaModel[field], `%${w.value}%`)];
        }
        if (w.operator === "starts_with") {
          if (isInsensitive && typeof w.value === "string") {
            return [
              insensitiveIlike(
                schemaModel[field],
                `${w.value}%`,
                config.provider
              )
            ];
          }
          return [like(schemaModel[field], `${w.value}%`)];
        }
        if (w.operator === "ends_with") {
          if (isInsensitive && typeof w.value === "string") {
            return [
              insensitiveIlike(
                schemaModel[field],
                `%${w.value}`,
                config.provider
              )
            ];
          }
          return [like(schemaModel[field], `%${w.value}`)];
        }
        if (w.operator === "lt") {
          return [lt(schemaModel[field], w.value)];
        }
        if (w.operator === "lte") {
          return [lte(schemaModel[field], w.value)];
        }
        if (w.operator === "ne") {
          if (w.value === null) {
            return [isNotNull(schemaModel[field])];
          }
          if (isInsensitive && typeof w.value === "string") {
            return [insensitiveNe(schemaModel[field], w.value)];
          }
          return [ne(schemaModel[field], w.value)];
        }
        if (w.operator === "gt") {
          return [gt(schemaModel[field], w.value)];
        }
        if (w.operator === "gte") {
          return [gte(schemaModel[field], w.value)];
        }
        if (w.value === null) {
          return [isNull(schemaModel[field])];
        }
        if (isInsensitive && typeof w.value === "string") {
          return [insensitiveEq(schemaModel[field], w.value)];
        }
        return [eq(schemaModel[field], w.value)];
      }
      const andGroup = where.filter(
        (w) => w.connector === "AND" || !w.connector
      );
      const orGroup = where.filter((w) => w.connector === "OR");
      const andClause = and(
        ...andGroup.map((w) => {
          const field = getFieldName({ model, field: w.field });
          const mode = w.mode ?? "sensitive";
          const isInsensitive = mode === "insensitive" && (typeof w.value === "string" || Array.isArray(w.value) && w.value.every((v) => typeof v === "string"));
          if (w.operator === "in") {
            if (!Array.isArray(w.value)) {
              throw new BetterAuthError(
                `The value for the field "${w.field}" must be an array when using the "in" operator.`
              );
            }
            if (isInsensitive) {
              return insensitiveInArray(
                schemaModel[field],
                w.value
              );
            }
            return inArray(schemaModel[field], w.value);
          }
          if (w.operator === "not_in") {
            if (!Array.isArray(w.value)) {
              throw new BetterAuthError(
                `The value for the field "${w.field}" must be an array when using the "not_in" operator.`
              );
            }
            if (isInsensitive) {
              return insensitiveNotInArray(
                schemaModel[field],
                w.value
              );
            }
            return notInArray(schemaModel[field], w.value);
          }
          if (w.operator === "contains") {
            if (isInsensitive && typeof w.value === "string") {
              return insensitiveIlike(
                schemaModel[field],
                `%${w.value}%`,
                config.provider
              );
            }
            return like(schemaModel[field], `%${w.value}%`);
          }
          if (w.operator === "starts_with") {
            if (isInsensitive && typeof w.value === "string") {
              return insensitiveIlike(
                schemaModel[field],
                `${w.value}%`,
                config.provider
              );
            }
            return like(schemaModel[field], `${w.value}%`);
          }
          if (w.operator === "ends_with") {
            if (isInsensitive && typeof w.value === "string") {
              return insensitiveIlike(
                schemaModel[field],
                `%${w.value}`,
                config.provider
              );
            }
            return like(schemaModel[field], `%${w.value}`);
          }
          if (w.operator === "lt") {
            return lt(schemaModel[field], w.value);
          }
          if (w.operator === "lte") {
            return lte(schemaModel[field], w.value);
          }
          if (w.operator === "gt") {
            return gt(schemaModel[field], w.value);
          }
          if (w.operator === "gte") {
            return gte(schemaModel[field], w.value);
          }
          if (w.operator === "ne") {
            if (w.value === null) {
              return isNotNull(schemaModel[field]);
            }
            if (isInsensitive && typeof w.value === "string") {
              return insensitiveNe(schemaModel[field], w.value);
            }
            return ne(schemaModel[field], w.value);
          }
          if (w.value === null) {
            return isNull(schemaModel[field]);
          }
          if (isInsensitive && typeof w.value === "string") {
            return insensitiveEq(schemaModel[field], w.value);
          }
          return eq(schemaModel[field], w.value);
        })
      );
      const orClause = or(
        ...orGroup.map((w) => {
          const field = getFieldName({ model, field: w.field });
          if (!schemaModel[field]) {
            throw new BetterAuthError(
              `The field "${w.field}" does not exist in the schema for the model "${model}". Please update your schema.`
            );
          }
          const mode = w.mode ?? "sensitive";
          const isInsensitive = mode === "insensitive" && (typeof w.value === "string" || Array.isArray(w.value) && w.value.every((v) => typeof v === "string"));
          if (w.operator === "in") {
            if (!Array.isArray(w.value)) {
              throw new BetterAuthError(
                `The value for the field "${w.field}" must be an array when using the "in" operator.`
              );
            }
            if (isInsensitive) {
              return insensitiveInArray(
                schemaModel[field],
                w.value
              );
            }
            return inArray(schemaModel[field], w.value);
          }
          if (w.operator === "not_in") {
            if (!Array.isArray(w.value)) {
              throw new BetterAuthError(
                `The value for the field "${w.field}" must be an array when using the "not_in" operator.`
              );
            }
            if (isInsensitive) {
              return insensitiveNotInArray(
                schemaModel[field],
                w.value
              );
            }
            return notInArray(schemaModel[field], w.value);
          }
          if (w.operator === "contains") {
            if (isInsensitive && typeof w.value === "string") {
              return insensitiveIlike(
                schemaModel[field],
                `%${w.value}%`,
                config.provider
              );
            }
            return like(schemaModel[field], `%${w.value}%`);
          }
          if (w.operator === "starts_with") {
            if (isInsensitive && typeof w.value === "string") {
              return insensitiveIlike(
                schemaModel[field],
                `${w.value}%`,
                config.provider
              );
            }
            return like(schemaModel[field], `${w.value}%`);
          }
          if (w.operator === "ends_with") {
            if (isInsensitive && typeof w.value === "string") {
              return insensitiveIlike(
                schemaModel[field],
                `%${w.value}`,
                config.provider
              );
            }
            return like(schemaModel[field], `%${w.value}`);
          }
          if (w.operator === "lt") {
            return lt(schemaModel[field], w.value);
          }
          if (w.operator === "lte") {
            return lte(schemaModel[field], w.value);
          }
          if (w.operator === "gt") {
            return gt(schemaModel[field], w.value);
          }
          if (w.operator === "gte") {
            return gte(schemaModel[field], w.value);
          }
          if (w.operator === "ne") {
            if (w.value === null) {
              return isNotNull(schemaModel[field]);
            }
            if (isInsensitive && typeof w.value === "string") {
              return insensitiveNe(schemaModel[field], w.value);
            }
            return ne(schemaModel[field], w.value);
          }
          if (w.value === null) {
            return isNull(schemaModel[field]);
          }
          if (isInsensitive && typeof w.value === "string") {
            return insensitiveEq(schemaModel[field], w.value);
          }
          return eq(schemaModel[field], w.value);
        })
      );
      if (andGroup.length && orGroup.length) {
        return [and(andClause, orClause)];
      }
      if (andGroup.length) return [andClause];
      if (orGroup.length) return [orClause];
      return [];
    }
    function checkMissingFields(schema, model, values) {
      if (!schema) {
        throw new BetterAuthError(
          "Drizzle adapter failed to initialize. Drizzle Schema not found. Please provide a schema object in the adapter options object."
        );
      }
      for (const key in values) {
        let fieldName;
        try {
          fieldName = getFieldName({ model, field: key });
        } catch {
          fieldName = key;
        }
        if (!schema[fieldName]) {
          throw new BetterAuthError(
            `The field "${key}" does not exist in the "${model}" Drizzle schema. Please update your drizzle schema or re-generate using "npx auth@latest generate".`
          );
        }
      }
    }
    function getQueryModel(model) {
      if (db2.query[model]) return model;
      if (config.usePlural) {
        const plural = `${model}s`;
        if (db2.query[plural]) return plural;
      }
      if (config.schema) {
        const targetTable = config.schema[model];
        if (targetTable) {
          const fullSchema = db2._.fullSchema;
          if (fullSchema) {
            for (const key of Object.keys(db2.query)) {
              if (fullSchema[key] === targetTable) {
                return key;
              }
            }
          }
        }
      }
      return null;
    }
    return {
      async create({ model, data: values }) {
        const schemaModel = getSchema(model);
        checkMissingFields(schemaModel, model, values);
        const builder = db2.insert(schemaModel).values(values);
        const returned = await withReturning(model, builder, values);
        return returned;
      },
      async findOne({ model, where, select, join }) {
        const schemaModel = getSchema(model);
        const clause = convertWhereClause(where, model);
        if (options.experimental?.joins) {
          const queryModel = getQueryModel(model);
          if (!db2.query || !queryModel) {
            logger.error(
              `[# Drizzle Adapter]: The model "${model}" was not found in the query object. Please update your Drizzle schema to include relations or re-generate using "npx auth@latest generate".`
            );
            logger.info("Falling back to regular query");
          } else {
            let includes;
            const pluralJoinResults = [];
            if (join) {
              includes = {};
              const joinEntries = Object.entries(join);
              for (const [model2, joinAttr] of joinEntries) {
                const limit = joinAttr.limit ?? options.advanced?.database?.defaultFindManyLimit ?? 100;
                const isUnique = joinAttr.relation === "one-to-one";
                const pluralSuffix = isUnique || config.usePlural ? "" : "s";
                includes[`${model2}${pluralSuffix}`] = isUnique ? true : { limit };
                if (!isUnique) {
                  pluralJoinResults.push(`${model2}${pluralSuffix}`);
                }
              }
            }
            const query2 = db2.query[queryModel].findFirst({
              where: clause[0],
              columns: select?.length && select.length > 0 ? select.reduce(
                (acc, field) => {
                  acc[getFieldName({ model, field })] = true;
                  return acc;
                },
                {}
              ) : void 0,
              with: includes
            });
            const res2 = await query2;
            if (res2) {
              for (const pluralJoinResult of pluralJoinResults) {
                const singularKey = !config.usePlural ? pluralJoinResult.slice(0, -1) : pluralJoinResult;
                res2[singularKey] = res2[pluralJoinResult];
                if (pluralJoinResult !== singularKey) {
                  delete res2[pluralJoinResult];
                }
              }
            }
            return res2;
          }
        }
        const query = db2.select(
          select?.length && select.length > 0 ? select.reduce((acc, field) => {
            const fieldName = getFieldName({ model, field });
            return {
              ...acc,
              [fieldName]: schemaModel[fieldName]
            };
          }, {}) : void 0
        ).from(schemaModel).where(...clause);
        const res = await query;
        if (!res.length) return null;
        return res[0];
      },
      async findMany({ model, where, sortBy, limit, select, offset, join }) {
        const schemaModel = getSchema(model);
        const clause = where ? convertWhereClause(where, model) : [];
        const sortFn = sortBy?.direction === "desc" ? desc : asc;
        if (options.experimental?.joins) {
          const queryModel = getQueryModel(model);
          if (!queryModel) {
            logger.error(
              `[# Drizzle Adapter]: The model "${model}" was not found in the query object. Please update your Drizzle schema to include relations or re-generate using "npx auth@latest generate".`
            );
            logger.info("Falling back to regular query");
          } else {
            let includes;
            const pluralJoinResults = [];
            if (join) {
              includes = {};
              const joinEntries = Object.entries(join);
              for (const [model2, joinAttr] of joinEntries) {
                const isUnique = joinAttr.relation === "one-to-one";
                const limit2 = joinAttr.limit ?? options.advanced?.database?.defaultFindManyLimit ?? 100;
                const pluralSuffix = isUnique || config.usePlural ? "" : "s";
                includes[`${model2}${pluralSuffix}`] = isUnique ? true : { limit: limit2 };
                if (!isUnique)
                  pluralJoinResults.push(`${model2}${pluralSuffix}`);
              }
            }
            let orderBy = void 0;
            if (sortBy?.field) {
              orderBy = [
                sortFn(
                  schemaModel[getFieldName({ model, field: sortBy?.field })]
                )
              ];
            }
            const query = db2.query[queryModel].findMany({
              where: clause[0],
              with: includes,
              columns: select?.length && select.length > 0 ? select.reduce(
                (acc, field) => {
                  acc[getFieldName({ model, field })] = true;
                  return acc;
                },
                {}
              ) : void 0,
              limit: limit ?? 100,
              offset: offset ?? 0,
              orderBy
            });
            const res2 = await query;
            if (res2) {
              for (const item of res2) {
                for (const pluralJoinResult of pluralJoinResults) {
                  const singularKey = !config.usePlural ? pluralJoinResult.slice(0, -1) : pluralJoinResult;
                  if (singularKey === pluralJoinResult) continue;
                  item[singularKey] = item[pluralJoinResult];
                  delete item[pluralJoinResult];
                }
              }
            }
            return res2;
          }
        }
        let builder = db2.select(
          select?.length && select.length > 0 ? select.reduce((acc, field) => {
            const fieldName = getFieldName({ model, field });
            return {
              ...acc,
              [fieldName]: schemaModel[fieldName]
            };
          }, {}) : void 0
        ).from(schemaModel);
        const effectiveLimit = limit;
        const effectiveOffset = offset;
        if (typeof effectiveLimit !== "undefined") {
          builder = builder.limit(effectiveLimit);
        }
        if (typeof effectiveOffset !== "undefined") {
          builder = builder.offset(effectiveOffset);
        }
        if (sortBy?.field) {
          builder = builder.orderBy(
            sortFn(
              schemaModel[getFieldName({ model, field: sortBy?.field })]
            )
          );
        }
        const res = await builder.where(...clause);
        return res;
      },
      async count({ model, where }) {
        const schemaModel = getSchema(model);
        const clause = where ? convertWhereClause(where, model) : [];
        const res = await db2.select({ count: count() }).from(schemaModel).where(...clause);
        return res[0].count;
      },
      async update({ model, where, update: values }) {
        const schemaModel = getSchema(model);
        const clause = convertWhereClause(where, model);
        const builder = db2.update(schemaModel).set(values).where(...clause);
        return await withReturning(model, builder, values, where);
      },
      async updateMany({ model, where, update: values }) {
        const schemaModel = getSchema(model);
        const clause = convertWhereClause(where, model);
        const builder = db2.update(schemaModel).set(values).where(...clause);
        return await builder;
      },
      async delete({ model, where }) {
        const schemaModel = getSchema(model);
        const clause = convertWhereClause(where, model);
        const builder = db2.delete(schemaModel).where(...clause);
        return await builder;
      },
      async deleteMany({ model, where }) {
        const schemaModel = getSchema(model);
        const clause = convertWhereClause(where, model);
        const builder = db2.delete(schemaModel).where(...clause);
        const res = await builder;
        let count2 = 0;
        if (res && "rowCount" in res) count2 = res.rowCount;
        else if (Array.isArray(res)) count2 = res.length;
        else if (res && ("affectedRows" in res || "rowsAffected" in res || "changes" in res))
          count2 = res.affectedRows ?? res.rowsAffected ?? res.changes;
        if (typeof count2 !== "number") {
          logger.error(
            "[Drizzle Adapter] The result of the deleteMany operation is not a number. This is likely a bug in the adapter. Please report this issue to the Better Auth team.",
            { res, model, where }
          );
        }
        return count2;
      },
      async consumeOne({ model, where }) {
        const schemaModel = getSchema(model);
        const clause = convertWhereClause(where, model);
        const idField = getFieldName({ model, field: "id" });
        const idColumn = schemaModel[idField];
        if (config.provider === "mysql") {
          const claimFromTransaction = async (tx) => {
            const rows = await tx.select().from(schemaModel).where(...clause).for("update").limit(1);
            const target = rows[0];
            if (!target) return null;
            const targetId = target[idField] ?? target.id;
            if (targetId === void 0 || targetId === null || !idColumn) {
              return null;
            }
            const delRes = await tx.delete(schemaModel).where(eq(idColumn, targetId)).execute();
            const count2 = (delRes && (delRes.rowsAffected ?? delRes.affectedRows ?? delRes.changes)) ?? 0;
            return count2 > 0 ? target : null;
          };
          return inTransaction ? claimFromTransaction(db2) : db2.transaction(claimFromTransaction);
        }
        if (!idColumn) {
          return null;
        }
        const targetIds = db2.select({ id: idColumn }).from(schemaModel).where(...clause).limit(1);
        const deleted = await db2.delete(schemaModel).where(inArray(idColumn, targetIds)).returning();
        return deleted[0] ?? null;
      },
      options: config
    };
  };
  let adapterOptions = null;
  adapterOptions = {
    config: {
      adapterId: "drizzle",
      adapterName: "Drizzle Adapter",
      usePlural: config.usePlural ?? false,
      debugLogs: config.debugLogs ?? false,
      supportsUUIDs: config.provider === "pg" ? true : false,
      supportsJSON: config.provider === "pg" ? true : false,
      supportsArrays: config.provider === "pg" ? true : false,
      customTransformOutput: ({ data, fieldAttributes }) => {
        if (fieldAttributes.type === "date") {
          if (data === null || data === void 0) {
            return data;
          }
          return new Date(data);
        }
        return data;
      },
      transaction: config.transaction ?? false ? (cb) => db.transaction((tx) => {
        const adapter2 = createAdapterFactory({
          config: {
            ...adapterOptions.config,
            transaction: false
          },
          adapter: createCustomAdapter(tx, true)
        })(lazyOptions);
        return cb(adapter2);
      }) : false
    },
    adapter: createCustomAdapter(db)
  };
  const adapter = createAdapterFactory(adapterOptions);
  return (options) => {
    lazyOptions = options;
    return adapter(options);
  };
};
function createDrizzleAdapter(drizzle, db, config, options = {}) {
  return (adapterOptions = {}) => {
    const mergedOptions = {
      ...options,
      ...adapterOptions,
      experimental: {
        ...options.experimental,
        ...adapterOptions.experimental,
        joins: true
        // Enable experimental joins for btst adapters
      },
      plugins: [
        ...options.plugins || [],
        ...adapterOptions.plugins || [],
        // Add Better DB schema as a plugin so getAuthTables can find it
        {
          id: "better-db-schema",
          schema: db.getSchema()
        }
      ]
    };
    return drizzleAdapter(drizzle, config)(mergedOptions);
  };
}
export {
  createDrizzleAdapter as c
};
