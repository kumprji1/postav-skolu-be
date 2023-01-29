const mongoose = require('mongoose')

const LandPiece = require('../models/LandPiece')
const Project = require('../models/Project')

exports.getProjectByCategory = (req, res, next) => {
    const { category } = req.params
    Project.find({category: category})
    .then((projects) => {
        res.json(projects)
    })
    .catch(err => console.log(err))
}

exports.postCreateOrder = (req, res, next) => {
    console.log(req.body)
    res.json({message: 'ok'})
}

/**
 * Experimental ↓↓↓
 */

exports.getFewLandPiecesO3 = async (req, res, next) => {
    try {
        const landPieces = await LandPiece.find()
        return res.json(landPieces)
    } catch (err) { 
        console.log(err)
    }
}

exports.postBuyPieces = async (req, res, next) => {
    try {
        const piecesToBuy = req.body.landPiecesState.piecesToBuy

        // const session = await mongoose.startSession();
        // session.startSession();
        for (const piece of piecesToBuy) {
            // If it's already bought
            await LandPiece.updateOne({ number: piece.number }, {$set: { isBought: true }})
        }
        // await session.commitTransaction()
        
        /**
         * Pro každý piece zjistit, jestli již náhodou nebyl koupený, poté platba, pak označit ke koupi
         */
        res.json({message: 'OK'})
    } catch (err) {
        console.log(err)
    }
}