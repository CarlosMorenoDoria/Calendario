const express = require('express');

const router = express.Router();
const connection =require('../database');
const Events = require('./model');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/colors',async (req,res)=>{
    try{
        const event = new Events();
        const data = await event.getColors();
        console.log("data =", data);
        res.status(data.status ? data.status() : 200).json(data);
    }catch(err){
        res.status(err.status ? err.status() : 510).json(err);
    }
});
router.get('/lugar',async (req,res)=>{
    try{
        const event = new Events();
        const data = await event.getLugares();
        res.status(data.status ? data.status() : 200).json(data);
    }catch(err){
        res.status(err.status ? err.status() : 510).json(err);
    }
});
router.get('/events',async (req,res)=>{
    try{
        const event = new Events();
        const data = await event.getEvents();
        res.status(data.status ? data.status() : 200).json(data);
    }catch(err){
        res.status(err.status ? err.status() : 510).json(err);
    }
});
router.post('/create',jsonParser,async (req,res)=>{
    try{
        const event = new Events();
        console.log("obj= ",req.body);
        const data = await event.crearEvent(req.body);
        res.status(data.status ? data.status() : 200).json(data);
    }catch(err){
        res.status(err.status ? err.status() : 510).json(err);
    }
});

router.put('/edit',jsonParser, async (req,res)=>{
    try{
        const event = new Events();
        const data = await event.editarEvent(req.body);
        res.status(data.status ? data.status() : 200).json(data);
    }catch(err){
        res.status(err.status ? err.status() : 510).json(err);
    } 
});

router.delete('/delete/:id',urlencodedParser, async (req,res)=>{
    try{
        const id = req.params.id
        const event = new Events();
        const data = await event.eliminarEvent(id);
        res.status(data.status ? data.status() : 200).json(data);
    }catch(err){
        res.status(err.status ? err.status() : 510).json(err);
    } 
});

module.exports =router;