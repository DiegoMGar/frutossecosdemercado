import {
  AttributeMap,
  GetItemOutput,
  PutItemInput,
  PutItemInputAttributeMap,
  ScanOutput,
} from 'aws-sdk/clients/dynamodb';
import { RuntimeException } from '../errors/Runtime.exception';
import { Pedido } from '../models/Pedido';
import { Producto } from '../models/Producto';

type Entity = Pedido | Producto;

export interface EntityDynamoDBConfiguration {
  tableName: string;
  factoryDefaultClass: string;
}

export default abstract class TransformEntityDynamodb {
  protected abstract run(input: any): Promise<any>;

  protected entityFactory(): Entity {
    switch (this.config.factoryDefaultClass) {
      case 'Pedido':
        return new Pedido();
      case 'Producto':
        return new Producto({});
      default:
        throw new RuntimeException(
          'RuntimeException: entity factory failed instance.',
        );
    }
  }

  protected constructor(protected config: EntityDynamoDBConfiguration) {}

  transformFromScan(result: ScanOutput): Entity[] {
    return result.Items.map((item: AttributeMap) => {
      const entity = this.entityFactory();
      Object.keys(entity).forEach((k: string) => {
        entity[k] = item[k] ? item[k][entity.propType(k)] : null;
      });
      return entity;
    });
  }

  transformFromGetItem(result: GetItemOutput): Entity {
    if (!result.Item) {
      return null;
    }
    const entity = this.entityFactory();
    Object.keys(entity).forEach((k: string) => {
      entity[k] = result.Item[k] ? result.Item[k][entity.propType(k)] : null;
    });
    return entity;
  }

  transformToPutItem(input: Entity): PutItemInput {
    return {
      TableName: this.config.tableName,
      ReturnConsumedCapacity: 'TOTAL',
      ReturnItemCollectionMetrics: 'SIZE',
      Item: this.entityToItem(input),
    };
  }

  private entityToItem(entity: Entity): PutItemInputAttributeMap {
    const item: PutItemInputAttributeMap = {};
    Object.keys(entity)
      .filter((k: string) => entity[k] !== null && entity[k] !== undefined)
      .forEach((k: string) => {
        item[k] = {};
        item[k][entity.propType(k)] = entity[k];
      });
    return item;
  }
}
