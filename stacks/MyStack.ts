import { StackContext, Service } from "sst/constructs";
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";

export function API({ stack }: StackContext) {
  const key = StringParameter.valueForStringParameter(stack, 'baselime-key');
  
  const service = new Service(stack, 'sst-service', {
    path: './',
    environment: {
      BASELIME_KEY: key
    },
    cdk: {
      fargateService: {
        assignPublicIp: true,
        circuitBreaker: { rollback: true },
      },
      vpc: new Vpc(stack, 'sst-vpc', { 
        subnetConfiguration: [
          {
            name: "public-subnet",
            subnetType: SubnetType.PUBLIC,
            cidrMask: 24,
          },
        ],
        natGateways: 0
      }),
      container: {
        logging: new ecs.FireLensLogDriver({
          options: {
            "Name": "http",
            "Host": "ecs-logs-ingest.baselime.io",
            "Port": "443",
            "TLS": "on",
            "format": "json",
            "retry_limit": "2",
            "header": `x-api-key ${key}`,
          },
        }),
      }
    }
  });
  stack.addOutputs({
    URL: service.url
  })
}
