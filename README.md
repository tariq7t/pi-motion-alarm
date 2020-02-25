# pi-motion-alarm
This program is a burglar alarm system, which uses motion sensor and a camera to detect and alert when movement is detected. The program uses Raspberry pi camera module to detect movement. A PIN code is used to arm and disarm the alarm system. The program can be accessed through web browser, allowing it to be accessible on personal phone and tab as well.

The application is using Node.js and Express to run on the Raspberry Pi.

To quick start the application the express generator tool was used to create the application skeleton code.

It was run from the terminal like this:

npx express-generator --no-view pi-motion-alarm

The --no-view switch was specified so that no server side view code would be generated, since our app does not use server side views.

It created the following skeleton code file structure with boilerplate code:

pi-motion-alarm/ bin/ www public/ images/ javascripts/ stylesheets/ style.css index.html routes/ index.js users.js app.js package.json

This generated file structure was basically maintained but files were added, routes/users.js and images were deleted, and the contents of the files were modified to implement the pi-motion-alarm application. The resulting final file structure looks like this:

pi-motion-alarm/ api/ controllers/ alarm-controller.js routes/ alarm-routes.js index.js bin/ www lib/ model/ Constants.js motion-alarm.js public/ audio/ siren.mp3 javascripts/ alarm-manager.js jquery-3.4.1.min.js jquery-ui.min.js stylesheets/ style.css index.html .gitignore app.js package.json

You run pi-motion-alarm by cd-ing into the pi-motion-alarm folder and typing:

npm start

This runs: "node ./bin/www"

So bin/www is the starting entry point for the application.

Everything in the public folder is code that is run only in the browser. Everything else runs only on the server.



The following is a breakdown of the files in the app:

api/controllers/alarm-controller.js:  This is server side code which contains the express HTTP alarm-controller for the server side node app. It contains code that is executed in response to specific browser requests.

api/routes/alarm-routes.js:  This is server side code which contains the various HTTP AJAX routes for the server functionality. The browser makes requests to these routes which then are executed in alarm-controller.js.

api/routes/index.js:  This is server side code which contains the main Express route configuration.

bin/www:  This is server side code which contains the entry point of the Node application.

lib/model/Constants.js:  This is server side code which contains a class which holds application wide constants.

lib/motion-alarm.js:  This is server side code which contains the MotionAlarm class which contains the core logic for capturing/comparing and storing the images and the PIN data etc.

public/audio/siren.mp3:  This is the alarm sound that is played by the browser. It was downloaded from a site that said it was royalty free.

public/javascripts/alarm-manager.js:  This is code that runs in the browser and contains the javascript functions for manipulating the UI such as displaying the pin pad, sending HTTP requests to the server, displaying the image that was captured that triggered the alarm, and playing the alarm sound etc.

public/javascripts/jquery-3.4.1.min.js & public/javascripts/jquery-ui.min.js:  These 2 files contain code that runs in the browser and contains the open source jQuery code which is used to manipulate the HTML page. It was downloaded from the jQuery web page.

public/stylesheets/style.css:  This runs in the browser and contains the CSS style sheet code which controls how the HTML page is formatted by specifying colors, fonts, positioning and sizes etc.

public/index.html:  This is the main entry point for the browser app. It contains the HTML for the display, including the pin pad, the buttons, and the image that triggered the alarm etc.

.gitignore:  This file tells git which files (or patterns) it should ignore. It's usually used to avoid committing transient files from your working directory that aren't useful to other collaborators, such as compilation products, temporary files IDEs create, etc.

app.js:  This is server side code which contains the main Express application code

package.json:  The package. json is used to configure the node application and to specify what other library code it depends upon. It also contains scripts for running the application.
