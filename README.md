# SENAC_ProvisionadorTeams

sudo https://nodejs.org/download/release/v14.17.0/node-v14.17.0-linux-x64.tar.xz
sudo tar -C /usr/local --strip-components 1 -xvf node-v14.17.0-linux-x64.tar.xz




docker rm -f senac_provisionador
docker image rm -f senac_provisionador

docker build --no-cache -t senac_provisionador .
docker run --name senac_provisionador -p 3555:3555 --restart always -d senac_provisionador

docker logs -f senac_provisionador


