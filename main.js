const inquirer = require("inquirer");
var mysql = require("mysql");
// const db = require("./database");
const disp = require("asciiart-logo");
require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employees_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  start();
});

function start() {
    const display = disp({name: "Employee Tracker"}).render();
    console.log(display);
    allPrompts();
}
function allPrompts() {
    inquirer.prompt({
        name: "employee_tracker",
        type: "list",
        message: "Whay would you like to do?",
        choices: [
            "View all Employees",
            "View employees by manager",
            "View all Departments",
            "View all Roles",
            "Update employee role",
            "Update employee manager",
            "Add a department",
            "Add an employee",
            "Add a role",
            "Delete department",
            "Delete role. WARNING: this operation is going to delete all employees with this role!",
            "Delete employee",
            "Exit"
        ]
    }).then(function(answers) {
        if (answers.employee_tracker === "View all Employees") {
            viewAllEmployeesFunc();
        } else if (answers.employee_tracker === "View employees by manager") {
            viewEmplByManagerFunc();
        } else if (answers.employee_tracker === "View all Departments") {
            viewAllDptsFunc();
        } else if (answers.employee_tracker === "View all Roles") {
            viewAllRolesFunc();
        } else if (answers.employee_tracker === "Update employee role") {
            updateEmplRoleFunc();
        } else if (answers.employee_tracker === "Update employee manager") {
            updateEmplManagerFunc();
        } else if (answers.employee_tracker === "Add a department") {
            addDptFunc();
        } else if (answers.employee_tracker === "Add an employee") {
            addEmployeeFunc();
        } else if (answers.employee_tracker === "Add a role") {
            addRoleFunc();
        } else if (answers.employee_tracker === "Delete department") {
            deleteDptFunc();
        } else if (answers.employee_tracker === "Delete role. WARNING: this operation is going to delete all employees with this role!") {
            deleteRoleFunc();
        } else if (answers.employee_tracker === "Delete employee") {
            deleteEmployeeFunc();
        } else if (answers.employee_tracker === "Exit") {
            console.log("Good-bye!")
            connection.end();
        } else {
            connection.end();
        }
    })
}

function viewAllEmployeesFunc() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees_DB.employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", 
    function(err, res) {
        if(err) {
            throw err;
        }
        console.log("\n");
        console.table(res);
        allPrompts();
        
    });
}
function viewEmplByManagerFunc() {
    // connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees_DB.employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", 
    // function(err, res) {
    //     if(err) {
    //         throw err;
    //     }
    //     console.log("\n");
    //     console.table(res);
    //     allPrompts();
        
    // });
    inquirer.prompt([
        {
            name: "item",
            type: "input",
            message: "What is the item you would like to post?"
        },
        {
            name: "category",
            type: "input",
            message: "What is the category you would like to post?"
        },
        {
            name: "starting_price",
            type: "input",
            message: "What is the starting_price?"
        },
        {
            name: "quantity",
            type: "input",
            message: "What is the quantity?"
        }
    ]).then(
       function(answers) {
           connection.query("INSERT INTO auctions SET ?", {
               item: answers.item,
               category: answers.category,
               starting_price: answers.starting_price,
               high_price: answers.starting_price,
               quantity: answers.quantity

           }, function(err){
               if (err) {
                   throw err;
               }
               console.log("created successfully!");
               start();
           })
       } 
    )
}



