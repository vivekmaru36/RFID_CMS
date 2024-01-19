## INSTALL THE DEPENDENCIES
```
npm install or npm install react
```

## START THE FRONTEND
```
npm start
```


## START THE SERVER
```
node server
```
# changes for node :

1) added functionality for rfid to be unique for both the db note : student--> numercirfid and teacher --> rfidno 
2) Logout Done by deleting the cookie in dashboard.js/handleItemClick and server.js/logout
3) Login done with logout deleting the token from cookies
4) fetch done but still displays only based on token from cookie fname

# changes :

1) did changes in login.js and regstration.js so they don't route to dashboard even if login or registeration is failed
2) made backend only accept unique numeric rfids
3) created logic for password checking in login here : https://github.com/vivekmaru36/Crud_operations_with_web_api/blob/master/Crud_app_with_mongo/Data_access_layer/CrudOperationsDL.cs
4) added suraj's dashboard's menu bar and no css was changed done it using 'Switch' inside app.js where navbar only displays on other pages except on dashboard
5) The login is now handled just based on an rfid for fetching :
       https://github.com/vivekmaru36/Crud_operations_with_web_api/blob/e772b084692818f71bd2635d9f6ab2c0fd42c83d/Crud_app_with_mongo/Data_access_layer/CrudOperationsDL.cs
6) added logout functionality : https://github.com/vivekmaru36/Login_with_fetch_done/blob/main/src/Dashboard/Dashboard.js

7) added basic frontend for handling teacher scenarios for register
   coded the backend api for teacher login and now it redirects to login rather than dashboard

8) Logincheck api and GetRecord by api work for both students and teacher before only used to work for one entity : CrudOperationsDL.cs

9) role variable changes if user is student or teahcer based on that 

10) added live changes on the dashboard for only teacher for now update the issues tab 

# Instructions : 

1) npm install
2) npm install --save-dev @babel/plugin-proposal-private-property-in-object
3) npm install axios
4) npm start 

to go to dashboard just use http://localhost:3000/dashboard

if you want to go there using backend use this on your pc and run it simulatenously 

--> https://github.com/vivekmaru36/Crud_operations_with_web_api
--> https://www.youtube.com/playlist?list=PLwxiRZdZ4bZkldxU51cwo5B1xuN9hxvCM


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
