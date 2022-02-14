# Northcoders News API

Summary of Project:

This project is bringing together everything I have learned over the past 2 weeks of Back-End to create a project similar in style to Reddit. It will take in various end-points including articles, comments, topics and users.




Instructions for running this file:

Two important files to create first are:
    .env.test
    .env.development
        You can do this by adding these file names to the top level, alongside the JSON files.
        Once inside, add PGDATABASE=nc_news to the .env.development file and PGDATABASE=nc_news_test to the .env.test file (No semi-colon at the end!).
        You can find the database names in the 'setup.sql' file inside the 'db' folder if you would like to double check.
        To ensure these files are hidden, check inside the .gitignore file to see if .env.* is in there. The '*' acts as a wildcard, meaning it looks for any files that start with '.env.' and then has any form of variation behind it. A longer way of doing this is to write out each file name in this folder.