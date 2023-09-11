#Project: AutoMotive Data Measurement and Visualization

This project is designed to measure sensor data from a device and generate real-time X-Y axis charts. Leveraging WebSocket.io technology, the application provides a robust and highly optimized solution for visualizing data. Even under challenging network conditions, our APIs consistently deliver data within an impressive 40-millisecond timeframe.

How to fire this up ??
-------------------------
make sure node.js and mongodb installed in  OS level

steps
-------
* from project dir

1)npm i
2)npm i pm2 -g
3)pm2 start automotive.mjs


if u want to monitor the logs
_________________________________
4)pm2 logs

to kill the services
________________________________
5)pm2 kill / pm2 delete automotive.mjs




note => 
---------
theres also a file called .env which we can set port and define database url , by default the port is 4001 , and database is accessed with in the system mongo service