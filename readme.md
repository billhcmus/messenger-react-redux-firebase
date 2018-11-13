# Messenger Web App

### Introduction
- This app was created by Phan Trọng Thuyên
- Using React, Redux and Firebase
- A simple chat app, you can use to chat with other person, you can also send image file.
- Git repository: ```https://github.com/billhcmus/messenger-react-redux-firebase```

### How to build
- Go to project path and type the follow command:
```
npm start
```

### Function
- Login with google authentication
- Chat to each other realtime
- Show user status ```online``` or ```offline```
- Give a star to one person, that person will be on top of conversation.
- You can search people by name, after click on one person in result you can chatting with he/she

### Project structure

![](https://raw.githubusercontent.com/billhcmus/messenger-react-redux-firebase/master/images/project-structure.png)

- Detail:
    - ```index.js```
        - Maybe tell that file is an entrypoint of react program, this file contain all config of ```firebase```
        - Import some css file or initialize state for redux
    - ```App.js```
        - Contain Route, this component will decide what page you can access
        - On componentWillMount this will register a event call onAuthStateChange. Therefore when user login success, this will access to firebase and write some information.
    - ```Component```
        - This folder contain some component of the chat, such as: Login, Channel, Conversation and so on.
        - ```Login.js``` This component will render the interface for user login. But when user used to login or something like that, this will redirect to homepage.
        - ```Home.js``` This contain main content about chat, include header, messages contain, messages input, search, channel.
        - ```Header.js``` This component will show channel info, also this show avatar of your, when click on avatar you can choose ```logout``` to end your session.
        - ```Conversation.js```: This component contain another component: Search, Channel, MessageContent
        - ```Channel.js```: This component contain some state about users, users was mapped from firebase realtime database and this will update when any person login to chat app. When you login, this will show all available user in chatapp. And this will sort when you have change on any channel. when you click at any channel, channel will be actived and you can send message or send images to this user.
        - ```MessageContent.js```: This will show all message belong to active channel, when you click to one channel, this component will show message of this channel. This content ```MessageInput``` to type your message or send your file.
    - ```constant```:
        - This folder contain one file call ```index.js``` to definition some variable const.
    - ```action```:
        - This contain some define of action. Ex: ```changeActiveChannelId```
    - ```css```:
        - This contain some style sheet for above component.

### Package using in this Project

```
redux
react-redux
react-redux-firebase
firebase
antdesign
react-dom
react-firebase-file-uploader
lodash
classnames
moment
is-image-url
```
    
### Web Page

https://messenger-mid-term.firebaseapp.com

### Git commit

![](https://raw.githubusercontent.com/billhcmus/messenger-react-redux-firebase/master/images/commit.png)