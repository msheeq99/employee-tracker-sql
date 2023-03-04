INSERT INTO department (department_name)
VALUES ("Sales"),
       ("Customer Service"),
       ("IT"),
       ("Finance");

INSERT INTO job_role (title, salary, department_id)
VALUES ("Sales Manager", 50000.00, 1),
       ("Sales Agent", 25000.00, 1),
       ("Customer Service Manager", 50000.00, 2),
       ("Customer Service Agent", 25000.00, 2),
       ("IT Manager", 55000.00, 3),
       ("Technician", 30000.00, 3),
       ("Developer", 30000.00, 3),
       ("Finance Manager", 55000.00, 4),
       ("Accountant", 35000.00, 4),
       ("Finance Analyst", 40000.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Barry", "White", 1, null),
       ("Sally", "Simpleton", 2, 1),
       ("Bruce", "Wayne", 2, 1),
       ("Sean", "Bean", 3, null),
       ("Penelope", "Pillstaker", 4, 4),
       ("Laura", "Lickboot", 4, 4),
       ("Jichao", "Bai", 5, null),
       ("King", "Kong", 6, 7),
       ("Vlad", "Dracula", 7, 7),
       ("John", "Goti", 8, null),
       ("Beyonce", "Knowles", 9, 10),
       ("Crocodile", "Bill", 10, 10);