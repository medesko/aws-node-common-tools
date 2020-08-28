import { SSM } from 'aws-sdk';
import { PSParameterValue } from 'aws-sdk/clients/ssm';

class SsmClient {
  constructor(public ssm: SSM) {}

  async getParameter(param: string): Promise<PSParameterValue> {
    const config = await this.ssm.getParameter({ Name: param, WithDecryption: true }).promise();
    return config.Parameter.Value;
  }
}

export { SsmClient };
