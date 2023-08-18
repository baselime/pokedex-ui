const { BaselimeSDK } = require('@baselime/node-opentelemetry');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { PinoInstrumentation } = require('@opentelemetry/instrumentation-pino');

const sdk = new BaselimeSDK({
  instrumentations: [    
    getNodeAutoInstrumentations({}),
    new PinoInstrumentation()
  ],
});

sdk.start();