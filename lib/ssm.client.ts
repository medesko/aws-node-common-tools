import { SSM } from 'aws-sdk';
import { PSParameterValue } from 'aws-sdk/clients/ssm';
import { log } from './log.utilities';

interface Inputs {
  name: string;
  type: string;
  value: string;
}

class SsmClient {
  constructor(public ssm: SSM) {}

  async createParameter(inputs: any) {
    return await Promise.all(
      inputs.map(async ({ name, type, value }: Inputs) => {
        log.debug(`Creating ${name}`);
        const result = await this.ssm
          .putParameter({ Name: name, Type: type, Value: value })
          .promise();

        return result;
      }),
    );
  }

  async getParameter(param: string): Promise<PSParameterValue> {
    const config = await this.ssm.getParameter({ Name: param, WithDecryption: true }).promise();
    return config.Parameter.Value;
  }

  async getAllParameters(): Promise<PSParameterValue[]> {
    const params = await this.ssm.describeParameters().promise();
    return await Promise.all(
      params.Parameters.map(async (param: SSM.ParameterMetadata) => {
        if (param.Type === 'SecureString') {
          return `${param.Name}: ****SECRET****`;
        }

        const config = await this.ssm
          .getParameter({ Name: param.Name, WithDecryption: true })
          .promise();

        return `${param.Name}: ${config.Parameter.Value}`;
      }),
    );
  }
}

export { SsmClient };
