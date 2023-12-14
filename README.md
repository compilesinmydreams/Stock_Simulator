# Stock_Simulator
 A human computer interaction project for stock simulator app which lets you practise trading with fake virtual money. 


* Before:
  * ensure node is installed (may need lated version) 
* To set up node modules:
  * navigate to root directory
  * run command: npm install
* To run:
  * ensure in root directory
  * run command: node app.js
* Login with an existing user, or create a user by clicking register
  * login information (user, password)
    *  bobby, 12345
    *  maddy, 12345
    *  stock_master, 12345
    *  uncle_sam, 12345
    *  aunt_debby, 12345
* Note: testing was performed using chrome and edge 

### Directory

    .
    ├── db                      # databse
      ├── stock-simulator.db
      └── stock-simulator.sql
    ├── js                      # client-side js
      ├── login.js
      ├── market.js
      ├── register.js
      ├── stock.js
      └── user.js
    ├── routes                  # express routes (GET, POST)
      ├── market.js
      ├── register.js
      ├── search.js
      ├── stock.js
      └── user.js
    ├── views                   # pug templates for rendering
      ├── includes            
        ├── login.pug
      ├── construction.pug
      ├── index.pug
      ├── market.pug
      ├── register.pug
      ├── search.pug
      ├── stock.pug
      └── user.pug
    ├── app.js                 # node entry point
    ├── package-lock.json      
    └── package.json           
