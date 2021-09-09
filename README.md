# OAMK-Notes


This is the repository for OAMK Notes, a first year university project for the Oulu University of Applied Sciences' Web Programming Project University Module (ID00CS43), created by Tavis Sinclair, Aleksandar Raynov, Kai Oraviita and Bars Margetsch.

The `main` branch contains the actual webpage itself, hosted at [the repository's GitHub Page](https://xerren09.github.io/OAMK-Notes/), created by Tavis Sinclair, Aleksandar Raynov, Kai Oraviita.
The API's and it's up-to-date code is available [at the API deployment branch](https://github.com/Xerren09/OAMK-Notes/tree/BarsBranch-API) along with its documentation, which is directly deployed to the Microsoft Azure App Service ~~(available at [http://xerrendev01uni.azurewebsites.net/](http://xerrendev01uni.azurewebsites.net)~~ The API is not longer available, however it can be run locally, as long as the URLs in the main branch are updated), and written by Bars Margetsch.

The goal of this project was the create a service for OAMK students where they can create and store lecture notes, drafts and written assigments in a well organised and safe way. The students could register with their university email, create an account, and start using the service right away. Notes could be arranged by year and course, allowing them to be date-organised and easily available.

# Service front page:
![OAMK Notes front page.](https://raw.githubusercontent.com/Xerren09/OAMK-Notes/main/readme/02.gif)

# Main Notes page:
Most of the service is available from the notes page, including searching for notes, adding new subjects via the bottom-left side menu, and of course, creatig new notes in the currently selected course. The service also supports tracking assignments, which can be used on the Homework page.
![OAMK Notes "notes" page after logging in.](https://raw.githubusercontent.com/Xerren09/OAMK-Notes/main/readme/03.gif)

# SQL Database
Additionally the service used the following database structure for storing user accounts, notes and homeworks:
![OAMK Notes "notes" page after logging in.](https://raw.githubusercontent.com/Xerren09/OAMK-Notes/main/readme/Database_Layout.png)
