const { default: axios } = require("axios");

function isRoninAddressValid(roninAddress) {
  return roninAddress.startsWith("ronin") && roninAddress.length === 46;
}

function transformFromRoninAddress(roninAddress) {
  return roninAddress.replace("ronin:", "0x");
}

async function explorerGetAccount(roninAddress) {
  /**
   * Returns account details for specific ronin address
   * @param {String} roninAddress - 'ronin:' formatted address
   * @since      1/21/2022
   * @return {Object} Returns account details or exception.
   * Sample response:
   * {
        address: '0x3ead4ca7305e30169e42437c74e7c81bdab7b9c3',
        balance: '0',
        timestamp: null,
        transactionCount: '26',
        blockNumber: 10404510,
        contractCreator: null,
        atTx: null,
        atBlock: null,
        totalNfts: 0,
        erc20Networth: 0.00000291999401061816
    }
   * */
  if (isRoninAddressValid(roninAddress)) {
    let url = `https://explorer.roninchain.com/_next/data/MP4ApQgQgIMen7_H0KnjR/address/${roninAddress}.json?address=${roninAddress}`;
    try {
      let data = await axios.get(url);
      return data.data?.pageProps?.accountInfo;
    } catch (e) {
      return e;
    }
  } else {
    return "Invalid address";
  }
}

async function explorerGetTransactions(roninAddress, from = 0, size = 10) {
  /**
   * Returns transactions for specific ronin address
   * @param {String} roninAddress - 'ronin:' formatted address
   * @param {Number} from - Start from
   * @param {Number} size - Number of transactions
   * @since      1/21/2022
   * @return {Object} Returns array of transaction actions or exception.
   * Sample response:
   * {
        total: 26,
        results: [
            {
            hash: '0x1b40db41915a4d028c734e6918a1bfdf1dadaf8e8362b1615c2870013bbf4387',
            block_hash: '0xbe2b5d8be4f782611bbe222570a83bc484c13ee65581872808db3dc8d6f3cf03',
            block_number: 10404510,
            from: '0x3ead4ca7305e30169e42437c74e7c81bdab7b9c3',
            to: '0x32950db2a7164ae833121501c797d79e7b79d74c',
            gas: '368888',
            gas_price: '0',
            input: '0x42842e0e0000000000000000000000003ead4ca7305e30169e42437c74e7c81bdab7b9c3000000000000000000000000d0e1739f15e09a5f3cdf8bbd6eb8a532e2d9d895000000000000000000000000000000000000000000000000000000000028cb97',
            nonce: 25,
            tx_index: 56,
            value: '0',
            timestamp: 1642798207,
            gas_used: '79263',
            cumulative_gas_used: '7113087',
            contract_address: null,
            status: 1,
            confirmed: true,
            published: 1642798237173072100
            },
            {
            hash: '0xb544e7cd5ef4daea13c4c6370111752bb1cb72f9dcdf00538a407d8b9ddaa90f',
            block_hash: '0xbe2b5d8be4f782611bbe222570a83bc484c13ee65581872808db3dc8d6f3cf03',
            block_number: 10404510,
            from: '0x3ead4ca7305e30169e42437c74e7c81bdab7b9c3',
            to: '0x213073989821f738a7ba3520c3d31a1f9ad31bbd',
            gas: '698575',
            gas_price: '0',
            input: '0x4d51bfc4000000000000000000000000f48a09b0af4b51048df65ac575e01d892cf9dabc000000000000000000000000c99a6a985ed2cac1ef41640596c5a5f9f4e19ef500000000000000000000000000000000000000000000000000470de4df8200000000000000000000000000000000000000000000000000000000000000233dc852221010c9d3f6c8e23c2cd53ea75d5e123224892639da2ad4958506260c7c35',
            nonce: 24,
            tx_index: 6,
            value: '0',
            timestamp: 1642798207,
            gas_used: '29847',
            cumulative_gas_used: '208929',
            contract_address: null,
            status: 0,
            confirmed: true,
            published: 1642798237167369700
            }
        ]
    }
   * */

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
  /**
   * Returns decoded transaction actions
   * @param {Object} transactions - transactions need to be in format of: 
        {
            contractAddress: "transaction.to",
            callData: 'transaction.input',
            logs: []
        }
   * @since      1/21/2022
   * @return {Object} Returns array of transaction actions or exception.
   */
  let url = `https://decoder.roninchain.com/decoder/actions`;

  let body = {
    txs: transactions,
  };
  try {
    let data = await axios.post(url, body);
    return data.data;
  } catch (e) {
    return e;
  }
}

