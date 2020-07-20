FROM buildkite/puppeteer
    
COPY . /code
WORKDIR /code
RUN npm install
CMD [ "npm", "start" ]