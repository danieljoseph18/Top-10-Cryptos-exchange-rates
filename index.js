const coinURL = 'https://api.coinpaprika.com/v1/coins';

const tokenArray = [];
const availableTokens = []; 

async function getCoins(){
    try {
        const response = await fetch(coinURL);
        const coins = await response.json();
        let filtered = await coins.filter(x => x.rank < 11 && x.rank > 0);
        for(let token of filtered){
            tokenArray.push(token.symbol);
        }
        let mapped =  await filtered.map(x => x=`<li>${x.symbol}</li>`);
        document.querySelector('.top-list').innerHTML = mapped.join('');
    } catch(e){
        console.log(e);
    }
    return
}


const tokenURL = "https://api.1inch.exchange/v3.0/1/tokens";

async function oneInch(){
    try {
        const response = await fetch(tokenURL);
        const tokens = await response.json();
        const tokenList = await Object.values(tokens.tokens);
        //only 5 return values as only querying the ethereum network
        let filtered =  tokenList.filter(x => tokenArray.includes(x.symbol));

        for(let token of filtered){
            availableTokens.push(token.symbol);
        }

        console.log('done');
        return filtered;
        
    } catch(e){
        console.log(e);
    }

}


async function makeList(tokens){
    let tokenList = await tokens;
    let mappedList = tokenList.map(token => `<option value=${token.decimals}-${token.address}>${token.symbol}</option>`)
    document.querySelector('#convert-from').innerHTML = mappedList.join('');
    document.querySelector('#convert-to').innerHTML = mappedList.join('');
    return "success!"
        
}

document.querySelector('.query-button').addEventListener('click', submitted);


async function submitted(event){
    event.preventDefault();
    const fromToken = document.querySelector('#convert-from').value;
    const toToken = document.querySelector('#convert-to').value;
    const [fromDecimals, fromAddress] = fromToken.split('-');
    const [toDecimals, toAddress] = toToken.split('-');
    const units = 10**fromDecimals;
    const decimalDifference= fromDecimals - toDecimals;
    
    
    const url = `https://api.1inch.io/v4.0/1/quote?fromTokenAddress=${fromAddress}&toTokenAddress=${toAddress}&amount=${units}`;
    console.log(url);
    let response = await fetch(url);
    let quote = await response.json();
    const from = await quote.fromToken.symbol;
    const to = await quote.toToken.symbol; 
    const exchange_rate = await (Number(quote.toTokenAmount)/Number(quote.fromTokenAmount));
    document.querySelector('.result-paragraph').innerText =
    `1 ${from} = ${exchange_rate*(10**decimalDifference)} ${to}`;
    return;


}


getCoins()
    .then(oneInch)
    .then(makeList)
