
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model GreetingLog
 * 
 */
export type GreetingLog = $Result.DefaultSelection<Prisma.$GreetingLogPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more GreetingLogs
 * const greetingLogs = await prisma.greetingLog.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more GreetingLogs
   * const greetingLogs = await prisma.greetingLog.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.greetingLog`: Exposes CRUD operations for the **GreetingLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GreetingLogs
    * const greetingLogs = await prisma.greetingLog.findMany()
    * ```
    */
  get greetingLog(): Prisma.GreetingLogDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    GreetingLog: 'GreetingLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "greetingLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      GreetingLog: {
        payload: Prisma.$GreetingLogPayload<ExtArgs>
        fields: Prisma.GreetingLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GreetingLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GreetingLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GreetingLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GreetingLogPayload>
          }
          findFirst: {
            args: Prisma.GreetingLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GreetingLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GreetingLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GreetingLogPayload>
          }
          findMany: {
            args: Prisma.GreetingLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GreetingLogPayload>[]
          }
          create: {
            args: Prisma.GreetingLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GreetingLogPayload>
          }
          createMany: {
            args: Prisma.GreetingLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GreetingLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GreetingLogPayload>[]
          }
          delete: {
            args: Prisma.GreetingLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GreetingLogPayload>
          }
          update: {
            args: Prisma.GreetingLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GreetingLogPayload>
          }
          deleteMany: {
            args: Prisma.GreetingLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GreetingLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GreetingLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GreetingLogPayload>
          }
          aggregate: {
            args: Prisma.GreetingLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGreetingLog>
          }
          groupBy: {
            args: Prisma.GreetingLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<GreetingLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.GreetingLogCountArgs<ExtArgs>
            result: $Utils.Optional<GreetingLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model GreetingLog
   */

  export type AggregateGreetingLog = {
    _count: GreetingLogCountAggregateOutputType | null
    _min: GreetingLogMinAggregateOutputType | null
    _max: GreetingLogMaxAggregateOutputType | null
  }

  export type GreetingLogMinAggregateOutputType = {
    id: string | null
    endpoint: string | null
    message: string | null
    userName: string | null
    userId: string | null
    userRole: string | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type GreetingLogMaxAggregateOutputType = {
    id: string | null
    endpoint: string | null
    message: string | null
    userName: string | null
    userId: string | null
    userRole: string | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date | null
  }

  export type GreetingLogCountAggregateOutputType = {
    id: number
    endpoint: number
    message: number
    userName: number
    userId: number
    userRole: number
    ipAddress: number
    userAgent: number
    createdAt: number
    _all: number
  }


  export type GreetingLogMinAggregateInputType = {
    id?: true
    endpoint?: true
    message?: true
    userName?: true
    userId?: true
    userRole?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
  }

  export type GreetingLogMaxAggregateInputType = {
    id?: true
    endpoint?: true
    message?: true
    userName?: true
    userId?: true
    userRole?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
  }

  export type GreetingLogCountAggregateInputType = {
    id?: true
    endpoint?: true
    message?: true
    userName?: true
    userId?: true
    userRole?: true
    ipAddress?: true
    userAgent?: true
    createdAt?: true
    _all?: true
  }

  export type GreetingLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GreetingLog to aggregate.
     */
    where?: GreetingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GreetingLogs to fetch.
     */
    orderBy?: GreetingLogOrderByWithRelationInput | GreetingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GreetingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GreetingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GreetingLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GreetingLogs
    **/
    _count?: true | GreetingLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GreetingLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GreetingLogMaxAggregateInputType
  }

  export type GetGreetingLogAggregateType<T extends GreetingLogAggregateArgs> = {
        [P in keyof T & keyof AggregateGreetingLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGreetingLog[P]>
      : GetScalarType<T[P], AggregateGreetingLog[P]>
  }




  export type GreetingLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GreetingLogWhereInput
    orderBy?: GreetingLogOrderByWithAggregationInput | GreetingLogOrderByWithAggregationInput[]
    by: GreetingLogScalarFieldEnum[] | GreetingLogScalarFieldEnum
    having?: GreetingLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GreetingLogCountAggregateInputType | true
    _min?: GreetingLogMinAggregateInputType
    _max?: GreetingLogMaxAggregateInputType
  }

  export type GreetingLogGroupByOutputType = {
    id: string
    endpoint: string
    message: string
    userName: string | null
    userId: string | null
    userRole: string | null
    ipAddress: string | null
    userAgent: string | null
    createdAt: Date
    _count: GreetingLogCountAggregateOutputType | null
    _min: GreetingLogMinAggregateOutputType | null
    _max: GreetingLogMaxAggregateOutputType | null
  }

  type GetGreetingLogGroupByPayload<T extends GreetingLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GreetingLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GreetingLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GreetingLogGroupByOutputType[P]>
            : GetScalarType<T[P], GreetingLogGroupByOutputType[P]>
        }
      >
    >


  export type GreetingLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    endpoint?: boolean
    message?: boolean
    userName?: boolean
    userId?: boolean
    userRole?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["greetingLog"]>

  export type GreetingLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    endpoint?: boolean
    message?: boolean
    userName?: boolean
    userId?: boolean
    userRole?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["greetingLog"]>

  export type GreetingLogSelectScalar = {
    id?: boolean
    endpoint?: boolean
    message?: boolean
    userName?: boolean
    userId?: boolean
    userRole?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    createdAt?: boolean
  }


  export type $GreetingLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GreetingLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      endpoint: string
      message: string
      userName: string | null
      userId: string | null
      userRole: string | null
      ipAddress: string | null
      userAgent: string | null
      createdAt: Date
    }, ExtArgs["result"]["greetingLog"]>
    composites: {}
  }

  type GreetingLogGetPayload<S extends boolean | null | undefined | GreetingLogDefaultArgs> = $Result.GetResult<Prisma.$GreetingLogPayload, S>

  type GreetingLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GreetingLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GreetingLogCountAggregateInputType | true
    }

  export interface GreetingLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GreetingLog'], meta: { name: 'GreetingLog' } }
    /**
     * Find zero or one GreetingLog that matches the filter.
     * @param {GreetingLogFindUniqueArgs} args - Arguments to find a GreetingLog
     * @example
     * // Get one GreetingLog
     * const greetingLog = await prisma.greetingLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GreetingLogFindUniqueArgs>(args: SelectSubset<T, GreetingLogFindUniqueArgs<ExtArgs>>): Prisma__GreetingLogClient<$Result.GetResult<Prisma.$GreetingLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one GreetingLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GreetingLogFindUniqueOrThrowArgs} args - Arguments to find a GreetingLog
     * @example
     * // Get one GreetingLog
     * const greetingLog = await prisma.greetingLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GreetingLogFindUniqueOrThrowArgs>(args: SelectSubset<T, GreetingLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GreetingLogClient<$Result.GetResult<Prisma.$GreetingLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first GreetingLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GreetingLogFindFirstArgs} args - Arguments to find a GreetingLog
     * @example
     * // Get one GreetingLog
     * const greetingLog = await prisma.greetingLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GreetingLogFindFirstArgs>(args?: SelectSubset<T, GreetingLogFindFirstArgs<ExtArgs>>): Prisma__GreetingLogClient<$Result.GetResult<Prisma.$GreetingLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first GreetingLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GreetingLogFindFirstOrThrowArgs} args - Arguments to find a GreetingLog
     * @example
     * // Get one GreetingLog
     * const greetingLog = await prisma.greetingLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GreetingLogFindFirstOrThrowArgs>(args?: SelectSubset<T, GreetingLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__GreetingLogClient<$Result.GetResult<Prisma.$GreetingLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more GreetingLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GreetingLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GreetingLogs
     * const greetingLogs = await prisma.greetingLog.findMany()
     * 
     * // Get first 10 GreetingLogs
     * const greetingLogs = await prisma.greetingLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const greetingLogWithIdOnly = await prisma.greetingLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GreetingLogFindManyArgs>(args?: SelectSubset<T, GreetingLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GreetingLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a GreetingLog.
     * @param {GreetingLogCreateArgs} args - Arguments to create a GreetingLog.
     * @example
     * // Create one GreetingLog
     * const GreetingLog = await prisma.greetingLog.create({
     *   data: {
     *     // ... data to create a GreetingLog
     *   }
     * })
     * 
     */
    create<T extends GreetingLogCreateArgs>(args: SelectSubset<T, GreetingLogCreateArgs<ExtArgs>>): Prisma__GreetingLogClient<$Result.GetResult<Prisma.$GreetingLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many GreetingLogs.
     * @param {GreetingLogCreateManyArgs} args - Arguments to create many GreetingLogs.
     * @example
     * // Create many GreetingLogs
     * const greetingLog = await prisma.greetingLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GreetingLogCreateManyArgs>(args?: SelectSubset<T, GreetingLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GreetingLogs and returns the data saved in the database.
     * @param {GreetingLogCreateManyAndReturnArgs} args - Arguments to create many GreetingLogs.
     * @example
     * // Create many GreetingLogs
     * const greetingLog = await prisma.greetingLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GreetingLogs and only return the `id`
     * const greetingLogWithIdOnly = await prisma.greetingLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GreetingLogCreateManyAndReturnArgs>(args?: SelectSubset<T, GreetingLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GreetingLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a GreetingLog.
     * @param {GreetingLogDeleteArgs} args - Arguments to delete one GreetingLog.
     * @example
     * // Delete one GreetingLog
     * const GreetingLog = await prisma.greetingLog.delete({
     *   where: {
     *     // ... filter to delete one GreetingLog
     *   }
     * })
     * 
     */
    delete<T extends GreetingLogDeleteArgs>(args: SelectSubset<T, GreetingLogDeleteArgs<ExtArgs>>): Prisma__GreetingLogClient<$Result.GetResult<Prisma.$GreetingLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one GreetingLog.
     * @param {GreetingLogUpdateArgs} args - Arguments to update one GreetingLog.
     * @example
     * // Update one GreetingLog
     * const greetingLog = await prisma.greetingLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GreetingLogUpdateArgs>(args: SelectSubset<T, GreetingLogUpdateArgs<ExtArgs>>): Prisma__GreetingLogClient<$Result.GetResult<Prisma.$GreetingLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more GreetingLogs.
     * @param {GreetingLogDeleteManyArgs} args - Arguments to filter GreetingLogs to delete.
     * @example
     * // Delete a few GreetingLogs
     * const { count } = await prisma.greetingLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GreetingLogDeleteManyArgs>(args?: SelectSubset<T, GreetingLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GreetingLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GreetingLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GreetingLogs
     * const greetingLog = await prisma.greetingLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GreetingLogUpdateManyArgs>(args: SelectSubset<T, GreetingLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GreetingLog.
     * @param {GreetingLogUpsertArgs} args - Arguments to update or create a GreetingLog.
     * @example
     * // Update or create a GreetingLog
     * const greetingLog = await prisma.greetingLog.upsert({
     *   create: {
     *     // ... data to create a GreetingLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GreetingLog we want to update
     *   }
     * })
     */
    upsert<T extends GreetingLogUpsertArgs>(args: SelectSubset<T, GreetingLogUpsertArgs<ExtArgs>>): Prisma__GreetingLogClient<$Result.GetResult<Prisma.$GreetingLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of GreetingLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GreetingLogCountArgs} args - Arguments to filter GreetingLogs to count.
     * @example
     * // Count the number of GreetingLogs
     * const count = await prisma.greetingLog.count({
     *   where: {
     *     // ... the filter for the GreetingLogs we want to count
     *   }
     * })
    **/
    count<T extends GreetingLogCountArgs>(
      args?: Subset<T, GreetingLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GreetingLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GreetingLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GreetingLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GreetingLogAggregateArgs>(args: Subset<T, GreetingLogAggregateArgs>): Prisma.PrismaPromise<GetGreetingLogAggregateType<T>>

    /**
     * Group by GreetingLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GreetingLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GreetingLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GreetingLogGroupByArgs['orderBy'] }
        : { orderBy?: GreetingLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GreetingLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGreetingLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GreetingLog model
   */
  readonly fields: GreetingLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GreetingLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GreetingLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GreetingLog model
   */ 
  interface GreetingLogFieldRefs {
    readonly id: FieldRef<"GreetingLog", 'String'>
    readonly endpoint: FieldRef<"GreetingLog", 'String'>
    readonly message: FieldRef<"GreetingLog", 'String'>
    readonly userName: FieldRef<"GreetingLog", 'String'>
    readonly userId: FieldRef<"GreetingLog", 'String'>
    readonly userRole: FieldRef<"GreetingLog", 'String'>
    readonly ipAddress: FieldRef<"GreetingLog", 'String'>
    readonly userAgent: FieldRef<"GreetingLog", 'String'>
    readonly createdAt: FieldRef<"GreetingLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GreetingLog findUnique
   */
  export type GreetingLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GreetingLog
     */
    select?: GreetingLogSelect<ExtArgs> | null
    /**
     * Filter, which GreetingLog to fetch.
     */
    where: GreetingLogWhereUniqueInput
  }

  /**
   * GreetingLog findUniqueOrThrow
   */
  export type GreetingLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GreetingLog
     */
    select?: GreetingLogSelect<ExtArgs> | null
    /**
     * Filter, which GreetingLog to fetch.
     */
    where: GreetingLogWhereUniqueInput
  }

  /**
   * GreetingLog findFirst
   */
  export type GreetingLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GreetingLog
     */
    select?: GreetingLogSelect<ExtArgs> | null
    /**
     * Filter, which GreetingLog to fetch.
     */
    where?: GreetingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GreetingLogs to fetch.
     */
    orderBy?: GreetingLogOrderByWithRelationInput | GreetingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GreetingLogs.
     */
    cursor?: GreetingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GreetingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GreetingLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GreetingLogs.
     */
    distinct?: GreetingLogScalarFieldEnum | GreetingLogScalarFieldEnum[]
  }

  /**
   * GreetingLog findFirstOrThrow
   */
  export type GreetingLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GreetingLog
     */
    select?: GreetingLogSelect<ExtArgs> | null
    /**
     * Filter, which GreetingLog to fetch.
     */
    where?: GreetingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GreetingLogs to fetch.
     */
    orderBy?: GreetingLogOrderByWithRelationInput | GreetingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GreetingLogs.
     */
    cursor?: GreetingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GreetingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GreetingLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GreetingLogs.
     */
    distinct?: GreetingLogScalarFieldEnum | GreetingLogScalarFieldEnum[]
  }

  /**
   * GreetingLog findMany
   */
  export type GreetingLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GreetingLog
     */
    select?: GreetingLogSelect<ExtArgs> | null
    /**
     * Filter, which GreetingLogs to fetch.
     */
    where?: GreetingLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GreetingLogs to fetch.
     */
    orderBy?: GreetingLogOrderByWithRelationInput | GreetingLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GreetingLogs.
     */
    cursor?: GreetingLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GreetingLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GreetingLogs.
     */
    skip?: number
    distinct?: GreetingLogScalarFieldEnum | GreetingLogScalarFieldEnum[]
  }

  /**
   * GreetingLog create
   */
  export type GreetingLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GreetingLog
     */
    select?: GreetingLogSelect<ExtArgs> | null
    /**
     * The data needed to create a GreetingLog.
     */
    data: XOR<GreetingLogCreateInput, GreetingLogUncheckedCreateInput>
  }

  /**
   * GreetingLog createMany
   */
  export type GreetingLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GreetingLogs.
     */
    data: GreetingLogCreateManyInput | GreetingLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GreetingLog createManyAndReturn
   */
  export type GreetingLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GreetingLog
     */
    select?: GreetingLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many GreetingLogs.
     */
    data: GreetingLogCreateManyInput | GreetingLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GreetingLog update
   */
  export type GreetingLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GreetingLog
     */
    select?: GreetingLogSelect<ExtArgs> | null
    /**
     * The data needed to update a GreetingLog.
     */
    data: XOR<GreetingLogUpdateInput, GreetingLogUncheckedUpdateInput>
    /**
     * Choose, which GreetingLog to update.
     */
    where: GreetingLogWhereUniqueInput
  }

  /**
   * GreetingLog updateMany
   */
  export type GreetingLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GreetingLogs.
     */
    data: XOR<GreetingLogUpdateManyMutationInput, GreetingLogUncheckedUpdateManyInput>
    /**
     * Filter which GreetingLogs to update
     */
    where?: GreetingLogWhereInput
  }

  /**
   * GreetingLog upsert
   */
  export type GreetingLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GreetingLog
     */
    select?: GreetingLogSelect<ExtArgs> | null
    /**
     * The filter to search for the GreetingLog to update in case it exists.
     */
    where: GreetingLogWhereUniqueInput
    /**
     * In case the GreetingLog found by the `where` argument doesn't exist, create a new GreetingLog with this data.
     */
    create: XOR<GreetingLogCreateInput, GreetingLogUncheckedCreateInput>
    /**
     * In case the GreetingLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GreetingLogUpdateInput, GreetingLogUncheckedUpdateInput>
  }

  /**
   * GreetingLog delete
   */
  export type GreetingLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GreetingLog
     */
    select?: GreetingLogSelect<ExtArgs> | null
    /**
     * Filter which GreetingLog to delete.
     */
    where: GreetingLogWhereUniqueInput
  }

  /**
   * GreetingLog deleteMany
   */
  export type GreetingLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GreetingLogs to delete
     */
    where?: GreetingLogWhereInput
  }

  /**
   * GreetingLog without action
   */
  export type GreetingLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GreetingLog
     */
    select?: GreetingLogSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const GreetingLogScalarFieldEnum: {
    id: 'id',
    endpoint: 'endpoint',
    message: 'message',
    userName: 'userName',
    userId: 'userId',
    userRole: 'userRole',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    createdAt: 'createdAt'
  };

  export type GreetingLogScalarFieldEnum = (typeof GreetingLogScalarFieldEnum)[keyof typeof GreetingLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type GreetingLogWhereInput = {
    AND?: GreetingLogWhereInput | GreetingLogWhereInput[]
    OR?: GreetingLogWhereInput[]
    NOT?: GreetingLogWhereInput | GreetingLogWhereInput[]
    id?: StringFilter<"GreetingLog"> | string
    endpoint?: StringFilter<"GreetingLog"> | string
    message?: StringFilter<"GreetingLog"> | string
    userName?: StringNullableFilter<"GreetingLog"> | string | null
    userId?: StringNullableFilter<"GreetingLog"> | string | null
    userRole?: StringNullableFilter<"GreetingLog"> | string | null
    ipAddress?: StringNullableFilter<"GreetingLog"> | string | null
    userAgent?: StringNullableFilter<"GreetingLog"> | string | null
    createdAt?: DateTimeFilter<"GreetingLog"> | Date | string
  }

  export type GreetingLogOrderByWithRelationInput = {
    id?: SortOrder
    endpoint?: SortOrder
    message?: SortOrder
    userName?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    userRole?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type GreetingLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GreetingLogWhereInput | GreetingLogWhereInput[]
    OR?: GreetingLogWhereInput[]
    NOT?: GreetingLogWhereInput | GreetingLogWhereInput[]
    endpoint?: StringFilter<"GreetingLog"> | string
    message?: StringFilter<"GreetingLog"> | string
    userName?: StringNullableFilter<"GreetingLog"> | string | null
    userId?: StringNullableFilter<"GreetingLog"> | string | null
    userRole?: StringNullableFilter<"GreetingLog"> | string | null
    ipAddress?: StringNullableFilter<"GreetingLog"> | string | null
    userAgent?: StringNullableFilter<"GreetingLog"> | string | null
    createdAt?: DateTimeFilter<"GreetingLog"> | Date | string
  }, "id">

  export type GreetingLogOrderByWithAggregationInput = {
    id?: SortOrder
    endpoint?: SortOrder
    message?: SortOrder
    userName?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    userRole?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: GreetingLogCountOrderByAggregateInput
    _max?: GreetingLogMaxOrderByAggregateInput
    _min?: GreetingLogMinOrderByAggregateInput
  }

  export type GreetingLogScalarWhereWithAggregatesInput = {
    AND?: GreetingLogScalarWhereWithAggregatesInput | GreetingLogScalarWhereWithAggregatesInput[]
    OR?: GreetingLogScalarWhereWithAggregatesInput[]
    NOT?: GreetingLogScalarWhereWithAggregatesInput | GreetingLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GreetingLog"> | string
    endpoint?: StringWithAggregatesFilter<"GreetingLog"> | string
    message?: StringWithAggregatesFilter<"GreetingLog"> | string
    userName?: StringNullableWithAggregatesFilter<"GreetingLog"> | string | null
    userId?: StringNullableWithAggregatesFilter<"GreetingLog"> | string | null
    userRole?: StringNullableWithAggregatesFilter<"GreetingLog"> | string | null
    ipAddress?: StringNullableWithAggregatesFilter<"GreetingLog"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"GreetingLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"GreetingLog"> | Date | string
  }

  export type GreetingLogCreateInput = {
    id?: string
    endpoint: string
    message: string
    userName?: string | null
    userId?: string | null
    userRole?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type GreetingLogUncheckedCreateInput = {
    id?: string
    endpoint: string
    message: string
    userName?: string | null
    userId?: string | null
    userRole?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type GreetingLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    userName?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GreetingLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    userName?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GreetingLogCreateManyInput = {
    id?: string
    endpoint: string
    message: string
    userName?: string | null
    userId?: string | null
    userRole?: string | null
    ipAddress?: string | null
    userAgent?: string | null
    createdAt?: Date | string
  }

  export type GreetingLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    userName?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GreetingLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    endpoint?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    userName?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    userRole?: NullableStringFieldUpdateOperationsInput | string | null
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type GreetingLogCountOrderByAggregateInput = {
    id?: SortOrder
    endpoint?: SortOrder
    message?: SortOrder
    userName?: SortOrder
    userId?: SortOrder
    userRole?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type GreetingLogMaxOrderByAggregateInput = {
    id?: SortOrder
    endpoint?: SortOrder
    message?: SortOrder
    userName?: SortOrder
    userId?: SortOrder
    userRole?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type GreetingLogMinOrderByAggregateInput = {
    id?: SortOrder
    endpoint?: SortOrder
    message?: SortOrder
    userName?: SortOrder
    userId?: SortOrder
    userRole?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use GreetingLogDefaultArgs instead
     */
    export type GreetingLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GreetingLogDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}