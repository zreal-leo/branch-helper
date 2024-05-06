#! /usr/bin/env node
import inquirer from "inquirer";
import { to } from "await-to-js";
import chalk from "chalk";
import "zx/globals";
import { readJson, writeJson } from "fs-extra/esm";

const successLog = msg => console.log(chalk.green(msg));
const errorLog = msg => console.log(chalk.red(msg));

export function prompt(sourceBranch) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "branchName",
                message: "Please enter branch name",
                validate: value => {
                    return value.trim() ? true : "分支名不能为空";
                },
                filter: val => val.trim()
            },
            {
                type: "input",
                name: "branchDesc",
                message: "Please enter branch description",
                filter: val => val.trim()
            }
        ])
        .then(async answers => {
            const { branchName, branchDesc } = answers;
            await createBranch(branchName, sourceBranch);
            await writeLog({ branchName, branchDesc });
        })
        .catch(err => {
            errorLog(err);
        });
}

async function createBranch(branchName, sourceBranch) {
    await $`git checkout -b ${branchName} origin/${sourceBranch}`;
}

async function writeLog({ branchName, branchDesc }) {
    const fileName = "branch.log";
    const filePath = path.join(process.cwd(), fileName);

    const [err, content = ""] = await to(readJson(filePath));

    const newContent = [
        {
            branchName,
            branchDesc,
            createTime: new Date().toLocaleString()
        },
        ...content
    ];
    const [err2] = await to(
        writeJson(fileName, newContent, {
            spaces: 4
        })
    );

    if (err2) {
        errorLog("信息记录失败");
        process.exit(1);
    }
    successLog(`信息记录成功: ${fileName}`);
}
