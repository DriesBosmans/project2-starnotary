//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

//Importing openzeppelin-solidity ERC-721 implemented Standard
//import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//Import console log;

// StarNotary Contract declaration inheritance the ERC721 openzeppelin implementation
contract StarNotary is ERC721 {
    // Star data
    struct Star {
        string name;
    }


    // mapping the Star with the Owner Address
    mapping(uint256 => Star) public tokenIdToStarInfo;
    // mapping the TokenId and price
    mapping(uint256 => uint256) public starsForSale;
    address public owner;

    // Implement Task 1 Add a name and symbol properties
    // Is passed into constructor
    constructor() ERC721('Nottystar', 'NS') {owner = msg.sender;}
   
    // Create Star using the Struct
    function createStar(string memory _name, uint256 _tokenId) public {
        // Passing the name and tokenId as a parameters
        Star memory newStar = Star(_name); // Star is an struct so we are creating a new Star
        tokenIdToStarInfo[_tokenId] = newStar; // Creating in memory the Star -> tokenId mapping
        _safeMint(msg.sender, _tokenId); // _mint assign the the star with _tokenId to the sender address (ownership)
        
    }

    // Putting an Star for sale (Adding the star tokenid into the mapping starsForSale, first verify that the sender is the owner)
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(
            ownerOf(_tokenId) == msg.sender,
            "You can't sell the Star you don't own"
        );
        starsForSale[_tokenId] = _price;
        //_approve(address(this),_tokenId);
    }



    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0, "The Star should be up for sale");
        uint256 starCost = starsForSale[_tokenId];
        address ownerAddress = ownerOf(_tokenId);
        
        require(msg.value > starCost, "You need to have enough Ether");
            _approve(address(msg.sender), _tokenId);

        transferFrom(ownerAddress, msg.sender, _tokenId); // We can't use _addTokenTo or_removeTokenFrom functions, now we have to use _transferFrom
        
        // needed to make sender address payable
        address payable ownerAddressPayable = payable(ownerAddress); // We need to make this conversion to be able to use transfer() function to transfer ethers
        ownerAddressPayable.transfer(starCost);
        if (msg.value > starCost) {
            // replaced the custom method for it already exists
            payable(msg.sender).transfer(msg.value - starCost);
            
        }
    }

    // Implement Task 1 lookUptokenIdToStarInfo
    function lookUptokenIdToStarInfo(uint256 _tokenId)
        public
        view
        returns (string memory)
    {
        //1. You should return the Star saved in tokenIdToStarInfo mapping
        return tokenIdToStarInfo[_tokenId].name;
    }

    // Implement Task 1 Exchange Stars function
    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {
        //1. Passing to star tokenId you will need to check if the owner of _tokenId1 or _tokenId2 is the sender
        //2. You don't have to check for the price of the token (star)
        //3. Get the owner of the two tokens (ownerOf(_tokenId1), ownerOf(_tokenId2)
        //4. Use _transferFrom function to exchange the tokens.

        //!  Shouldn't the other party have to agree to the exchange of tokens?
        
        if (ownerOf(_tokenId1) == msg.sender) {
            _approve(address(msg.sender), _tokenId2);
            transferFrom(msg.sender, ownerOf(_tokenId2), _tokenId1);
            transferFrom(ownerOf(_tokenId2), msg.sender, _tokenId2);
        } else if (ownerOf(_tokenId2) == msg.sender){
            _approve(address(msg.sender), _tokenId1);
            transferFrom(msg.sender, ownerOf(_tokenId1), _tokenId2);
            transferFrom(ownerOf(_tokenId1), msg.sender, _tokenId1);
        }
    }

    // Implement Task 1 Transfer Stars
    function transferStar(address _to1, uint256 _tokenId) public {
        //1. Check if the sender is the ownerOf(_tokenId)
        //2. Use the transferFrom(from, to, tokenId); function to transfer the Star
        require(msg.sender == ownerOf(_tokenId), "sender is not the owner");
        transferFrom(msg.sender,_to1, _tokenId);
    }
}