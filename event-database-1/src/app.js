const express = require('express');
const bodyParser = require('body-parser');
const eventRoutes = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/events', eventRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});