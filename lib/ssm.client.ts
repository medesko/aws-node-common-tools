import { SSM } from 'aws-sdk';
import { PSParameterValue, GetParameterResult } from 'aws-sdk/clients/ssm';

interface Inputs {
  name: string;
  type: string;
  value: string;
}

class SsmClient {
  constructor(public ssm: SSM) {}

  async createParameter(inputs: Inputs[]) {
    return await Promise.all(
      inputs.map(async ({ name, type, value }: Inputs) => {
        const result = await this.ssm
          .putParameter({ Name: name, Type: type, Value: value, Overwrite: true })
          .promise();

        return result;
      }),
    );
  }

  async getOneParameter(param: string): Promise<PSParameterValue | undefined> {
    const config = await this.ssm.getParameter({ Name: param, WithDecryption: true }).promise();
    return config.Parameter?.Value;
  }

  async getAllParameters(): Promise<PSParameterValue[] | undefined> {
    const params = await this.ssm.describeParameters().promise();
    if (params.Parameters)
      return await Promise.all(
        params.Parameters.map(async (param: SSM.ParameterMetadata) => {
          if (param.Type === 'SecureString') {
            return `${param.Name}: ****SECRET****`;
          }

          const paramName = await this.getOneParameter(param.Name as string);

          return `${param.Name}: ${paramName}`;
        }),
      );
  }
}

export { SsmClient };
