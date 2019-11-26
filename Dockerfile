FROM ubuntu:xenial-20191024
MAINTAINER JMMW jmgayosso@mightywizards.com
RUN apt-get update
RUN apt-get -y install apache2
# RUN apt-get install curl -y
# RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
# RUN apt-get install nodejs -y
# RUN service apache2 start
COPY ./dist/ /var/www/html
EXPOSE 80
# CMD /usr/sbin/apache2cli -D FOREGROUND
CMD /usr/sbin/apache2ctl -D FOREGROUND
# CMD service apache2 start -D FOREGROUND