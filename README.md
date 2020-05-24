## User Stories

Administrative database and server for teachers and students developed using NodeJS Express, MariaDB and Docker. Tests done using Jest and supertest.

### Functionalities

1. Register one or more student to a specified teacher.
2. Retrieve list of students common to a given list of teachers.
3. Suspend a specified student.
4. Retrieve list of students who can receive a given notification.

### Versioning

nodejs: 14.2.0  
express: 4.17.1  
mariadb: 2.3.1  
supertest: 4.0.2  
jest: 26.0.1  
docker: 19.03.8-ce, build afacb8b7f0  

### Installing & Deploying

Run following commands in CLI line by line

#### Getting docker ####

Refer to https://docs.docker.com/get-docker/

#### Set up Docker Image ####

docker container run -p 3306:3306 -d --name mariaDB -e MARIADB_ROOT_PASSWORD=toor mariadb/server  
docker container exec -it mariaDB bash  
mariadb  
create database demo;  
use demo;  
create table suspended (student varchar(100) not null primary key);  
create table registered (teacher VARCHAR(100), students varchar(100), primary key (teacher, students));

exit out of mariadb shell

npm i

##### To run Jest, enter "npm run test-dev" ##### 
(Jest testing is done according to requirements based on docx)
##### To run server, enter "npm start" ####



### Authors ####
* **Pow Jing Herng** - (https://github.com/jingherng).
