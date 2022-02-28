
import './App.css';
import starNotaryAbi from "./starNotaryAbi.json";
import { contractAddress } from "./config";
import { ethers, BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { Button, Card } from 'react-bootstrap';


const starNotaryAddress = contractAddress;
function App() {
  // CONNECTING 
  const [accounts, setAccounts] = useState([]);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    starNotaryAddress,
    starNotaryAbi.abi,
    signer
  );
 
  // let name = document.getElementById('inp').value;

  async function connectAccounts() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      setAccounts(accounts);
    }
  }
  
  useEffect(() => {
    connectAccounts();
  }, []);

  window.addEventListener("load", async function () {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        starNotaryAddress,
        starNotaryAbi.abi,
        signer
      );
    } else {
      console.log('problem');
    }
  });
  
  async function createStar() {
    try {
      let starname;
      if (name.value == "") {
        starname = 'Nameless';
        console.log('nameless');
      } else {
        starname = name.value;
        console.log('value')
      }
        const response = await contract.createStar(starname, parseInt(source.value));

        console.log("response: ", response);

      } catch(err) {
        console.log("error: ", err);
      }
  }

  async function tokenIdToStarInfo() {
    let val = source.value;
    try {
      let response = await contract.tokenIdToStarInfo(parseInt(val));
      paragraph.innerText = response;
    } catch (err) {
      paragraph.innerText = err.message;
    }
  }
  const source = document.getElementById("inp");
  const paragraph = document.getElementById("paragraph");
  const name = document.getElementById("name");

  return (
    <div className="App d-flex justify-content-center">
      <Card className="p-4">
        <h5 className="card-title">Star notary</h5>
        <div className="card-body">
          <div className="">
            {/* <input id="inp" type="text"/> */}
            <Button className="m-2" onClick={() => createStar()}>
              Create a new star
            </Button>
            <Button className="m-2" onClick={() => tokenIdToStarInfo()}>
              Look up a star
            </Button>
            {/* <button onClick={() => getName()}>Call name</button> */}


          </div>
          <div className="">
            <p className="card-text"  id="paragraph"></p>
            <input type="text"  className="form-control" id="inp" placeholder="TokenId"/>
            <input type="text"  className="form-control" id="name" placeholder="Name"/>
          </div>
          <p>Hi there, thank you for checking out my project. Please follow these instructions</p>
          <ul>
            <li>use the console, errors will be displayed there</li>
            <li>Token 1-6 have been minted</li>
            <li>To create a star: enter a tokenId and a name</li>
            <li>To look up starinfo, enter a tokenId</li>
            <li>star nr 2 has been minted but it's name = ""</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}

export default App;
