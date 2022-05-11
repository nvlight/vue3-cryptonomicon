const API_KEY = 
    '7abb9ee11e6038ff6ed2b1ca693dbf8274ede39afdb0fdf67e2593c18615f3f4';

const tickersHandler = new Map(); // {}

// TODO: refactor to use URLSearchParams
const loadtickersHandler = () => {
    //debugger; 
    if (tickersHandler.size === 0){
        return; 
    }

    fetch(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${
        [...tickersHandler.keys()
        ].join(
        ','
        )}&tsyms=USD&api_key=${API_KEY}`
    )
        .then(r => r.json())
        .then(rawData => {
            const updatedPrices = Object.fromEntries(
                Object.entries(rawData).map( ([key, value]) => [key, value.USD] )
            );

            Object.entries(updatedPrices).forEach( ([currency, newPrice]) => {
                const handlers = tickersHandler.get(currency) ?? [];
                handlers.forEach(fn => fn(newPrice));
            });
        });
}

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandler.get(ticker) || [];
    tickersHandler.set(ticker, [...subscribers, cb]); 
}

export const unsubscribeToTicker = ticker => {
    tickersHandler.delete(ticker); 
}

setInterval(loadtickersHandler, 3000);

window.tickersHandler = tickersHandler; 