//importing and requiring packages
const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');

// defining varibles 
const PORT = process.env.port || 3002;
const app = express();

// adding middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connecting to sql/database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password_here', //had my password but took it out
    database: 'employee_db'
});

//ensuring db is connected 
db.connect(err => {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Connected to database");
    startETApp();
});

// starts emplyee tracker
function startETApp() {
    console.log("Welcome to the employee Tracker!")
    //prompts user what they want to oveiw/ahnge
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View All Employees',
            'Add Employee',
            'Update Employee Role',
            'View All Roles',
            'Add Role',
            'View All Departments',
            'Add Department',
        ]
    })
        .then(answer => {
            switch (answer.action) {
                case 'View All Employees':
                    viewEmployees();
                    break; 
                case 'Add Employee':
                    addEmployee();
                    break; 
                case 'Update Employee Role':
                    UpdateRole();
                    break; 
                case 'View All Roles':
                    viewRoles();
                    break; 
                case 'Add Role':
                    addRole();
                    break; 
                case 'View All Departments':
                    ViewDepartment();
                    break; 
                case 'Add Department':
                    addDepartment();
                    break; 
            }
        });
}

//veiws employee table from db
function viewEmployees() {
    db.query('SELECT * FROM employee', (err, rows) => {
        if (err) {
            console.error(err);
            return;
        }
        console.table(rows);
        startETApp();
    });
}

//views roles table from db
function viewRoles() {
    const query = `SELECT role.id AS role_id, role.title AS job_title, role.salary, department.department_name AS department FROM role INNER JOIN department ON role.department_id = department.id`;
    db.query(query, (err, rows) => {
        if (err) {
            console.error("Error retrieving roles:", err);
            return;
        }
        console.table(rows);
        startETApp(); 
    });
}

//views departments table from db
function ViewDepartment() {
    const query = `SELECT id AS department_id, department_name AS department FROM department`;
    db.query(query, (err, rows) => {
        if (err) {
            console.error("Error retrieving departments:", err);
            return;
        }
        console.table(rows);
        startETApp(); 
    });
}

// allows user to add an emplyee to db
function addEmployee() {
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: "Enter the employee's first name:"
        },
        {
            name: 'lastName',
            type: 'input',
            message: "Enter the employee's last name:"
        },
        {
            name: 'roleId',
            type: 'number',
            message: "Enter the employee's role ID:"
        },
        {
            name: 'managerId',
            type: 'number',
            message: "Enter the employee's manager ID (optional):"
        }
    ]).then(answers => {
        const { firstName, lastName, roleId, managerId } = answers;
        const query = `
            INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES ('${firstName}', '${lastName}', ${roleId}, ${managerId || null})
        `;
        db.query(query, (err, result) => {
            if (err) {
                console.error("Error adding employee:", err);
                return;
            }
            console.log(`Employee '${firstName} ${lastName}' added successfully!`);
            startETApp();
        });
    });
}

// allows user to add role to db 
function addRole() {
    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'Enter the title of the new role:'
        },
        {
            name: 'salary',
            type: 'number',
            message: 'Enter the salary for the new role:'
        },
        {
            name: 'departmentId',
            type: 'number',
            message: 'Enter the department ID for the new role:'
        }
    ]).then(answers => {
        const { title, salary, departmentId } = answers;
        const query = `
            INSERT INTO role (title, salary, department_id)
            VALUES ('${title}', ${salary}, ${departmentId})
        `;
        db.query(query, (err, result) => {
            if (err) {
                console.error("Error adding role:", err);
                return;
            }
            console.log(`Role '${title}' added successfully!`);
            startETApp(); 
        });
    });
}

// allows user to add department to db
function addDepartment() {
    inquirer.prompt({
        name: 'departmentName',
        type: 'input',
        message: 'Enter the name of the new department:'
    }).then(answer => {
        const departmentName = answer.departmentName;
        const query = `
            INSERT INTO department (department_name)
            VALUES ('${departmentName}')
        `;
        db.query(query, (err, result) => {
            if (err) {
                console.error("Error adding department:", err);
                return;
            }
            console.log(`Department '${departmentName}' added successfully!`);
            startETApp();
        });
    });
}

//allows user to update employee role in db 
function UpdateRole() {
    db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', (err, employees) => {
        if (err) {
            console.error("Error retrieving employees:", err);
            return;
        }

        db.query('SELECT id, title FROM role', (err, roles) => {
            if (err) {
                console.error("Error retrieving roles:", err);
                return;
            }

            inquirer.prompt([
                {
                    name: 'employeeId',
                    type: 'list',
                    message: 'Select the employee to update:',
                    choices: employees.map(employee => ({
                        name: employee.name,
                        value: employee.id
                    }))
                },
                {
                    name: 'roleId',
                    type: 'list',
                    message: 'Select the new role:',
                    choices: roles.map(role => ({
                        name: role.title,
                        value: role.id
                    }))
                }
            ]).then(answers => {
                const { employeeId, roleId } = answers;
                
                db.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId], (err, result) => {
                    if (err) {
                        console.error("Error updating employee role:", err);
                        return;
                    }
                    console.log("Employee role updated successfully!");
                    startETApp();
                });
            });
        });
    });
}

//starts server and listens to port
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
