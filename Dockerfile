# syntax=docker/dockerfile:1
   
FROM nginx:alpine As build
WORKDIR /
COPY . .
RUN apk add npm
RUN npm i
RUN npm run build --only=production

FROM nginx:alpine As production
WORKDIR /
COPY . .
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build build/ /usr/share/nginx/html
EXPOSE 3000
