Hi there, thank you for reviewing my project.

Token name: Nottystar
Token symbol: NS
Address on the Rinkeby network: 0x225b22Ab35Db7dbba8599A761A0470807f13174E
I didn't specify the openzeppelin version, I think it should be the latest.

I've opted to use hardhat and a newer version of solidity (0.8) for this project. I've 
spent a lot of time on translating the boilerplate and the testcode in test/starNotary2.js
but it should be good.

1 thing I didn't understand was how I should compare the name and symbol in the first
unit test. We have a Name and symbol for the token, but the struct Star has a name aswell.
The name and symbol of this token are hardcoded, but the stars name can be picked.

Here are the instructions to set up the project:

cd project2-starnotary
npm install
npx hardhat test (to run tests, should compile aswell)
npm run start (to start development server, it's a react project)

You should include a .env file in the root directory with your infura rinkeby key like this (hope you don't mind)
RINKEBY_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

Please contact me if you have any more questions.

Kind regards,
Dries Bosmans
