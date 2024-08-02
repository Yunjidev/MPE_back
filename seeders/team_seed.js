"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Teams",
      [
        {
            "id": 1,
            "firstname": "Thomas",
            "lastname": "Bobichon",
            "email": "thomas.bobichon@hotmail.fr",
            "github": "https://github.com/ZealRa",
            "linkedin": "https://www.linkedin.com/in/thomas-bobichon-824b65300/",
            "description": "Développeur FullStack Junior",
            "photo": "https://avatars.githubusercontent.com/u/165075472?v=4",
            "createdAt": "2024-08-01T12:54:50.130Z",
            "updatedAt": "2024-08-01T12:57:49.303Z"
        },
        {
            "id": 2,
            "firstname": "Sacha",
            "lastname": "Godel",
            "email": "godel.sacha@gmail.com",
            "github": "https://github.com/MacDuPain",
            "linkedin": "https://www.linkedin.com/in/sacha-godel-862a2a300/",
            "description": "Développeur FullStack Junior",
            "photo": "https://avatars.githubusercontent.com/u/164226646?v=4",
            "createdAt": "2024-08-01T12:54:50.130Z",
            "updatedAt": "2024-08-01T12:57:49.303Z"
        },
        {
            "id": 3,
            "firstname": "Thibault",
            "lastname": "Lenormand",
            "email": "thibault.lenormand24@gmail.com",
            "github": "https://github.com/ThibaultL24",
            "linkedin": "https://www.linkedin.com/in/thibault-lenormand-b38b96268/",
            "description": "Développeur FullStack Junior",
            "photo": null,
            "createdAt": "2024-08-01T12:54:50.130Z",
            "updatedAt": "2024-08-01T12:57:49.303Z"
        },
        {
            "id": 4,
            "firstname": "Nicolas",
            "lastname": "Vanbreusegem",
            "email": "yeezy77680@gmail.com",
            "github": "https://github.com/yeezynico",
            "linkedin": "https://www.linkedin.com/in/thomas-bobichon-824b65300/",
            "description": "Développeur FullStack Junior",
            "photo": null,
            "createdAt": "2024-08-01T13:13:26.118Z",
            "updatedAt": "2024-08-01T13:13:26.118Z"
        },
        {
            "id": 5,
            "firstname": "Winny",
            "lastname": "Drancourt",
            "email": "winny.morel@orange.fr",
            "github": "https://github.com/WinnyDrancourt",
            "linkedin": "https://www.linkedin.com/in/winny-drancourt-99b7932a8/",
            "description": "Freelance Developpeur",
            "photo": "https://avatars.githubusercontent.com/u/142529680?v=4",
            "createdAt": "2024-08-01T12:54:50.130Z",
            "updatedAt": "2024-08-01T12:57:49.303Z"
        },
        {
            "id": 6,
            "firstname": "Alexis",
            "lastname": "Brevier",
            "email": "brevieralexis@gmail.com",
            "github": "https://github.com/BrvAlexis",
            "linkedin": "www.linkedin.com/in/alexbrv-31devweb",
            "description": "Développeur Web",
            "photo": "https://avatars.githubusercontent.com/u/155978220?v=4",
            "createdAt": "2024-08-01T13:14:20.205Z",
            "updatedAt": "2024-08-01T13:14:20.205Z"
        },
        {
            "id": 7,
            "firstname": "Alexia",
            "lastname": "Cabanel",
            "email": "alexiacabanel1@gmail.com",
            "github": "https://github.com/alexiacabanel",
            "linkedin": "https://www.linkedin.com/in/alexia-cabanel/",
            "description": "Développeur Web",
            "photo": "https://avatars.githubusercontent.com/u/156107747?v=4",
            "createdAt": "2024-08-01T13:14:20.205Z",
            "updatedAt": "2024-08-01T13:14:20.205Z"
        },
        {
            "id": 8,
            "firstname": "Florian",
            "lastname": "Van Camp",
            "email": "florian.vancamp@gmail.com",
            "github": "https://github.com/Yunjidev",
            "linkedin": "https://www.linkedin.com/in/florian-van-camp-102aba262/",
            "description": "Développeur Web",
            "photo": "https://avatars.githubusercontent.com/u/95242143?v=4",
            "createdAt": "2024-08-01T13:14:20.205Z",
            "updatedAt": "2024-08-01T13:14:20.205Z"
        }
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Teams");
  },
};
