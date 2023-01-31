const LandPiece = require('../models/LandPiece')
const Project = require('../models/Project')

exports.createProjects = () => {
    const project1 = new Project({
        category: 'dvur',
        type: 'donate',
        title: 'Zábavné učebny',
        urlTitle: 'zabavne-ucebny',
        desc: 'Popis',
        photo: 'url_fotky',
        earnedMoney: 11_000,
        maxMoney: 50_000
      })
      const project2 = new Project({
        category: 'dvur',
        type: 'products',
        title: 'Dětské výrobky',
        urlTitle: 'detske-vyrobky',
        desc: 'Popis',
        photo: 'url_fotky',
        earnedMoney: 20_000,
        maxMoney: 50_000
      })
      const project3 = new Project({
        category: 'dvur',
        type: 'donate-land',
        title: 'Kup si svoji část pozemku',
        urlTitle: 'kup-si-svoji-cast-pozemku',
        desc: 'Popis',
        photo: 'url_fotky',
        earnedMoney: 30_000,
        maxMoney: 50_000
      })
      project1.save();
      project2.save();
      project3.save();
}

exports.createFewLandPiecesO3 = () => {
  new LandPiece({
    number: 1,
    title: 'Oranžový trojúhelník',
    price: 100,
    photo: 'url',
    town: 'dvur',
    usersText: '',
    isAnonymous: false,
    isBought: false,
    area: 'O3_1',
    edges: 3
  }).save()
  new LandPiece({
    number: 2,
    title: 'Oranžový trojúhelník',
    price: 100,
    photo: 'url',
    town: 'dvur',
    usersText: '',
    isAnonymous: false,
    isBought: false,
    area: 'O3_1',
    edges: 3
  }).save()
  new LandPiece({
    number: 3,
    title: 'Oranžový trojúhelník',
    price: 100,
    photo: 'url',
    town: 'dvur',
    usersText: '',
    isAnonymous: false,
    isBought: false,
    area: 'O3_1',
    edges: 3
  }).save()
  new LandPiece({
    number: 4,
    title: 'Oranžový trojúhelník',
    price: 100,
    photo: 'url',
    town: 'dvur',
    usersText: '',
    isAnonymous: false,
    isBought: false,
    area: 'O3_1',
    edges: 3
  }).save()
  new LandPiece({
    number: 5,
    title: 'Oranžový trojúhelník',
    price: 100,
    photo: 'url',
    town: 'dvur',
    usersText: '',
    isAnonymous: false,
    isBought: false,
    area: 'O3_1',
    edges: 3
  }).save()
}