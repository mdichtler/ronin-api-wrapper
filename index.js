const { default: axios } = require("axios");


function isRoninAddressValid(roninAddress) {
    return roninAddress.startsWith("ronin") && roninAddress.length === 46;
}

function transformFromRoninAddress(roninAddress) {
    return roninAddress.replace("ronin:", "0x");
}

async function explorerGetAccount(roninAddress) {
    if (isRoninAddressValid(roninAddress)) {
      
        let url = `https://explorer.roninchain.com/_next/data/MP4ApQgQgIMen7_H0KnjR/address/${roninAddress}.json?address=${roninAddress}`;
        try {
            let data = await axios.get(url);
            return data.data;
        } catch (e) {
            return e;
        }
    } else {
        return "Invalid address";
    }
}

async function explorerGetTransactions(roninAddress, from = 0, size = 10) {
    if (isRoninAddressValid(roninAddress)) {
        let modifiedRoninAddress = transformFromRoninAddress(roninAddress);
        let url = `https://explorer.roninchain.com/api/txs/${modifiedRoninAddress}?from=${from}&size=${size}`;
        try {
            let data = await axios.get(url);
            return data.data;
        } catch (e) {
            return e;
        }
    } else {
        return "Invalid address";
    }

}

async function explorerDecodeTransactionActions(transactions) {
    // transactions need to be in format of: 
    /*{
        contractAddress: "transaction.to",
        callData: 'transaction.input',
        logs: []
    } */
    
    let url = `https://decoder.roninchain.com/decoder/actions`

    let body = {
      txs: transactions
    };
    try {
        let data = await axios.post(url, body);
        return data.data;
    } catch (e) {
        return e;
    }

}

async function explorerGetERCTransfers(roninAddress, ercSuffix = 20, from = 0, size = 10) {
    // either ERC20 or ERC721 by sending individual number
    let modifiedRoninAddress = transformFromRoninAddress(roninAddress);
    let url = `https://explorer.roninchain.com/api/tokentxs?addr=${modifiedRoninAddress}&from=${from}&size=${size}&token=ERC${ercNumber}`;
    try {
        let data = await axios.get(url);
        return data.data;

    } catch (e) {
        return e;
    }

}

module.exports = {
    explorerGetAccount,
    explorerGetTransactions,
    explorerDecodeTransactionActions,
    explorerGetERCTransfers
};