async function explorerGetERCTransfersByRoninAddress(
  roninAddress,
  ercSuffix = 20,
  from = 0,
  size = 10
) {
  /**
   * Returns ERC transfers for specific ronin address
   * @param {String} roninAddress - 'ronin:' formatted address
   * @param {Number, String} ercSuffix - Either 20 or 721
   * @param {Number} from - Start from
   * @param {Number} size - Number of transfers
   * @since      1/21/2022
   * @return {Object} Returns transfers or exception.
   * Sample response:
   {
    total: 5,
    results: [
        {
        from: '0x3ead4ca7305e30169e42437c74e7c81bdab7b9c3',
        to: '0xa99cacd1427f493a95b585a5c7989a08c86a616b',
        value: '850000000000000',
        log_index: '9',
        tx_hash: '0x7381de4f019a30dbd14e1568772a81e5365dbe879a5c0493604a27662e06399c',
        block_number: 10404504,
        timestamp: 1642798189,
        token_address: '0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5',
        token_decimals: 18,
        token_name: 'Ronin Wrapped Ether',
        token_symbol: 'WETH',
        token_type: 'ERC20'
        },
        {
        from: '0x3ead4ca7305e30169e42437c74e7c81bdab7b9c3',
        to: '0xf48a09b0af4b51048df65ac575e01d892cf9dabc',
        value: '19150000000000000',
        log_index: '10',
        tx_hash: '0x7381de4f019a30dbd14e1568772a81e5365dbe879a5c0493604a27662e06399c',
        block_number: 10404504,
        timestamp: 1642798189,
        token_address: '0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5',
        token_decimals: 18,
        token_name: 'Ronin Wrapped Ether',
        token_symbol: 'WETH',
        token_type: 'ERC20'
        }
    ]
   }
   */
  let modifiedRoninAddress = transformFromRoninAddress(roninAddress);
  let url = `https://explorer.roninchain.com/api/tokentxs?addr=${modifiedRoninAddress}&from=${from}&size=${size}&token=ERC${ercSuffix}`;
  try {
    let data = await axios.get(url);
    return data.data;
  } catch (e) {
    return e;
  }
}

