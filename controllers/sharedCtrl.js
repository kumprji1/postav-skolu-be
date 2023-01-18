const mongoose = require('mongoose')

const LandPiece = require('../models/LandPiece')
const Project = require('../models/Project')

exports.getProjectByCategory = (req, res, next) => {
    const { category } = req.params
    console.log(category)
    Project.find({category: category})
    .then((projects) => {
        res.json(projects)
    })
    .catch(err => console.log(err))
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
        console.log(piecesToBuy)

        // const session = await mongoose.startSession();
        // session.startSession();
        await LandPiece.updateOne({ number: piecesToBuy[0].number }, {$set: { isBought: true }})
        // await session.commitTransaction()
        res.json({message: 'OK'})
    } catch (err) {
        console.log(err)
    }
}