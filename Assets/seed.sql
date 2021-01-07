/* Seeds for SQL table. We haven't discussed this type of file yet */
USE employee_DB;

/* Insert 3 Rows into your new table */
INSERT INTO department (name)
VALUES ("Software Development");

INSERT INTO role (title, salary, department_id)
VALUES ("Team lead", 100000, 2);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Jason", "Chang", 2);


