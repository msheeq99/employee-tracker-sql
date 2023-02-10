// INSTALL DEPENDENCIES
const inquirer = require("inquirer");
const fs = require("fs");
const mysql = require("mysql2");
const consoleTable = require("console.table");
const { resolve } = require("path");

// CREATING CONNECTION TO SERVER
const connection = mysql.createConnection({
    host: "localhost",
  
    // My Port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // MySQL password
    password: "password",
    database: "employeeDB",
    multipleStatements: true,
  });
  
  const employeeTrackerQuestions = {
    type: "list",
    name: "employeeTracker",
    message: "What would you like to do?",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee role",
    ],
  };

  function addDepartment() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "addDepartment",
          message: "Enter new department name:",
        },
      ])
      .then(updateDepartmentTable);
  }
  