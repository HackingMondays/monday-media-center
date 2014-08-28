monday-media-center
===================

To run the application:

- install the dependencies with: npm install
- run the application: npm start
- run the tests: npm test



Problem:

on ubuntu 13.10 when installing dependencies `npm install` an error appears:

12661 error nodewebkit@0.10.2 postinstall: `node scripts/install.js`
12661 error `sh "-c" "node scripts/install.js"` failed with 127
12662 error Failed at the nodewebkit@0.10.2 postinstall script.
12662 error This is most likely a problem with the nodewebkit package,
12662 error not with npm itself.
12662 error Tell the author that this fails on your system:
12662 error     node scripts/install.js
12662 error You can get their info via:
12662 error     npm owner ls nodewebkit
12662 error There is likely additional logging output above.
12663 error System Linux 3.11.0-26-generic
12664 error command "/usr/bin/nodejs" "/usr/bin/npm" "install"
12665 error cwd /home/slezier/other/monday-media-center
12666 error node -v v0.10.15
12667 error npm -v 1.2.18
12668 error code ELIFECYCLE

it seems that the path to nodejs (installation of nodejs with npm) is wrong.
To resolve this issue create a link: 
sudo ln -s /usr/bin/nodejs /usr/bin/node

