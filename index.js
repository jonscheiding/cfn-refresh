const fs = require('fs');
const AWS = require('aws-sdk');

function delay(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

async function execute(args) {
  const cfn = new AWS.CloudFormation();

  const capabilities = Object.keys(args)
    .filter(arg => arg.startsWith('capability-'))
    .filter(arg => args[arg])
    .map(arg => arg.replace(/-/g, '_').toUpperCase());

  let templateBody = null;
  if(args['template-file']) {
    templateBody = fs.readFileSync(args['template-file']).toString();
  }

  console.log(`Getting previous parameter values for stack '${args['stack-name']}'.`)

  let describeResult = await cfn
    .describeStacks({
      StackName: args['stack-name']
    })
    .promise();

  const parameters = describeResult.Stacks[0].Parameters;

  console.log(`Updating stack '${args['stack-name']}'.`);

  try {
    await cfn
      .updateStack({
        StackName: args['stack-name'],
        Parameters: parameters,
        UsePreviousTemplate: templateBody === null,
        TemplateBody: templateBody,
        Capabilities: capabilities
      })
      .promise();
  } catch(e) {
    switch(e.code) {
      case 'InsufficientCapabilitiesException':
        console.error(`Stack update failed due to missing capabilities. ${e.message}.`)
        console.error('Use the various --capability-* arguments to provide them.');
        break;
      case 'ValidationError':
        console.error(e.message);
        break;
      default:
        console.error(e);
        break;
    }
  }

  let complete = false;

  do {
    describeResult = await cfn
      .describeStacks({
        StackName: args['stack-name']
      })
      .promise();

    const status = describeResult.Stacks[0].StackStatus;
    console.log(status);
    complete = status === 'UPDATE_COMPLETE' || status === 'UPDATE_ROLLBACK_COMPLETE'

    if(!complete) {
      await delay(5000);
    }
  } while(!complete);

  for(const o of describeResult.Stacks[0].Outputs) {
    console.log(`${o.ExportName} : ${o.OutputValue}`);
  }
}

module.exports = execute;
