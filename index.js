const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: 'localhost',
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: 'root',
  
    // Your password
    password: '00000000',
    database: 'employee_DB',
  });

// function which prompts the user for what action they should take
const start = () => {
    inquirer
      .prompt({
        name: 'checkOrAdd',
        type: 'list',
        message: 'Would you like to CHECK the employee list or ADD data on the list?',
        choices: ['CHECK', 'ADD'],
      })
      .then((answer) => {
        // based on their answer, either call the bid or the post functions
        if (answer.checkOrAdd === 'CHECK') {
          checkList();
        } else if (answer.checkOrAdd === 'ADD') {
          addToList();
        } else {
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
          name: 'department',
          type: 'list',
          message: 'What is your department?',
          choices: ['Production', 'Accountant and Finance', 'Software Development', 'Purchasing', 'Human Resource Management', 'Marketing',],
        },
        {
          name: 'title',
          type: 'input',
          message: 'What is your title?',
        },
        {
            name: 'departmentId',
            type: 'input',
            message: 'What is your department id?',
          },
        {
            name: 'firstName',
            type: 'input',
            message: 'What is your first name?',
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'What is your last name?',
        },
        {
            name: 'roleId',
            type: 'input',
            message: 'What is your role id?',
        },
        {
            name: 'managerId',
            type: 'input',
            message: 'What is your manager id?',
            default: "0000",
        },
        {
          name: 'salary',
          type: 'input',
          message: 'What is your salary?',
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
          'INSERT INTO department SET ?',
          // QUESTION: What does the || 0 do?
          {
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
          'INSERT INTO role SET ?',
          {
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
        )
        connection.query(
          'INSERT INTO employee SET ?',
          {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: answer.roleId,
            manager_id: answer.managerId,
          },
          (err) => {
            if (err) throw err;
            console.log('Your data was created successfully!');
            // re-prompt the user for if they want to bid or post
            start();
          }
        )
      });
  };
  









  const checkList = () => {
    // query the database for all items being auctioned
    connection.query('SELECT * FROM auctions', (err, results) => {
      if (err) throw err;
      // once you have the items, prompt the user for which they'd like to bid on
      inquirer
        .prompt([
          {
            name: 'choice',
            type: 'rawlist',
            choices() {
              const choiceArray = [];
              results.forEach(({ item_name }) => {
                choiceArray.push(item_name);
              });
              return choiceArray;
            },
            message: 'What auction would you like to place a bid in?',
          },
          {
            name: 'bid',
            type: 'input',
            message: 'How much would you like to bid?',
          },
        ])
        .then((answer) => {
          // get the information of the chosen item
          let chosenItem;
          results.forEach((item) => {
            if (item.item_name === answer.choice) {
              chosenItem = item;
            }
          });
  
          // determine if bid was high enough
          if (chosenItem.highest_bid < parseInt(answer.bid)) {
            // bid was high enough, so update db, let the user know, and start over
            connection.query(
              'UPDATE auctions SET ? WHERE ?',
              [
                {
                  highest_bid: answer.bid,
                },
                {
                  id: chosenItem.id,
                },
              ],
              (error) => {
                if (error) throw err;
                console.log('Bid placed successfully!');
                start();
              }
            );
          } else {
            // bid wasn't high enough, so apologize and start over
            console.log('Your bid was too low. Try again...');
            start();
          }
        });
    });
  };


// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });
  