import awsSdk from 'aws-sdk';
import DynamoDB, {
  GetItemInput,
  GetItemOutput,
  PutItemInput,
  PutItemOutput,
  ScanInput,
  ScanOutput,
} from 'aws-sdk/clients/dynamodb';

export default class DynamodbRepo {
  dynamoctl: DynamoDB;

  constructor(dynamoctl: DynamoDB = null) {
    const options: DynamoDB.Types.ClientConfiguration = {
      apiVersion: '2012-08-10',
    };
    if (process.env.stage === 'test') {
      options.endpoint = process.env.AWS_TEST_DYNAMODB_URL;
    }
    if (!dynamoctl) {
      this.dynamoctl = new awsSdk.DynamoDB(options);
    } else {
      this.dynamoctl = dynamoctl;
    }
  }

  scanItems(scanQuery: ScanInput): Promise<ScanOutput> {
    return new Promise((resolve, reject) => {
      this.dynamoctl.scan(
        {
          TableName: scanQuery.TableName,
          AttributesToGet: scanQuery.AttributesToGet,
          ScanFilter: scanQuery.ScanFilter,
        },
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        },
      );
    });
  }

  getItem(queryInput: GetItemInput): Promise<GetItemOutput> {
    return new Promise((resolve, reject) => {
      this.dynamoctl.getItem(queryInput, (err, data) => {
        if (err) {
          console.error(
            'Unable to getItem. Error:',
            JSON.stringify(err, null, 2),
            JSON.stringify(queryInput, null, 2),
          );
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  putItem(queryPut: PutItemInput): Promise<PutItemOutput> {
    return new Promise((resolve, reject) => {
      this.dynamoctl.putItem(queryPut, (err, data) => {
        if (err) {
          console.error(
            'Unable to putItem. Error:',
            JSON.stringify(err, null, 2),
            JSON.stringify(queryPut, null, 2),
          );
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
