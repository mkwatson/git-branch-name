#!/usr/bin/env node
'use strict';

const inquirer = require('inquirer');
const username = require('username');

var questions = [{
    name: 'type',
    type: 'list',
    message: 'What type of branch is this:',
    choices: [
        'release',
        'hotfix',
        'feature'
    ]
}, {
    name: 'owner',
    type: 'input',
    message: 'Who is the owner:',
    default: username.sync(),
    when: function(answers) {
        return answers.type == 'feature';
    },

}, {
    name: 'jira',
    type: 'input',
    message: 'What is the Jira ticket number (optional):',
    filter: inputFilter,
    when: function(answers) {
        return ['feature', 'hotfix'].indexOf(answers.type) > -1;
    },
}, {
    name: 'description',
    type: 'input',
    message: 'What is a brief description (present tense):',
    validate: notEmpty('Please enter a description'),
    filter: inputFilter,
    when: function(answers) {
        return ['feature', 'hotfix'].indexOf(answers.type) > -1;
    },
}, {
    name: 'version',
    type: 'input',
    message: 'What is the new version number:',
    validate: notEmpty('Please enter a version number'),
    when: function(answers) {
        return answers.type == 'release';
    },
}]

function inputFilter(s) {
    return s.toLowerCase().replace(/ /g, "-");
}

function notEmpty(msg) {
    return function(x) {
        if (x.length) {
            return true;
        } else {
            return msg;
        }
    }
}

function main() {
    inquirer.prompt(questions).then(function(answers) {
        let arr = Object.keys(answers)
            .map(key => answers[key])
            .filter(v => v != '');
        let branchName = arr.join('/')

        console.log('\ngit checkout -b ' + branchName);
    });
}

main()
