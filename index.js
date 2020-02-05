const fs = require('fs');
const AWS = require('aws-sdk');

const cfn = new AWS.CloudFormation();

async function execute(args) {
  const stackName = args['stack-name'];

  console.log(`Getting previous parameter values for stack '${stackName}'.`)
  let stackResult = await describeStack(stackName);

  console.log(`Updating stack '${stackName}'.`);
  await beginUpdateStack(args, stackResult.Parameters);

  stackResult = await waitForUpdateToComplete(stackName);

  for(const o of stackResult.Outputs) {
    console.log(`${o.ExportName} : ${o.OutputValue}`);
  }
}

async function beginUpdateStack(args, parameters) {
  const stackName = args['stack-name'];
  const capabilities = parseCapabilities(args);

  let templateBody = null;
  if(args['template-file']) {
    templateBody = fs.readFileSync(args['template-file']).toString();
  }

  try {
    await cfn
      .updateStack({
        StackName: stackName,
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
}

async function waitForUpdateToComplete(stackName) {
  let stackResult;
  let complete = false;
  
  do {
    stackResult = await describeStack(stackName);
    
    const status = stackResult.StackStatus;
    console.log(status);
    
    complete = status === 'UPDATE_COMPLETE'
    || status === 'UPDATE_ROLLBACK_COMPLETE';
    
    if (!complete) {
      await delay(5000);
    }
  } while (!complete);
  
  return stackResult;
}

async function describeStack(stackName) {
  let describeResult = await cfn
  .describeStacks({
    StackName: stackName
  })
  .promise();

  return describeResult.Stacks[0];
}

function parseCapabilities(args) {
  return Object.keys(args)
    .filter(arg => arg.startsWith('capability-'))
    .filter(arg => args[arg])
    .map(arg => arg.replace(/-/g, '_').toUpperCase());
}

function delay(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

module.exports = execute;
