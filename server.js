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

const roleQuery =
  'SELECT * FROM roles; SELECT CONCAT (e.first_name," ",e.last_name) AS full_name FROM employee e';

const allStaff = `SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", r.title, d.name AS "Department", IFNULL(r.salary, 'No Data') AS "Salary", CONCAT(m.first_name," ",m.last_name) AS "Manager"
FROM employee e
LEFT JOIN roles r 
ON r.id = e.role_id 
LEFT JOIN department d 
ON d.did = r.department_id
LEFT JOIN employee m ON m.id = e.manager_id
ORDER BY e.id;`;

const managerQuery = `SELECT CONCAT (e.first_name," ",e.last_name) AS full_name,r.title, d.name FROM employee e INNER JOIN roles r ON r.id = e.role_id INNER JOIN department d ON d.did =r.department_id WHERE name = "Management";`

// INITIAL PROMPTS & SWITCH CASE
const badCompany = () => {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Add a department",
        "Add an employee",
        "Add a role",
        "View a department",
        "View employees",
        "View a role",
        "Update employee roles",
        "Update employee managers",
        "View employees by manager",
        "Delete department",
        "Delete role",
        "Delete employee",
        "View the total utilized budget of a department",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "Add a department":
          addDepartment();
          break;

        case "Add an employee":
          addEmployee();
          break;

        case "Add a role":
          addRole();
          break;

        case "View a department":
          viewDepartments();
          break;

        case "View employees":
          viewEmployees();
          break;

        case "View a role":
          viewRoles();
          break;

        // Bonus case
        case "View employees by manager":
          viewEmpByManager();
          break;

        case "Update employee roles":
          updateEmpRole();
          break;

        // Bonus case
        case "Update employee managers":
          updateEmpManagers();
          break;

        //  Bonus delete function
        case "Delete department":
          deleteDepartment();
          break;

        case "Delete role":
          deleteRole();
          break;

        case "Delete employee":
          deleteEmployee();
          break;

        // Bonus
        case "View the total utilized budget of a department":
          companyBudget();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};
