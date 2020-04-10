# eo1-projects
eo1 projects vizzes, websites

TODO
- build an image/text API
- tie these effects together in one viewer
- build some nice text displays

other ideas
- do some color shift effect like matt's phish/video aesthetic

useful links
http://localhost:5000/app/twitter/index.html?viz=embed&q=pantone%20colors&interval=10s



## personal deployment notes
docker build -t eo1 .;

docker stop eo1; docker rm eo1;
docker run -d \
  -e VIRTUAL_HOST=eo1.blackmad.com,eo2.blackmad.com \
  --name=eo1 eo1