async function explorerGetLatestBlocks(size = 10) {
  /**
   * Returns latest blocks as well as total amount of transactions
   * @param {Number} size - Number of blocks to return
   * @since      1/21/2022
   * @return {Object} Returns blocks or exception.
   * Sample response:
   {
        total: 10405229,
        results: [
            {
            number: 10405229,
            hash: '0x1f67693a19f43caac0fbcdfb4590e92f0596e368567f58d9454b48f888f584a1',
            parent_hash: '0xc09587c536c71f3a6c0c8eea0ccffea5870d644a44cc1af9604cdc1774671e9d',
            nonce: '0x0',
            transaction_root: '0x4ea5c426de7f7e4a5de1f44cdeff322dfa4db686b0cf70c5886dfaeb9db5fff8',
            state_root: '0xc804fc6db16e837091949e5c72cb06a5eb326f7699afa1ee9a17bd622b611990',
            receipts_root: '0x44e24fda2b4682866b09b244c871ea03f2c4d1961a5f66a99f5a1d3df7176b73',
            miner: '0x70bb1fb41c8c42f6ddd53a708e2b82209495e455',
            difficulty: '7',
            extra_data: 'Bytes([216, 131, 2, 3, 0, 132, 103, 101, 116, 104, 136, 103, 111, 49, 46, 49, 53, 46, 53, 133, 108, 105, 110, 117, 120, 0, 0, 0, 0, 0, 0, 0, 38, 11, 29, 185, 201, 145, 104, 138, 123, 27, 14, 56, 4, 254, 76, 104, 224, 236, 113, 35, 31, 226, 207, 247, 119, 83, 27, 88, 51, 197, 201, 158, 15, 141, 167, 196, 21, 181, 240, 47, 112, 70, 14, 122, 154, 0, 57, 18, 16, 211, 116, 164, 108, 152, 44, 185, 126, 80, 204, 117, 150, 225, 52, 85, 0])',
            size: 10165,
            gas_limit: '100000000',
            gas_used: '4211050',
            timestamp: 1642800364,
            transactions: 31,
            confirmed: false,
            published: 1642800364414029600
            },
            {
            number: 10405228,
            hash: '0xc09587c536c71f3a6c0c8eea0ccffea5870d644a44cc1af9604cdc1774671e9d',
            parent_hash: '0x71f156c65aa4e2c04efefb641c4a2f0e2a07efafcd16eaca79f74d8407d28d2a',
            nonce: '0x0',
            transaction_root: '0x20b0d8e506da3ff8bc71e273d1bf997701ecde2977c4c8af3241c925339fb6dc',
            state_root: '0x7498b816ecda29c3f36e53d5d818a48a7f099b4f496d379f1f365d1da3a7dba7',
            receipts_root: '0x9c61f9e2f726248b393e762762635afcbafd76d3c88df09c2e7f6c75c094c3dc',
            miner: '0x11360eacdedd59bc433afad4fc8f0417d1fbebab',
            difficulty: '7',
            extra_data: 'Bytes([216, 131, 2, 3, 0, 132, 103, 101, 116, 104, 136, 103, 111, 49, 46, 49, 53, 46, 53, 133, 108, 105, 110, 117, 120, 0, 0, 0, 0, 0, 0, 0, 84, 206, 148, 254, 133, 146, 61, 101, 1, 88, 170, 208, 193, 118, 200, 220, 72, 0, 178, 40, 70, 250, 49, 44, 67, 221, 166, 232, 181, 111, 126, 176, 49, 99, 244, 45, 249, 210, 104, 203, 10, 46, 148, 90, 228, 42, 13, 81, 109, 192, 3, 18, 38, 179, 137, 73, 89, 148, 223, 104, 23, 5, 197, 148, 1])',
            size: 26398,
            gas_limit: '100000000',
            gas_used: '11372397',
            timestamp: 1642800361,
            transactions: 87,
            confirmed: false,
            published: 1642800362051681000
            }
        ]
    }
   */
  let url = `https://explorer.roninchain.com/api/blocks?size=${size}`;
  try {
    let data = await axios.get(url);
    return data.data;
  } catch (e) {
    return e;
  }
}

async function explorerGetLatestTransactions(size = 10) {
  /**
   * Returns latest transactions as well as total amount of transactions
   * @param {Number} size - Number of transactions to return
   * @since      1/21/2022
   * @return {Object} Returns transactions or exception.
   * Sample response:
   {
        total: 285008384,
        results: [
            {
            hash: '0x45d8210de98b273aab255c669e44c958965a638fd75d3dd8ea720cb77b9bef17',
            block_hash: '0x195556f82dc7d70228c6be838370389a62c78db3aeb411c2aadf5b34e4761587',
            block_number: 10405201,
            from: '0xb65143798a62de9c642035ac57f1d4963bb56eca',
            to: '0x32950db2a7164ae833121501c797d79e7b79d74c',
            gas: '487659',
            gas_price: '0',
            input: '0x8264f2c20000000000000000000000000000000000000000000000000000000000a5e5c90000000000000000000000000000000000000000000000000000000000a15cee',
            nonce: 93,
            tx_index: 6,
            value: '0',
            timestamp: 1642800280,
            gas_used: '431230',
            cumulative_gas_used: '777713',
            contract_address: null,
            status: 1,
            confirmed: false,
            published: 1642800280449960400
            },
            {
            hash: '0x222fd31b51f25ac933050150ff77d2c11215190e08f506343cf3e65ab77d4a1f',
            block_hash: '0x7263acfd8f3316269618ec483383e6aac028be1af14f17223d3ce109dba35778',
            block_number: 10405200,
            from: '0x0e40db8a3b3753e00eb4ecf3037830c47cdb5724',
            to: '0x32950db2a7164ae833121501c797d79e7b79d74c',
            gas: '320451',
            gas_price: '1000000000',
            input: '0xef509b6b000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000a5f74b0000000000000000000000000000000000000000000000000000000000a5f75b0000000000000000000000000000000000000000000000000000000000000002649e5c390d99f1d2c89bdb5010f8f615dcc796455bc5edeaaf2665779af038a4746ab4e45210016fe106f16d1df8547fb244f21c193fa422d913a804d9231a37',
            nonce: 660692,
            tx_index: 42,
            value: '0',
            timestamp: 1642800277,
            gas_used: '195876',
            cumulative_gas_used: '5871544',
            contract_address: null,
            status: 1,
            confirmed: false,
            published: 1642800277801683500
            }
        ]
    }
   */
  let url = `https://explorer.roninchain.com/api/txs?size=${size}`;
  try {
    let data = await axios.get(url);
    return data.data;
  } catch (e) {
    return e;
  }
}

