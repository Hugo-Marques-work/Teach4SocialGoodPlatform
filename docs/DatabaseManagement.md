## How to manage the database
This document provides instructions for managing the MySQL database used by this project, through console commands. It includes steps for creating, backing up, loading, and deleting the database. **Please use these commands carefully as incorrect usage could result in data loss.**


The tutorials for backing up and loading the database are based on this [`tutorial`](https://www.digitalocean.com/community/tutorials/how-to-import-and-export-databases-in-mysql-or-mariadb).

### Requirements
MySQL must be installed and running on your system.

### Creating the database
1. Open your terminal and run the following command to access the MySQL shell:
    ```bash
    $ mysql -u root -p
    ```
    Enter the root user’s password when prompted.

2. Create a new database by running:
    ```sql
    CREATE DATABASE example_database_name;
    ```
    Replace `example_database_name` with your desired database name.

3. After successfully creating the database, type `exit;` to exit the MySQL shell.

### Backing up the database
1. Navigate to the `backups` folder in `/backend/backups`:
    ```bash
    $ cd /path/to/backend/backups
    ```
2. Run the following command to back up the database:
    ```bash
    $ mysqldump -u username -p database_name > example_dump.sql
    ```
    Replace `username` with your MySQL username, `database_name` with the name of your database, and `example_dump` with the desired filename for your backup.

 3. After entering the password, there will be no output confirmation. Verify the new file by running:
    ```bash
    $ head -n 5 example_dump.sql
    ```
    You should see output similar to:
    ```
    SQL dump fragment
    -- MySQL dump 10.13  Distrib 5.7.16, for Linux (x86_64)
    --
    -- Host: localhost    Database: database_name
    -- ------------------------------------------------------
    -- Server version       5.7.16-0ubuntu0.16.04.1
    ```
### Loading the database
**Warning:** This will overwrite the existing data in the database. Ensure you have a backup and that the database exists or is created as described below.
1. Verify that the database exists. If it does not, create it as described in the [Creating the Database](#creating-the-database) section.
2. Navigate to the directory containing your backup file.

3. Run the following command to load the database:
    ```bash
    $ mysql -u username -p database_name < example_dump.sql
    ```
    Replace `username` with your MySQL username, `database_name` with the name of your database, and `example_dump` with the backup filename.

### Deleting the database
**Warning:** This will permanently delete all data in the database. Ensure you have a backup before proceeding.

1. Access the MySQL shell:
    ```bash
    $ mysql -u root -p
    ```

2. Drop the database by running:
    ```sql
    DROP DATABASE database_name;
    ```
    Replace `database_name` with the name of your database.

3. If you only intended to clear the database contents, recreate the database with:
    ```sql
    CREATE DATABASE database_name;
    ```

4. Be sure to `exit;` the MySQL shell after you're finished.