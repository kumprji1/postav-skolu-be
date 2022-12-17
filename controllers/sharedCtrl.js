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