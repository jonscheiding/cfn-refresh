# cfn-refresh

Command-line tool to easily update a CloudFormation stack using a local template file.  It automates the re-use of existing parameter values so that you can quickly iterate on a template.

This tool is meant to speed up the feedback cycle of making incremental changes to a CloudFormation template.  It does not handle:

* Creating the stack initially
* Changing the values for an existing parameter
* Parameters being added or removed

For these scenarios, you will still want to use the CloudFormation UI while iterating on a template.

## Setup

### Install

```bash
$ yarn global add https://github.com/jonscheiding/cfn-refresh
# or
$ npm install -g https://github.com/jonscheiding/cfn-refresh
```

### Update

```bash
$ yarn global upgrade cfn-refresh
# or
$ npm upgrade -g cfn-refresh
```

## Usage

```bash
$ cfn-refresh --help
Options:
  --help                  Show help                                    [boolean]
  --version               Show version number                          [boolean]
  --stack-name, -s        The name of the stack to update.            [required]
  --template-file, -f     A YML or JSON file containing a new CloudFormation
                          template.
  --capability-iam        Acknowledge that the template may create IAM
                          resources.                                   [boolean]
  --capability-named-iam  Acknowledge that the template may create named IAM
                          resources.                                   [boolean]

$ cfn-refresh --stack-name MyStack --template-file .\template.yml
Getting previous parameter values for stack 'MyStack'.
Updating stack 'MyStack'.
UPDATE_IN_PROGRESS
UPDATE_IN_PROGRESS
UPDATE_COMPLETE_CLEANUP_IN_PROGRESS
UPDATE_COMPLETE
Output1 : My Output Value
Output2 : Your Output Value
```

This will initiate an update of the named stack, optionally with a new template.  The previous parameter values will be re-used.  Any stack outputs will be displayed.
