# **Northcoders News API**

### **Summary of Project:**

This project is bringing together everything I have learned over the past 2 weeks of Back-End to create a project similar in style to Reddit.

It is a RESTful API that has been built with various end-points, including articles, comments, topics and users.

Hosted Version can be found [here](https://apimlott-nc-news.herokuapp.com/api)

---

### **Setup Instructions**

1. **Clone:**

On the [main page](https://github.com/Pimmy17/NC-Back-End-Project) of the repo, click on the **Green** button that says 'Code'. From the drop down menu, either click the overlapping squares button to the right of the HTTPS address (this automatically copies the .git address) or highlight the whole HTTPS address and right click and select copy.
Then head over to your terminal command line and enter in:

```
$ git clone <insert copied HTTPS address>
i.e $ git clone https://github.com/Pimmy17/NC-Back-End-Project.git
```

After running this it will ask you to enter your github username and password/access token.

Finally to access the file in VS Code:

```
Enter the Project file using:
$ cd NC-Back-End-Project
Then
$ code .
```

2. **Install Dependencies:**

After cloning, you will need to install the dependencies in your terminal to allow tests to be run by running.

```
- $ npm install
```

After installing the dependencies, head over to the **package.json** file to make sure **Script:** --> **test:** is set to "jest app".

3. **Seed Local Database:**

To seed the database run the below in your terminal:

```
$ npm run setup-dbs

$ npm run seed-dev (for development)
or
$ npm run seed-test (for testing)
```

N.B
If you have the following error message at any point 'Cannot connect to database/server'

Run the following command in your terminal

```
$ sudo service postgresql start
```

4. **Run Tests:**

To run tests enter the following in to your terminal

```
$ npm t
or
$ npm test
```

### **Instructions for running this file:**

Two **IMPORTANT** files to create first are:

- .env.test
- .env.development

  You can do this by adding these file names to the top level, alongside the JSON files.
  Once inside, add `PGDATABASE=nc_news` to the .env.development file and `PGDATABASE=nc_news_test` to the .env.test file (No semi-colon at the end!).
  You can find the database names in the 'setup.sql' file inside the 'db' folder if you would like to double check.
  To ensure these files are hidden, check inside the .gitignore file to see if .env.\* is in there. The '\_' acts as a wildcard, meaning it looks for any files that start with '.env.' and then has any form of variation behind it. A longer way of doing this is to write out each file name in this folder.

---

### **Minimum Version Requirements:**

```
Node.js: v17.3.0
Postgres: 12.9
```
