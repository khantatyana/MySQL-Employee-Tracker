const inquirer = require("inquirer");
// const connection = require("./database/connect")
const db = require("./database");
const disp = require("asciiart-logo");
require("console.table");

start();
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
            "View all Departments",
            "View all Roles",
            "Update Employee Role",
            "Update Employee Manager",
            "Add a Department",
            "Add an Employee",
            "Add a Role",
            "Delete Department",
            "Delete Role. WARNING: this operation is going to delete all employees with this role!",
            "Delete Employee",
            "Exit"
        ]
    }).then(function(answers) {
        if (answers.employee_tracker === "View all Employees") {
            viewAllEmployeesFunc();
        } else if (answers.employee_tracker === "View all Departments") {
            viewAllDptsFunc();
        } else if (answers.employee_tracker === "View all Roles") {
            viewAllRolesFunc();
        } else if (answers.employee_tracker === "Update Employee Role") {
            updateEmplRoleFunc();
        } else if (answers.employee_tracker === "Update Employee Manager") {
            updateEmplManagerFunc();
        } else if (answers.employee_tracker === "Add a Department") {
            addDptFunc();
        } else if (answers.employee_tracker === "Add an Employee") {
            addEmployeeFunc();
        } else if (answers.employee_tracker === "Add a Role") {
            addRoleFunc();
        } else if (answers.employee_tracker === "Delete Department") {
            deleteDptFunc();
        } else if (answers.employee_tracker === "Delete Role. WARNING: this operation is going to delete all employees with this role!") {
            deleteRoleFunc();
        } else if (answers.employee_tracker === "Delete Employee") {
            deleteEmployeeFunc();
        } else if (answers.employee_tracker === "Exit") {
            endFunc();
        } else {
            connection.end();
        }
    })
}
async function viewAllEmployeesFunc() {
    const res = await db.allEmplFunc();
    console.log("\n");
    console.table(res);
    allPrompts();
}
async function viewAllDptsFunc() {
    const res = await db.allDptFunc();
    console.log("\n");
    console.table(res);
    allPrompts();
}
async function viewAllRolesFunc() {
    const res = await db.allRolesFunc();
    console.log("\n");
    console.table(res);
    allPrompts();
}
async function addDptFunc(){
    const dpt = await inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Please enter name of the new Department."
        }
    ]);
    await db.newDptFunc(dpt);
    const dpts = await db.allDptFunc();
    if (dpts.includes(dpt.name)) {
        console.log(`${dpt.name} is already existing. Try again.`)
        addDptFunc();
    }
    console.log(`${dpt.name} was added to the database.`)
    allPrompts();
}
async function addEmployeeFunc(){
    const roles = await db.allRolesFunc();
    const rolechoices = []; 
    function defineAllRoles() {
        for (var i = 0; i < roles.length; i ++) {
            rolechoices.push(roles[i].Role_title)
        }
        return rolechoices;
    };
    defineAllRoles();

    const managers = await db.allEmplFunc();
    const managerchoices = [];
    function defineAllManagers() {
        for (var i = 0; i < managers.length; i ++) {
            let firstName = managers[i].First_Name;
            let lastName = managers[i].Last_Name;
            managerchoices.push(`${firstName} ${lastName}`);
        }
        return managerchoices;
    };
    defineAllManagers();
    console.log(managers);
    console.log(managerchoices);
    const employee = await inquirer.prompt([
        {
            name: "first_name",
            message: "Please enter employee's first name."
        },
        {
            name: "last_name",
            message: "Please enter employee's last name."
        },
        {
            name: "role_id",
            type: "list",
            message: "Please enter employee's role.",
            choices: rolechoices
        },
        {
            name: "manager_id",
            type: "list",
            message: "Please enter employee's manager",
            choices: managerchoices
        }
    ]);
    await db.newEmployee(employee);
    console.log(`${employee.first_name} ${employee.last_name} was added.`);
    allPrompts();
}


// function updateEmplRoleFunc() {

//     inquirer.prompt([
//         {
//             name: "managers",
//             type: "list",
//             message: "Choose manager?",
//             choices: managers
//         }
//     ]).then(
//        function(answers) {
//            connection.query("INSERT INTO auctions SET ?", {
//                item: answers.item,
//                category: answers.category,
//                starting_price: answers.starting_price,
//                high_price: answers.starting_price,
//                quantity: answers.quantity

//            }, function(err){
//                if (err) {
//                    throw err;
//                }
//                console.log("created successfully!");
//                start();
//            })
//        } 
//     )
// }

function endFunc() {
    console.log("Good-bye!");
    process.exit();
}