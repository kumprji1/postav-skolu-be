const Project = require('../models/Project')

exports.createProjects = () => {
    const project1 = new Project({
        type: 'donate',
        title: 'Zábavné učebny',
        urlTitle: 'zabavne-ucebny',
        desc: 'Popis',
        photo: 'url_fotky',
        earnedMoney: 11_000,
        maxMoney: 50_000
      })
      const project2 = new Project({
        type: 'products',
        title: 'Dětské výrobky',
        urlTitle: 'detske-vyrobky',
        desc: 'Popis',
        photo: 'url_fotky',
        earnedMoney: 20_000,
        maxMoney: 50_000
      })
      const project3 = new Project({
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