async function explorerGet14DayTransactionVolumes() {
  /**
   * Returns transaction volumes for the last 14 days on the Ronin Chain
   * @since      1/21/2022
   * @return {Object} Returns transaction volumes or exception.
   * Sample response:
   {
    overviewData: {
        blockTime: 3,
        totalAddresses: 9612835,
        totalBlocks: 10405131,
        totalTxs: 285006903
    },
    txChartData: {
        txCount: [
        1013023,  898903,  780884,
        800291,  932133,  843717,
        811878,  816803,  866738,
        1105586, 1235726, 1176264,
        1022480, 1046154, 1319591
        ],
        label: [
        '06 Jan', '',       '',
        '',       '',       '',
        '',       '13 Jan', '',
        '',       '',       '',
        '',       '',       '20 Jan'
        ]
    }
   }
   */
  let url = `https://explorer.roninchain.com/_next/data/MP4ApQgQgIMen7_H0KnjR/index.json`;
  try {
    let data = await axios.get(url);
    return data.data?.pageProps;
  } catch (e) {
    return e;
  }
}

async function explorerGetERC20Tokens() {
  /**
   * Returns all ERC20 tokens
   * @since      1/21/2022
   * @return {Object} Returns all ERC20 token data or exception.
   * Sample response:
   [
    {
      address: '0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5',
      transfers: 40036882,
      holders: 866882,
      symbol: 'WETH',
      name: 'Ronin Wrapped Ether',
      decimals: 18,
      tokenType: 'ERC20',
      totalSupply: '343486206907896403930354',
      atBlock: 777
    },
    {
      address: '0x97a9107c1793bc407d6f527b77e7fff4d812bece',
      transfers: 22825350,
      holders: 132465,
      symbol: 'AXS',
      name: 'Axie Infinity Shard',
      decimals: 18,
      tokenType: 'ERC20',
      totalSupply: '52433252920007334630500782',
      atBlock: 2670084
    }
   ]
   */
  let url = `https://explorer.roninchain.com/_next/data/MP4ApQgQgIMen7_H0KnjR/tokens.json`;
  try {
    let data = await axios.get(url);
    return data.data?.pageProps?.tokens?.results;
  } catch (e) {
    return e;
  }
}

async function explorerGetERC20Transfers() {
  /**
   * Returns last ERC20 transfers
   * @since      1/21/2022
   * @return {Object} Returns last 25 ERC20 transfers or exception.
   * Sample response:
   * 
   [
    {
      from: '0xa7964991f339668107e2b6a6f6b8e8b74aa9d017',
      to: '0x097faa854b87fdebb538f1892760ea1b4f31fa41',
      value: '1000000',
      timestamp: 1642799698,
      logIndex: '20',
      txHash: '0xcd29c1f16f98a3c2584ce25a84943faf91767933a9f53895c993e2db2a9f13b5',
      blockNumber: 10405007,
      tokenAddress: '0x0b7007c13325c48911f73a2dad5fa5dcbf808adc',
      tokenDecimals: 6,
      tokenName: 'USD Coin',
      tokenSymbol: 'USDC',
      tokenType: 'ERC20'
    },
    {
      from: '0x0000000000000000000000000000000000000000',
      to: '0xd24e851f3b1fa390d865f0f2a9d3f2d738487001',
      value: '1249',
      timestamp: 1642799698,
      logIndex: '61',
      txHash: '0xc6f611bf38f3fdf42fa57a75478ca7f574b8fc6c65ae245fc87d9fc142e4f01b',
      blockNumber: 10405007,
      tokenAddress: '0xa8754b9fa15fc18bb59458815510e40a12cd2014',
      tokenDecimals: 0,
      tokenName: 'Smooth Love Potion',
      tokenSymbol: 'SLP',
      tokenType: 'ERC20'
    }
  ]
   */
  let url = `https://explorer.roninchain.com/_next/data/MP4ApQgQgIMen7_H0KnjR/tokentxns.json`;
  try {
    let data = await axios.get(url);
    return data.data?.pageProps?.transfers;
  } catch (e) {
    return e;
  }
}

