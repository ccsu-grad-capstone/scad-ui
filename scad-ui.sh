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
echo "Now performing client install ..."
echo " "
npm install
echo " "
echo "Client install done."
echo " "
npm run serve

