# TeachForSocialGood - Training Program Platform for Teachers
## Overview

This project is an open-source platform designed to help create and manage training programs for teachers. It allows administrators to build training programs with multiple sessions, steps, resources, and other content. The platform includes features for real-time session management and data collection, making it a powerful tool for managing teacher training programs.

This platform was originally developed and tested to support a specific teacher training program, under a bigger project "Te@ch4SocialGood: promoting pro-sociality in schools to prevent cyberbullying". The platform, however, has since been extended to allow for the creation of various types of training programs.

This repository includes both backend and frontend components, designed to be easily set up and managed by individuals with minimal programming knowledge. The platform uses MySQL, Node.js, and requires some basic familiarity with the Linux terminal.

## Important Notice
This project is being shared "as-is" with no plans for further development or maintenance. It is being shared in an open-source format with the hopes that anyone can utilize it for any training programs. Please feel free to use or extend the project.

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**. This means that you are free to use, modify, and distribute the software under the following conditions:

- Any modifications you make and distribute must also be licensed under GPL-3.0.
- If you distribute this software or any modifications, you must include the same GPL-3.0 license.

For more information, refer to the [LICENSE](./LICENSE) file or visit the [GPL-3.0 official page](https://www.gnu.org/licenses/gpl-3.0.en.html).

## Localization

**Currently, the platform is only localized in Portuguese(PT-PT).** If you need localization in other languages, you will need to modify the platform accordingly.

## Key Features

- **Program & Session Management**: Create and manage training programs with multiple sessions, steps, resources and templates.
- **Real-time Content Management**: Administrators can manage sessions in real-time, controlling content and flow during training.
- **Data Collection**: Each module describes the data that they save, able to be exported to an Excel file for analysis and improvement of training programs.
- **Modular Step Design**: The building block for a step is a module. These modules were designed to be able to rebuild the real use case, to allow for training programs to be flexible and to allow developers to extend functionality by adding custom modules.
- **No Coding Required for Usage**: Once hosted, the platform can be fully used and managed without any further programming.


## Technology Stack
### Frontend
- **Vue.js**: A modern JavaScript framework for building user interfaces.
- **Additional Tools**: TypeScript, BootstrapVue, Vite, Vue Router, and Vuex.
### Backend
- **Node.js with Express**: Handles server-side logic and API requests.
- **Sequelize-Typescript**: An ORM (Object-Relational Mapper) to handle database queries in a more object-oriented way.
- **Additional Tools**: Typescript, Axios, JsonWebToken, CORS, Body-Parser.
### Database
- **MySQL**: MySQL is used as the database. The platform requires a properly configured MySQL instance to operate.

## Contributing

- **Current Status**: This project is being shared as-is and is not actively maintained. While there are no formal plans for ongoing development or to accept contributions at this time, you are welcome to fork the repository and make modifications for your own use.
- **Future Contributions**: If you have improvements or modifications, you can still share them independently. However, please note that any pull requests submitted to this repository may not be reviewed or merged.

## More Details
For more details on this project, download the repository and follow the first boot instructions below. This will guide you through a demonstration of the platform along with a tutorial.

Additionally:
  - Go [here](/docs/DatabaseManagement.md) if you need help on how to manage the database.
  - Go [here](/docs/createModule.md) if you need help on adding a new module type to the codebase.

## First boot
For the first boot the user must have MySQL(to manage the initial database, version used v14.21.3), npm cli (for package management, node version used v18.11.0) and requires some basic familiarity with the Linux terminal.

This project has a built-in tutorial for both the setup and use of the platform through videos and a Glossary of Concepts. After cloning or downloading the repository, use a terminal and go to the frontend directory of the project. Once in the frontend directory, run the command `npm install` to download the npm packages, wait a few minutes, and then run the command `npm run demo` to start a local server. Then, open your browser and navigate to `localhost:8000` to access the demo of the platform."
