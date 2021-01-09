
USE employee_DB;

/* Insert 1 Rows into new table */
INSERT INTO department (name)
VALUES ("IT");

INSERT INTO role (title, salary, department_id)
VALUES ("Team lead", 100000, 2);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Jason", "Chang", 2);


