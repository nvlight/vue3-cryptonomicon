const API_KEY = 
    '7abb9ee11e6038ff6ed2b1ca693dbf8274ede39afdb0fdf67e2593c18615f3f4';

// TODO: refactor to use URLSearchParams
export const loadTickers = tickers =>  
fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickers.join(
    ',')}&tsyms=USD&api_key=${API_KEY}`
)
.then(r => r.json())
.then(rawData => 
    Object.fromEntries(
        Object.entries(rawData).map( ([key, value]) => [key, value.USD] )
    )    
);