async function explorerGetERC721Tokens() {
  /**
   * Returns all ERC721 tokens
   * @since      1/21/2022
   * @return {Object} Returns all ERC721 token data or exception.
   * Sample response:
   [
    {
      address: '0x8c811e3c958e190f5ec15fb376533a3398620500',
      transfers: 32333,
      holders: 2716,
      symbol: 'LAND',
      name: 'Axie Land',
      decimals: 0,
      tokenType: 'ERC721',
      totalSupply: '16780',
      atBlock: 199149
    },
    {
      address: '0xa96660f0e4a3e9bc7388925d245a6d4d79e21259',
      transfers: 302291,
      holders: 5021,
      symbol: 'ITEM',
      name: 'Axie Land Item',
      decimals: 0,
      tokenType: 'ERC721',
      totalSupply: '233119',
      atBlock: 199865
    },
    {
      address: '0x32950db2a7164ae833121501c797d79e7b79d74c',
      transfers: 95897046,
      holders: 2968162,
      symbol: 'AXIE',
      name: 'Axie',
      decimals: 0,
      tokenType: 'ERC721',
      totalSupply: '10924638',
      atBlock: 2678592
    }
  ]
   */
  let url = `https://explorer.roninchain.com/_next/data/MP4ApQgQgIMen7_H0KnjR/tokens-nft.json`;
  try {
    let data = await axios.get(url);
    return data.data?.pageProps?.tokens?.results;
  } catch (e) {
    return e;
  }
}

async function explorerGetERC721Transfers() {
  /**
   * Returns latest ERC721 transfers
   * @since      1/21/2022
   * @return {Object} Returns transfers data or exception.
   * Sample response:
   * [
    {
      from: '0xd02288ee9440058dd14457e814ed0e2db5bc66a1',
      to: '0xec79dcbc799a0924648ba3f9b878e4b9565d6329',
      value: '3042003',
      timestamp: 1642799449,
      logIndex: '55',
      txHash: '0x18ce1cb75b007156eb1cb2cdd04b40dda8cd35026eb281d9f52848e07ca3bec1',
      blockNumber: 10404924,
      tokenAddress: '0x32950db2a7164ae833121501c797d79e7b79d74c',
      tokenDecimals: 0,
      tokenName: 'Axie',
      tokenSymbol: 'AXIE',
      tokenType: 'ERC721'
    },
    {
      from: '0xa0c142df2aea4cdc579a4556369a3ba9e74bb56f',
      to: '0xbb3cc0e2e7f92fa2ae881a1b48c2e8751fbe1ad2',
      value: '10556597',
      timestamp: 1642799449,
      logIndex: '56',
      txHash: '0x4f0e99fec27a9e033fb00937c37ae8f47d85a37bc350ae2362ba13ee0aa7cccb',
      blockNumber: 10404924,
      tokenAddress: '0x32950db2a7164ae833121501c797d79e7b79d74c',
      tokenDecimals: 0,
      tokenName: 'Axie',
      tokenSymbol: 'AXIE',
      tokenType: 'ERC721'
    }
   * ]
   */
  let url = `https://explorer.roninchain.com/_next/data/MP4ApQgQgIMen7_H0KnjR/tokentxns-nft.json`;
  try {
    let data = await axios.get(url);
    return data.data?.pageProps?.transfers;
  } catch (e) {
    return e;
  }
}
async function explorerGetTransactionDetails(txHash) {
  /**
   * Returns the transaction details for a given transaction hash.
   * @param {string} txHash - transaction hash
   * @since      1/21/2022
   * @return {Object} Returns transaction data or exception.
   * Sample response:
   * {
        hash: '0x8b7a94b7281326420a54ba3c6ab54f2ef5f0bd527576dfa89bc437a9a5eb9d03',
        from: '0x3ead4ca7305e30169e42437c74e7c81bdab7b9c3',
        to: '0x213073989821f738a7ba3520c3d31a1f9ad31bbd',
        gas: '698575',
        input: '0x4d51bfc4000000000000000000000000f48a09b0af4b51048df65ac575e01d892cf9dabc000000000000000000000000c99a6a985ed2cac1ef41640596c5a5f9f4e19ef500000000000000000000000000000000000000000000000000470de4df8200000000000000000000000000000000000000000000000000000000000000233dc852221010c9d3f6c8e23c2cd53ea75d5e123224892639da2ad4958506260c7c35',
        nonce: 19,
        value: '0',
        timestamp: 1642798195,
        status: 0,
        confirmed: true,
        published: 1642798225073554000,
        logs: [],
        blockHash: '0x817cb7ba293929808731cd1ee48c1c4972d84fc0c6153e6334232ddaf9acfd89',
        blockNumber: 10404506,
        gasPrice: '0',
        txIndex: 2,
        gasUsed: '29847',
        cumulativeGasUsed: '96502',
        contractAddress: null
     }
   */
  let url = `https://explorer.roninchain.com/_next/data/MP4ApQgQgIMen7_H0KnjR/tx/${txHash}.json?txHash=${txHash}`;
  try {
    let data = await axios.get(url);
    return data.data?.pageProps?.transaction;
  } catch (e) {
    return e;
  }
}



