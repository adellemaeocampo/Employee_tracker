INSERT INTO department (department_name) VALUES 
        ("Marketing"),
        ("Finance"),
        ("Engineering"),
        ("Legal"),
        ("Research");   

INSERT INTO role (title, salary, department_id) VALUES 
        ("Marketing Manager", 80000, 1),
        ("Marketing Representative", 65000, 1),
        ("Financial Advisor", 70000, 2),
        ("Accountant", 60000, 2),
        ("Financial Analyst", 85000, 2),
        ("Head Engineer", 90000, 3),
        ("Software Engineer", 75000, 3),
        ("Lawyer", 80000, 4),
        ("Legal Secretary", 50000, 4),
        ("Head of Research", 65000, 5),
        ("Researcher", 55000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
        ("Josie", "Spring", 1, NULL),
        ("Sam", "Nash", 1, 1),
        ("Bob", "Berg", 3, NULL),
        ("Fletcher", "Hose", 4, 3),
        ("Kanna", "Smith", 5, 3),
        ("Christine", "Jones", 6, NULL),
        ("Vlad", "Sowyer", 7, 6),
        ("Porter", "Hosten", 8, NULL),
        ("George", "Johnson", 9, 8),
        ("Isabelle", "Isles", 10, NULL),
        ("Macri", "Persef", 11, 10);
