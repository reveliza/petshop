const express = require('express');
const Joi = require('joi');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const courses = [
    {id: 1, name: 'nodeJS'},
    {id: 2, name: 'react'},
    {id: 3, name: 'python'},
    {id: 4, name: 'django'},
]

app.get('/', (req, res) => {
    res.send('Welcome to the API service')
});

app.get('/api/courses', (req, res) => {
    res.send(courses)
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('woopsies');
    
    res.send(course)
})

app.post('/api/courses', (req, res) => {
    const { error } = validator(req.body.name);
    if (error) return res.status(404).send(error.details[0].message);

    const course = {
        id: courses.length +1,
        name: req.body.name
    }

    courses.push(course);
    res.send(course);
})

app.put('/api/courses/:id', (req,res) => {
    // does course exist
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('course not found');

    // is the request good
    const { error } = validator(req.body.name);
    if (error) return res.status(400).send(error.details[0].message);

    // update course name
    course.name = req.body.name;

    // return update to client
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('course not found');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
})

app.listen(PORT, () => {});

function validator(name){
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    })

    return schema.validate({name: name});
}