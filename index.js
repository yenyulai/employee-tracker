const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "00000000",
  database: "employee_DB",
});

// function which prompts the user for what action they should take
const start = () => {
  inquirer
    .prompt({
      name: "checkOrAdd",
      type: "list",
      message:
        "Would you like to CHECK the employee list or ADD data on the list?",
      choices: ["CHECK", "ADD", "UPDATE DATA", "EXIT"],
    })
    .then((answer) => {
      // based on their answer, either call the bid or the post functions
      if (answer.checkOrAdd === "CHECK") {
        checkList();
      } else if (answer.checkOrAdd === "ADD") {
        addToList();
      } else if (answer.checkOrAdd === "UPDATE DATA") {
        updateEmployee();
      }else if (answer.checkOrAdd === "EXIT"){
        connection.end();
      } 
      else {
        connection.end();
      }
    });
};

// function to handle adding new employee to the data
const addToList = () => {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "department",
        type: "list",
        message: "What is your department?",
        choices: [
          "Production",
          "Accounting and Finance",
          "IT",
          "Purchasing",
          "Human Resource Management",
          "Marketing",
        ],
      },
      {
        name: "title",
        type: "input",
        message: "What is your title?",
      },
      {
        name: "departmentId",
        type: "input",
        message: "What is your department id?",
      },
      {
        name: "firstName",
        type: "input",
        message: "What is your first name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is your last name?",
      },
      {
        name: "employeeId",
        type: "input",
        message: "What is your emplyee id?",
      },
      {
        name: "roleId",
        type: "input",
        message: "What is your role id?",
      },
      {
        name: "managerId",
        type: "input",
        message: "What is your manager id?",
        default: "0000",
      },
      {
        name: "salary",
        type: "input",
        message: "What is your salary?",
        validate(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
      },
    ])
    .then((answer) => {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO department SET ?",
        // QUESTION: What does the || 0 do?
        {
          id: answer.departmentId,
          name: answer.department,
        },
        (err) => {
          if (err) throw err;
          // console.log('Your auction was created successfully!');
          // re-prompt the user for if they want to bid or post
          // start();
        }
      );
      connection.query(
        "INSERT INTO role SET ?",
        {
          id: answer.roleId,
          title: answer.title,
          salary: answer.salary,
          department_id: answer.departmentId,
        },
        (err) => {
          if (err) throw err;
          // console.log('Your auction was created successfully!');
          // re-prompt the user for if they want to bid or post
          // start();
        }
      );
      connection.query(
        "INSERT INTO employee SET ?",
        {
          id: answer.employeeId,
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: answer.roleId,
          manager_id: answer.managerId,
        },
        (err) => {
          if (err) throw err;
          console.log("Your data was created successfully!");
          // re-prompt the user for if they want to bid or post
          start();
        }
      );
    });
};

const updateDate = () => {
  inquirer
    .prompt({
      name: "updateOpt",
      type: "list",
      message:
        "Which part do you wish to update",
      choices: ["EMPLOYEE", "ROLE"],
    })
    .then((answer) => {
      // based on their answer, either call the bid or the post functions
      if (answer.updateOpt = "EMPLOYEE") {
        updateEmployee();
      } else {
        connection.end();
      }
    });

};

const updateEmployee = () => {
  //console.log('EMPLOYEE UPDATED');
  inquirer
  .prompt([
    {
      name: "employeeId",
      type: "input",
      message: "What is the employee id the person you wish to update",
    },
    {
      name: "newTittle",
      type: "input",
      message: "What is the updated title of the person?",
    },
    {
      name: "newSalary",
      type: "input",
      message: "What is the updated salary of the person?",
      validate(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      },
    }],
  )
  .then((answer) => {
    // based on their answer, either call the bid or the post functions
    if (answer.employeeId !== null) {
      connection.query(
        "UPDATE  role INNER JOIN  employee ON employee.role_id = role.id SET role.title = '"+ answer.newTittle +"', role.salary = " + answer.newSalary + " WHERE employee.id = '" + answer.employeeId + "';",
        function (error, results, fields) {
          if (error) throw error;
          console.table(results[0]);
          start();
        }
      );
    } 
    
    start();
  });
};


const checkList = () => {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, role.department_id, department.name FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id;",
    function (error, results, fields) {
      if (error) throw error;
      console.table(results);
      start();
    }
  );


};

// connect to the mysql server and sql database
connection.connect((err) => {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});
