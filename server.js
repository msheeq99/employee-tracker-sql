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

// ALL FX PER SWITCH CASE
const addDepartment = () => {
  // show the current Departments in the database
  const query = "SELECT * FROM department";
  connection.query(query, (err, results) => {
    if (err) throw err;

    console.log(chalk.blue("List of current departments"));

    console.table(results);

    // ask what the name is for the new dept
    inquirer
      .prompt([
        {
          name: "newDept",
          type: "input",
          message: "What department would you like to add?",
        },
      ])
      .then((answer) => {
        connection.query(
          `INSERT INTO department(name) VALUES(?)`,
          [answer.newDept],
          (err, results) => {
            badCompany();
          }
        );
      });
  });
};

const addEmployee = () => {
  connection.query(roleQuery, (err, results) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "fName",
          type: "input",
          message: askNewEmployee[0],
        },

        {
          name: "lName",
          type: "input",
          message: askNewEmployee[1],
        },

        {
          name: "role",
          type: "list",
          // A FX in the choices creates a new array from results (all from roles table) loops and returns
          // the array of titles
          choices: function () {
            let choiceArr = results[0].map((choice) => choice.title);
            return choiceArr;
          },
          //   asking what the role is?
          message: askNewEmployee[2],
        },
        {
          name: "manager",
          type: "list",
          // A FX that creates a new array from employee table, the concatenated first and last name
          // and returns an array of the full name
          choices: function () {
            let choiceArr = results[1].map((choice) => choice.full_name);
            return choiceArr;
          },
          // asking who is their manager
          message: askNewEmployee[3],
        },
      ])
      .then((answer) => {
        connection.query(
          `INSERT INTO employee(first_name,last_name, role_id, manager_id) 
          VALUES (?,?, 
            (SELECT id FROM roles WHERE title = ?), 
            (SELECT id FROM (SELECT id FROM employee WHERE CONCAT(first_name,'',last_name) = ?)
            AS tmptable))`,
          [answer.fName, answer.lName, answer.role, answer.manager]
        );
        badCompany();
      });
  });
};

//CK
const addRole = () => {
  const addRoleQuery = `SELECT * FROM roles; SELECT * FROM department;`;
  connection.query(addRoleQuery, (err, results) => {
    if (err) throw err;

    console.log(chalk.blue("List of current roles"));
    console.table(results[0]);

    inquirer
      .prompt([
        {
          name: "newTitle",
          type: "input",
          message: "What is the new title?",
        },
        {
          name: "newSalary",
          type: "input",
          message: "What is the salary amount for the new title:",
        },
        {
          name: "dept",
          type: "list",
          // A FX that creates a new array from the department table
          //and loops through the name column and returns the new array
          choice: function () {
            let choiceArr = results[1].map((choice) => choice.name);
            return choiceArr;
          },
          message: "Choose the department for the new title?",
        },
      ])
      .then((answer) => {
        connection.query(`INSERT INTO roles(title, salary, department_id) 
                VALUES("${answer.newTitle}","${answer.newSalary}", 
                (SELECT did FROM department WHERE name = "${answer.dept}"));`);
        badCompany();
      });
  });
};

const viewDepartments = () => {
  const query = "SELECT * FROM department";
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.table(results);
    badCompany();
  });
};


const viewEmployees = () => {
  const query = "SELECT * FROM employee";
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.table(results);
    badCompany();
  });
};


const viewRoles = () => {
  const query = "SELECT * FROM roles";
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.table(results);
    badCompany();
  });
};

// CK
const viewEmpByManager = () => {
  connection.query(managerQuery, (err, results) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "m_choice",
          type: "list",
          choices: function () {
            let choiceArr = results.map((choice) => choice.full_name);
            return choiceArr;
          },
          message: "Select a Manager:",
        },
      ])
      .then((answer) => {
        const managerQuery2 = `SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", IFNULL(r.title, "No Data") AS "Title", IFNULL(d.name, "No Data") AS "Department", IFNULL(r.salary, 'No Data') AS "Salary", CONCAT(m.first_name," ",m.last_name) AS "Manager"
                              FROM employee e
                              LEFT JOIN roles r 
                              ON r.id = e.role_id 
                              LEFT JOIN department d 
                              ON d.did = r.department_id
                              LEFT JOIN employee m ON m.id = e.manager_id
                              WHERE CONCAT(m.first_name," ",m.last_name) = ?
                              ORDER BY e.id;`;
        connection.query(managerQuery2, [answer.m_choice], (err, results) => {
          if (err) throw err;

          console.log(" ");
          console.table(chalk.blue("Employee by Manager"), results);

          badCompany();
        });
      });
  });
};
// CK
const updateEmpRole = () => {
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "What is your employee ID?",
      },
      {
        name: "role",
        type: "input",
        message: "What is your role ID?",
      },
    ])
    .then((answers) => {
      const query = `UPDATE employee SET role_id = ? WHERE id = ?`;
      connection.query(query, [answers.id, answers.role], (err, results) => {
        if (err) throw err;
        console.log(results);
        badCompany();
      });
    })
    .catch((err) => {
      throw err;
    });
};