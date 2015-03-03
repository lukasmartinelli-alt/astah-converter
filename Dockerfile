FROM dockerfile/nodejs
MAINTAINER Lukas Martinelli <me@lukasmartinelli.ch>

# install oracle jdk7
RUN \
    echo oracle-java7-installer shared/accepted-oracle-license-v1-1 select true | debconf-set-selections && \
    add-apt-repository -y ppa:webupd8team/java && \
    apt-get update && \
    apt-get install -y oracle-java7-installer && \
    rm -rf /var/lib/apt/lists/* && \
    rm -rf /var/cache/oracle-jdk7-installer

# install astah
RUN wget http://cdn.change-vision.com/files/astah-professional-6_9_0-b4c6e9.zip
RUN unzip astah-professional-6_9_0-b4c6e9.zip -d /opt && rm astah-professional-6_9_0-b4c6e9.zip
WORKDIR /opt/astah_professional
RUN chmod +x astah-command.sh

# install app
RUN mkdir -p /opt/astah-api
WORKDIR /opt/astah-api
COPY package.json /opt/astah-api/package.json
RUN npm install
EXPOSE 3000
CMD ["node", "server.js"]
COPY . /opt/astah-api
