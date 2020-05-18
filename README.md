# TCP Chat demo

A dead simple TCP chat built for Node.js with JavaScript.

![screenshot of the TCP chat](./screenshot.png)

## Install dependencies

To run this project, you need to install its dependencies with:

```bash
npm run install
```

* To add some colors and text style in the TCP chat, we use [colors](https://github.com/Marak/colors.js)
* To control the terminal cursor and contents, we use [ansi-escapes](https://github.com/sindresorhus/ansi-escapes) 

## Run

To run this project, you can use the `start` npm script like this:

```bash
npm run start
```

If you're contributing to this project and work with it on your local machine, you can use the `start:dev` npm script like this:

```bash
npm run start:dev
```

[nodemon](https://nodemon.io/) will watch your files and auto restart the server when you change something.

## Deploy

To deploy this demo on [Clever Cloud](https://www.clever-cloud.com/en/):

* You can create your app in the console UI and use a `git push`
* You can also do everything with the [clever-tools CLI](https://github.com/CleverCloud/clever-tools/):

```bash
clever create -t node tcp-chat-demo
clever env set TCP_PORT 4040
PUBLIC_TCP_PORT=$(clever tcp-redirs add --namespace cleverapps | sed 's/.*: //g')
clever env set PUBLIC_TCP_PORT ${PUBLIC_TCP_PORT}
clever deploy
```

Once this is deployed, you can browse your app as HTTP with:

```bash
clever open
``` 

It will prompt you a `nc` command to connect to your TCP chat.
