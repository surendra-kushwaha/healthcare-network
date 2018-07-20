/* eslint-disable no-unused-vars */
// import logger from '../../logger';

const authority = [
  {
    ownerId: 'A1001',
    username: 'admin',
    type: 'authority',
  },
];

const customer = [
  {
    ownerId: 'A1001',
    username: 'prakash@accenture.com',
    type: 'customer',
    role: 'customer1',
  },
  {
    ownerId: 'A1001',
    username: 'surendra@accenture.com',
    type: 'customer',
    role: 'customer2',
  },
];


const users = authority.concat(customer);

const password = 'healthcare@123';

const login = (req, res) => {
  console.info(`Entered login function`);
  try {
    const credentials = req.body.credentials;
    const usernameReceived = credentials.userName;
    const passwordReceived = credentials.password;
    console.log(JSON.stringify(req.body, null, 2));

    console.info(`Username`, usernameReceived);
    console.info(`Password`, passwordReceived);
    if (passwordReceived !== password) {
      console.info(`Passwords don't match`);
      res.status(403).end();
      return;
    }
    try {
      users.forEach(user => {
        if (user.username === usernameReceived) {
          //if (user.type === 'farmer') {
            const payload = {
              userID: user.username,
              type: user.type,
              role: `${user.role}`,
              name: `${user.username}`,
            };
            res.json(payload).send();
            return;
          //}
          /*if (user.role === 'consumer') {
            const payload = {
              userID: user.providerId,
              role: user.role,
              name: `${user.firstName} ${user.lastName}`,
              location: '',
            };
            res.json(payload).end();
            return;
          }
            res.json(payload).end();
          }*/
        }
        // res.status(405).end();
      });
      //res.status(403).end();
      //res.send("user not found");
      return;
    } catch (error) {
      console.error(`There was an error querying the database`, error);
    }
  } catch (error) {
    console.error(`Couldn't obtain username and password from client`, error);
  }
};

module.exports = login;
