beatbiome.gif is in iadventure's google drive

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
cd laplante_apps_website
run local prod run steps above

gcloud prod run:
git clone https://github.com/bmbmjmdm/laplante_apps_website.git
// no longer needed because of google cloud storage
/*
  pip install gdown
  cd laplante_apps_website
  cd src/assets
/home/bmbmjmdm/.local/bin/gdown https://drive.google.com/uc?id=1qkanzy4daSqk7Ir0ZjEKzVkOo9q1ctvA
*/
gcloud services enable cloudbuild.googleapis.com
gcloud builds submit --tag gcr.io/${GOOGLE_CLOUD_PROJECT}/monolith:1.0.0 .
gcloud run deploy --image=gcr.io/${GOOGLE_CLOUD_PROJECT}/monolith:1.0.0 --platform managed