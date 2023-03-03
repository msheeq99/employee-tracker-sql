use employees_db;

INSERT INTO department (department_name)
VALUES ("Legal"),
       ("HR"),
       ("Engineering"),
       ("Sales"),
       ("Accounting");

INSERT INTO job_role (title, salary, department_id)
VALUES ("Sales person", 50000, 4),
       ("Sales manger", 60000, 4),
       ("Engineer", 440000, 3),
       ("HR REP", 320000, 2),
       ("Accountant", 50000, 5),
       ("Company Attorney", 70000, 1),
       ("Engineering Manager", 70000, 3);
       

 INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mark", "Allen", 2, NULL),
       ("John", "Smith", 1, 1),
       ("Adam", "Peters", 7, NULL),
       ("Sam", "Hill", 3, 3),
       ("Will", "Atkins", 4, 1),
       ("Jack", "Good", 5, 1),
       ("Lisa", "Holt", 6, 1);