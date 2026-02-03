# Friendfy

### Download file from [GitHub](https://github.com/Bnmpp/Project-WebDev/tree/main)
1. Download `ZIP` file
2. Extract the `ZIP` file

### User Account and the Database `friendfy` Preparation in MySQL Server
1. Open MySQL Workbench and connect to your local instance
2. Run the given SQL script to create a database, `friendfy`
3. Create a User Account in MySQL Server to be the account to your web server with the following details:
      * Set username: `adminFriendfy` and password `Friendfy`
   	* Set Schema privileges to access the `friendfy` database
   	* Set the "access right" to the `friendfy` database including `SELECT`, `INSERT`, `UPDATE`, and `DELETE`
4. Test the `friendfy` database using any SQL command.<br>
   For example: `SELECT * FROM Admin_login;` should return 10 rows.

### Preparation of Express
1. Check that the Node.js is installed using the command `node --version` in the terminal.<br>
   If a version number appears (e.g., v22.14.0), Node.js is installed correctly. If not, please download and install the latest version of Node.js.
2. Open Visual Studio Code and "Open Folder", select the folder `672-projectphase2-sec1_group10`.<br>
   Your directory should have the following structure:
   
   	   672-projectphase2-sec1_group10
         |_ README.md
         |_ expected_output/
         |_ backend/
         |_ frontend/
         |_ sec1_gr10_database.sql
         |_ sec1_gr10_report.pdf
         

4. Open `Terminal` in Visual Studio Code to initialize and set up the project
	* Change the directory to the correct path using command `cd frontend`
 	* Install the following modules using command `npm install express nodemon dotenv mysql2 cors multer node-fetch cookie-parser`
  	* Exit the previous path using command `cd ..`
  	* Change the directory to the second path using command `cd backend`
 	* Install the following modules using command `npm install express nodemon dotenv mysql2 cors multer node-fetch cookie-parser`<br>

After this step, your directory should have the following structure:
   
	   
	   Project-WebDev
         |_ README.md
	     |_ expected_output/
         |_ frontend/
	 	|_node_modules/
         |_ backend/
	 	|_node_modules/
         |_ sec1_gr10_database.sql
         |_ sec1_gr10_report.pdf	

**Comeplete the preparation before exploring the web application.**

## Directions
**Create a web server with Express Framework using Node.js and it must connect to the database in the MySQL Server** 
The server should be configured and work as follows:  

* All the environment variables including `PORT`, `MYSQL_DATABASE`, `MYSQL_HOST`, `MYSQL_USERNAME` etc. must be kept in the `.env` file.
* The server is set to be run in the localhost with the `port=3000` and connected to the `friendfy` database since start.
  The user account and the privilege must be set up before this step (referred to [User acccount](#user-account-and-the-database-friendfy-preparation-in-mysql-server))
([**Expected Output 1**](#expected-output-1))
* The server must have the route at root that has a response with an HTML page `homepage.html`. <br>
  Request: `GET	http://localhost:3000/homepage` ([**Expected Output 2**](#expected-output-2))<br>
  Request: `GET	http://localhost:3000/event` ([**Expected Output 3**](#expected-output-3))
  

## Expected Output

### Expected Output 1

[back to top](#direction)

When the server starts to run with the command `npm start` in the terminal of both `server.js` and `webservice.js`, the output must show the text log as follows.<br>

**server.js**

```
> npm start

front-end@1.0.0 start
nodemon server.js

[nodemon] 3.1.10
[nodemon] to restart at any time, enter rs
[nodemon] watching path(s): .
[nodemon] to restart at any time, enter rs
[nodemon] watching path(s): .
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting node server.js
Server is up at port 3000
```

**webservice.js**

```
> npm start

friendfy@1.0.0 start
nodemon webservice.js

[nodemon] 3.1.10
[nodemon] to restart at any time, enter rs
[nodemon] watching path(s): .
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting node webservice.js
Server listening on port: 3030
Connected DB: friendfy
```

<hr>

### Expected Output 2

[back to top](#direction)

When a user opens their browser and goes to `localhost:3000/homepage`, they are sending a **request** to the `/homepage` route on the server. However, in order to access the homepage of this web application, the user must be signed in first.
If the user is not signed in, they will be automatically redirected to the **route** `/login` page.

![login](/expected_output/login.png)

**and** the terminal log should show in the path requested.

```
Request at /login
```

<hr>

### Expected Output 3

[back to top](#direction)

When a user browses to `localhost:3000/event` after **logging in**, it means they are sending a **request** to the given **route** `/event`

![event](/expected_output/event.png)

**Example 1**: A user wants to search by event's name, and the event's name is Volleyball.
![searchName](/expected_output/searchName.png)

**Example 2**: A user wants to join the event by clicking on See Details, then Join Event.
![eventDetails](/expected_output/eventDetails.png)

<hr>
