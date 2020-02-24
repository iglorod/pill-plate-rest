const express = require('express');
const app = express();
const http = require('http');
const port = process.env.PORT || 4000;
const server = http.createServer(app);
const io = require('socket.io')(server);

server.listen(port);

const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');

const topicRoutes = require('./api/routes/topics');
const messagesRoutes = require('./api/routes/messages');
const commentsRoutes = require('./api/routes/comments');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb+srv://igLa:' + process.env.MONGO_PSW + '@cluster0-3h3ym.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(Error, err.message);
    });

app.use(morgan('dev'));

app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use('/topics', topicRoutes);
app.use('/topic/messages', messagesRoutes);
app.use('/topic/message/comments', commentsRoutes);
app.use('/user', userRoutes);

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

io.on('connection', socket => {
    socket.on('join-to-topic', room => {
        socket.join(room);
    });
    
    socket.on('leave-the-topic', room => {
        socket.leave(room);
    });

    socket.on('save-message', (room, data) => {
        io.to(room).emit('recive-message', data);
    })

    socket.on('edit-message', (room, data) => {
        io.to(room).emit('recive-edited-message', data);
    })
    
    socket.on('delete-message', (room, data) => {
        io.to(room).emit('recive-delete-message', data);
    })
});