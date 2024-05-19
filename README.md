local dev run:
npm i
npm start

local prod run:
docker build -t html-server-image:v1 .
docker run -d -p 80:80 html-server-image:v1
curl localhost:80

kamatera prod run:
go to Servers in Kamatera
Open > Connect > Open Remote Console (username root and password in firefox saved passwords)
cd lorecraft
run the above "local prod run" steps