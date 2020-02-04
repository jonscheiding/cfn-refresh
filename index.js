const yargs = require('yargs');

const args = yargs
  .option('stack-name', {
    alias: 's',
    describe: 'The name of the stack to update.'
  })
  .option('template-file', {
    alias: 'f',
    describe: 'A YML or JSON file containing a new CloudFormation template.'
  })
  .demandOption('stack-name')
  .argv;

console.log(`Updating stack '${args['stack-name']}'.`);
if(args['template-file']) {
  console.log(`Will use template from '${args['template-file']}'.`);
} else {
  console.log('Will re-use existing template.');
}
