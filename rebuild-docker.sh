#!/bin/sh

docker build -t eo1 .;

docker stop eo1; docker rm eo1;
docker run -d  -e VIRTUAL_HOST=eo1.blackmad.com,eo2.blackmad.com   --name=eo1 eo1