async function explorerGetBlockDetails(blockNumber) {
  /**
   * Get block details for a given block number
   * @param {Number} blockNumber Block number to get details for
   * Conversion rates to CNY, EUR, GBP, JPY, KRW, MYR, PHP, SGD, USD, VND
   * @since      1/21/2022
   * @return {Object} Returns block data or exception.
   * Sample response:
   * {
   *   number: 1,
   *   hash: '0x5027d9836eabbd069a3b089f128caf9cf11506cd3849fb3ac43a8e2188b238c2',
   *   nonce: '0x0',
   *   miner: '0xf224beff587362a88d859e899d0d80c080e1e812',
   *   difficulty: '3',
   *   size: 607,
   *   timestamp: 1611571777,
   *   transactions: 0,
   *   confirmed: true,
   *   published: 1638520922470513400,
   *   parentHash: '0x6e675ee97607f4e695188786c3c1853fb1562f1c075629eb5dbcff269422a1a4',
   *   transactionRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
   *   stateRoot: '0xd7f5c1399df288345a17ceb796849dea975dabdf50e8cd4aa7ee8915fb421918',
   *   receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
   *   extraData: 'Bytes([216, 131, 2, 1, 0, 132, 103, 101, 116, 104, 136, 103, 111, 49, 46, 49, 53, 46, 53, 133, 108, 105, 110, 117, 120, 0, 0, 0, 0, 0, 0, 0, 65, 130, 166, 186, 189, 122, 247, 80, 48, 9, 46, 43, 152, 196, 244, 145, 156, 79, 5, 204, 218, 164, 103, 246, 73, 136, 238, 139, 64, 46, 216, 236, 16, 202, 33, 20, 159, 37, 111, 209, 61, 61, 107, 160, 46, 75, 88, 192, 135, 68, 231, 182, 21, 35, 221, 51, 102, 135, 147, 202, 106, 151, 118, 48, 1])',
   *   gasLimit: '2145386497',
   *   gasUsed: '0'
   * }
   */
  let url = `https://explorer.roninchain.com/_next/data/MP4ApQgQgIMen7_H0KnjR/block/${blockNumber}.json?blockID=${blockNumber}`;
  try {
    let data = await axios.get(url);
    return data.data?.pageProps?.block;
  } catch (e) {
    return e;
  }
}

async function exchangeGetRates() {
  /**
   * Get current exchange rates for all supported currencies
   * Conversion rates to CNY, EUR, GBP, JPY, KRW, MYR, PHP, SGD, USD, VND
   * @since      1/21/2022
   * @return {Object} Returns exchange rates or exception.
   */
  let url = "https://exchange-rate.axieinfinity.com/";
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
  explorerGetERCTransfersByRoninAddress,
  explorerGetLatestBlocks,
  explorerGetLatestTransactions,
  explorerGet14DayTransactionVolumes,
  explorerGetERC20Tokens,
  explorerGetERC20Transfers,
  explorerGetERC721Tokens,
  explorerGetERC721Transfers,
  explorerGetTransactionDetails,
  explorerGetBlockDetails,
  exchangeGetRates,
};
