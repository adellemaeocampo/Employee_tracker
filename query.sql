SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

SELECT id, name AS department_name FROM department;

SELECT r.id AS role_id, r.title, r.salary, d.name AS department_name
FROM role r
JOIN department d ON r.department_id = d.id;

SELECT 
    e.id AS employee_id, 
    e.first_name, 
    e.last_name, 
    r.title AS role, 
    d.name AS department, 
    r.salary, 
    CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM employee e
JOIN role r ON e.role_id = r.id
JOIN department d ON r.department_id = d.id
LEFT JOIN employee m ON e.manager_id = m.id;