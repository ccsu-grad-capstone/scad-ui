## Shall script to run scad-ui

HTTP_PORT=8081


echo " "
echo "*****************************************************************************"
echo " "
echo "Starting 'SCAD Client' on HTTP_PORT=${HTTP_PORT} ..."
echo " "
echo "*****************************************************************************"
echo " "

echo " "
echo "Now performing server install ..."
echo " "
cd server
npm install
echo " "
echo "Server install done."
echo " "

echo " "
echo "Now performing client install ..."
echo " "
cd ..
cd client
npm install
cd ..
echo " "
echo "Client install done."
echo " "

filepath=`pwd`
echo "File path="${filepath}
echo " "

osascript -e 'tell application "Terminal" to do script "pwd;cd '"$filepath"';pwd;cd server;pwd;npm run serve"'
osascript -e 'tell application "Terminal" to do script "pwd;cd '"$filepath"';pwd;cd client;pwd;npm run serve"'
