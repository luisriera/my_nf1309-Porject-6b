// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain')

contract('SupplyChain', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1
    var upc = 1
    const ownerID = accounts[0]
    const originFarmerID = accounts[1]
    const originFarmName = "John Doe"
    const originFarmInformation = "Yarray Valley"
    const originFarmLatitude = "-38.239770"
    const originFarmLongitude = "144.341490"
    var productID = sku + upc
    const productNotes = "Best beans for Espresso"
    const productPrice = web3.utils.toWei("1", "ether")
    var itemState = 0
    const distributorID = accounts[2]
    const retailerID = accounts[3]
    const consumerID = accounts[4]
    console.log("ganache-cli accounts used here...")
    console.log("Contract Owner: accounts[0] ", accounts[0])
    console.log("Farmer: accounts[1] ", accounts[1])
    console.log("Distributor: accounts[2] ", accounts[2])
    console.log("Retailer: accounts[3] ", accounts[3])
    console.log("Consumer: accounts[4] ", accounts[4])

    // 1st Test
    it("Testing smart contract function harvestItem() that allows a farmer to harvest coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        var eventEmitted = false

        // Add the FarmerRole
        await supplyChain.addFarmer(originFarmerID);

        // Watch the emitted event Harvested()
        supplyChain.getPastEvents('Harvested', {fromBlock: 0, toBlock: 'latest'}).then(function (event) {
            eventEmitted = true;
            //console.log(event);
        });

        // Mark an item as Harvested by calling function harvestItem()
        await supplyChain.harvestItem(
            upc,
            originFarmerID,
            originFarmName,
            originFarmInformation,
            originFarmLatitude,
            originFarmLongitude,
            productNotes, {from: originFarmerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Incorrect item SKU')
        assert.equal(resultBufferOne[1], upc, 'Incorrect item UPC')
        assert.equal(resultBufferOne[2], originFarmerID, 'Incorrect ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Incorrect originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Incorrect originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Incorrect originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Incorrect originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Incorrect originFarmLongitude')
        assert.equal(resultBufferTwo[5], 0, 'Incorrect item state')
        assert.equal(eventEmitted, true, 'Incorrect event emitted')
    })

    // 2nd Test
    it("Testing smart contract function processItem() that allows a farmer to process coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        var eventEmitted = false;

        // Watch the emitted event Processed()
        supplyChain.getPastEvents('Processed', {fromBlock: 0, toBlock: 'latest'}).then(function (event) {
            eventEmitted = true;
            //console.log(event);
        });

        // Mark an item as Processed by calling function processtItem()
        await supplyChain.processItem(upc, {from: originFarmerID});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

        // Verify the result set
        itemState = 1;
        assert.equal(resultBufferOne[0], sku, 'Incorrect item SKU')
        assert.equal(resultBufferOne[1], upc, 'Incorrect item UPC')
        assert.equal(resultBufferTwo[5], itemState, 'Incorrect item state');
        assert.equal(eventEmitted, true, 'Incorrect event emitted');
    })

    // 3rd Test
    it("Testing smart contract function packItem() that allows a farmer to pack coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        var eventEmitted = false;

        // Watch the emitted event Packed()
        supplyChain.getPastEvents('Packed', {fromBlock: 0, toBlock: 'latest'}).then(function (event) {
            eventEmitted = true;
            //console.log(event);
        });

        // Mark an item as Packed by calling function packItem()
        await supplyChain.packItem(upc, {from: originFarmerID});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

        // Verify the result set
        itemState = 2;
        assert.equal(resultBufferOne[0], sku, 'Incorrect item SKU')
        assert.equal(resultBufferOne[1], upc, 'Incorrect item UPC')
        assert.equal(resultBufferTwo[5], itemState, 'Incorrect item state');
        assert.equal(eventEmitted, true, 'Incorrect  event emitted');
    })

    // 4th Test
    it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        var eventEmitted = false;

        // Watch the emitted event ForSale()
        supplyChain.getPastEvents('ForSale', {fromBlock: 0, toBlock: 'latest'}).then(function (event) {
            eventEmitted = true;
            //console.log(event);
        });

        // Mark an item as ForSale by calling function sellItem()
        await supplyChain.sellItem(upc, productPrice, {from: originFarmerID});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc);

        // Verify the result set
        itemState = 3;
        assert.equal(resultBufferOne[0], sku, 'Incorrect item SKU')
        assert.equal(resultBufferOne[1], upc, 'Incorrect item UPC')
        assert.equal(resultBufferTwo[4], productPrice, 'Incorrect item price');
        assert.equal(resultBufferTwo[5], itemState, 'Incorrect item state');
        assert.equal(eventEmitted, true, 'Incorrect  event emitted');
    })

    // 5th Test
    it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        var eventEmitted = false;

        // Add the DistributorRole
        await supplyChain.addDistributor(distributorID);

        // Watch the emitted event Sold()
        supplyChain.getPastEvents('Sold', {fromBlock: 0, toBlock: 'latest'}).then(function (event) {
            eventEmitted = true;
            //console.log(event);
        });

        // Mark an item as Sold by calling function buyItem()
        supplyChain.buyItem(upc, {from: distributorID, value: productPrice});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne(upc);
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc);

        // Verify the result set
        itemState = 4;
        assert.equal(resultBufferOne[0], sku, 'Incorrect item SKU')
        assert.equal(resultBufferOne[1], upc, 'Incorrect item UPC')
        assert.equal(resultBufferTwo[5], itemState, 'Incorrect  item state');
        assert.equal(resultBufferTwo[6], distributorID, 'Incorrect distributorID');
        assert.equal(eventEmitted, true, 'Incorrect event emitted');

    })

    // 6th Test
    it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        var eventEmitted = false;

        // Watch the emitted event Shipped()
        supplyChain.getPastEvents('Shipped', {fromBlock: 0, toBlock: 'latest'}).then(function (event) {
            eventEmitted = true;
            //console.log(event);
        });

        // Mark an item as Sold by calling function buyItem()
        supplyChain.shipItem(upc, {from: distributorID});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne(upc);
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc);

        // Verify the result set
        itemState = 5;
        assert.equal(resultBufferOne[0], sku, 'Incorrect item SKU')
        assert.equal(resultBufferOne[1], upc, 'Incorrect item UPC')
        assert.equal(resultBufferOne[2], distributorID, 'Incorrect ownerID');
        assert.equal(resultBufferTwo[5], itemState, 'Incorrect item state');
        assert.equal(eventEmitted, true, 'Incorrect event emitted');
    })

    // 7th Test
    it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        var eventEmitted = false;

        // Add the RetailerRole
        await supplyChain.addRetailer(retailerID);

        // Watch the emitted event Received()
        supplyChain.getPastEvents('Received', {fromBlock: 0, toBlock: 'latest'}).then(function (event) {
            eventEmitted = true;
            //console.log(event);
        });

        // Mark an item as Received by calling function ReceivedItem()
        supplyChain.receiveItem(upc, {from: retailerID});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne(upc);
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc);

        // Verify the result set
        itemState = 6;
        assert.equal(resultBufferOne[0], sku, 'Incorrect item SKU')
        assert.equal(resultBufferOne[1], upc, 'Incorrect item UPC')
        assert.equal(resultBufferTwo[5], itemState, 'Incorrect item state');
        assert.equal(resultBufferTwo[7], retailerID, 'Incorrect retailerID');
        assert.equal(eventEmitted, true, 'Incorrect event emitted');

    })

    // 8th Test
    it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        var eventEmitted = false;

        // Add the ConsumerRole
        await supplyChain.addConsumer(consumerID);

        // Watch the emitted event Purchased()
        supplyChain.getPastEvents('Purchased', {fromBlock: 0, toBlock: 'latest'}).then(function (event) {
            eventEmitted = true;
            //console.log(event);
        });

        // Mark an item as Sold by calling function buyItem()
        supplyChain.purchaseItem(upc, {from: consumerID});

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne(upc);
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc);

        // Verify the result set
        itemState = 7;
        assert.equal(resultBufferOne[0], sku, 'Incorrect item SKU')
        assert.equal(resultBufferOne[1], upc, 'Incorrect item UPC')
        assert.equal(resultBufferTwo[5], itemState, 'Incorrect item state');
        assert.equal(resultBufferTwo[8], consumerID, 'Incorrect ConsumerID');
        assert.equal(eventEmitted, true, 'Incorrect event emitted');
    })

    // 9th Test
    it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne(upc);

        // Verify the result set:
        assert.equal(resultBufferOne[0], sku, 'Incorrect itemSKD');
        assert.equal(resultBufferOne[1], upc, 'Incorrect itemUPC');
        assert.equal(resultBufferOne[2], consumerID, 'Incorrect ownerID');
        assert.equal(resultBufferOne[3], originFarmerID, 'Incorrect originFarmerID');
        assert.equal(resultBufferOne[4], originFarmName, 'Incorrect originFarmName');
        assert.equal(resultBufferOne[5], originFarmInformation, 'Incorrect originFarmInformation');
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Incorrect originFarmLatitude');
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Incorrect originFarmLongitude');
    })

    // 10th Test
    it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc);

        // Verify the result set:
        assert.equal(resultBufferTwo[0], sku, 'Incorrect itemSKD');
        assert.equal(resultBufferTwo[1], upc, 'Incorrect itemUPC');
        assert.equal(resultBufferTwo[2], productID, 'Incorrect productID');
        assert.equal(resultBufferTwo[3], productNotes, 'Incorrect productNotes');
        assert.equal(resultBufferTwo[4], productPrice, 'Incorrect productPrice');
        assert.equal(resultBufferTwo[5], itemState, 'Incorrect itemState');
        assert.equal(resultBufferTwo[6], distributorID, 'Incorrect distributorID');
        assert.equal(resultBufferTwo[7], retailerID, 'Incorrect retailerID');
        assert.equal(resultBufferTwo[8], consumerID, 'Incorrect ConsumerID');
    })
});

