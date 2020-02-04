#!/usr/bin/env node
const yargs = require('yargs');

const execute = require('./index');

const args = yargs
  .option('stack-name', {
    alias: 's',
    describe: 'The name of the stack to update.'
  })
  .option('template-file', {
    alias: 'f',
    describe: 'A YML or JSON file containing a new CloudFormation template.'
  })
  .option('capability-iam', {
    boolean: true,
    describe: 'Acknowledge that the template may create IAM resources.'
  })
  .option('capability-named-iam', {
    boolean: true,
    describe: 'Acknowledge that the template may create named IAM resources.'
  })
  .demandOption('stack-name')
  .argv;

execute(args);