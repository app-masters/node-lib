type ObjectId = string | number;
type NodeLib$QueryS = Object;

declare class NodeLib$ModelSequelize<Schema, Options>{
  constructor (): this;
  static setup (sequelize: Object, modelName: string, schema: Object, instance: Object, relationArray: ?Array<NodeLib$ModelSequelize<any, any>>): void;
  static create (obj: {...Schema}): Promise<Object>;
  static find (where: {...Schema}, include: ?string, order: ?string): Promise<?Array<{...Schema, ...Options}>>;
  static findById (id: ObjectId, include: ?string): Promise<?{...Schema, ...Options}>;
  static findOne (where: {...Schema}, include: ?string): Promise<?{...Schema, ...Options}>;
  static update (where: {...Schema}, obj: Object): Promise<boolean>;
  static delete (where: {...Schema}): Promise<boolean>;
}
declare class NodeLib$ModelMongoose<Schema>{
  constructor (): this;
  static setup (modelName: string, schema: Object, instance: Object, relationArray: ?Array<NodeLib$ModelSequelize<any>>): void;
  static create (obj: Schema): Promise<Object>;
  static find (where: Schema, include: ?string, order: ?string): Promise<?Array<Schema>>;
  static findById (id: ObjectId, include: ?string): Promise<?Schema>;
  static findOne (where: Object, include: ?string): Promise<?Schema>;
  static update (where: Object, obj: Object): Promise<boolean>;
  static delete (where: Object): Promise<boolean>;
}
declare module '@app-masters/node-lib' {
  declare export type NodeLibModelS<Schema> = NodeLib$ModelSequelize<Schema>;
  declare export type QueryS = NodeLib$QueryS;
  declare module.exports: {
    ModelSequelize: typeof NodeLib$ModelSequelize
  }
}
