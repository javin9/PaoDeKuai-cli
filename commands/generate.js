const inquirer = require("inquirer");
const program = require("commander");
const chalk = require("chalk");
const download = require("download-git-repo");
const ora = require("ora");
const fs = require("fs");
//获取用户参数
const option = program.parse(process.argv).args[0];
const defaultName = typeof option === "string" ? option : "paodekuai-project";
//tpl模板
const tplList = require(`${__dirname}/../templates`);
const tplChoices = Object.keys(tplList) || [];
//question
const question = [
  {
    type: "input",
    name: "name",
    message: "Project name",
    default: defaultName,
    filter(val) {
      return val.trim();
    },
    validate(val) {
      const isValid = val.split(" ").length === 1;
      return isValid || "Project name is not allowed to has spaces";
    },
    transformer(val) {
      return val;
    }
  },
  {
    type: "list",
    name: "template",
    message: "Project template",
    choices: tplChoices,
    default: tplChoices[0],
    validate(val) {
      return true;
    },
    transformer(val) {
      return val;
    }
  },
  {
    type: "input",
    name: "description",
    message: "Project description!",
    default: "vue-based project",
    validate(val) {
      return true;
    },
    transformer(val) {
      return val;
    }
  },
  {
    type: "input",
    name: "author",
    message: "Author",
    default: "Cupid",
    validate(val) {
      return true;
    },
    transformer(val) {
      return val;
    }
  }
];

module.exports = inquirer.prompt(question).then(({ name, template, description, author }) => {
  const gitOptions = tplList[template];
  const gitAdress = `${gitOptions.place}${gitOptions.branch}`;
  const spinner = ora(`creating ${name}`).start();
  console.log(gitAdress);

  download(gitAdress, `./${name}`, err => {
    if (err) {
      console.log(chalk.red(err));
      spinner.stop();
      process.exit();
      return;
    }

    fs.readFile(`./${name}/package.json`, "utf8", (err, data) => {
      if (err) {
        console.log(chalk.red(err));
        spinner.stop();
        process.exit();
        return;
      }

      const packageJson = JSON.parse(data);
      packageJson.name = name;
      packageJson.description = description;
      packageJson.author = author;

      const packageJsonString = JSON.stringify(packageJson);
      fs.writeFile(`./${name}/package.json`, packageJsonString, err => {
        if (err) {
          console.log(chalk.red(err));
          spinner.stop();
          process.exit();
          return;
        }

        spinner.stop();
        console.log(chalk.yellow("Successfully created project vue3-project."));
        console.log(chalk.yellow("Get started with the following commands:"));
        console.log(chalk.yellow(`cd ${name}`));
        console.log(chalk.yellow("npm install"));
        console.log(chalk.yellow("npm start"));
      });
    });
  });
});
