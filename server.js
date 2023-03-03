// INSTALL DEPENDENCIES
const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
const consoleTable = require("console.table");
const { resolve } = require("path");
const Department = require("./lib/department");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "employees_db",
});


// // ESTABLISHED CONNECTION TO SERVER MAIN DISPLAY ON TERMINAL
connection.connect((err) => {
  if (err) throw err;

  console.table(chalk.yellow("\n WELCOME TO EMPLOYEE TRACKER \n"));

  console.table(
    chalk.yellow.bold(
      `====================================================================================`
    )
  );
  console.log(``);
  console.table(chalk.greenBright.bold(figlet.textSync("Employee Tracker")));
  console.log(``);
  console.log(``);
  console.table(
    chalk.yellow.bold(
      `====================================================================================`
    )
  );
  
  //STARTS MAIN FUNCTION
  badCompany();
});

//VARIABLES
const askNewEmployee = [
  "What is the first name?",
  "What is the last name?",
  "What is their role?",
  "Who is their manager?",
];