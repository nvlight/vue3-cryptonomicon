const API_KEY = 
    '7abb9ee11e6038ff6ed2b1ca693dbf8274ede39afdb0fdf67e2593c18615f3f4';

const tickersHandler = new Map(); // {}
const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`);

const AGGREGATE_INDEX = "5"; 

socket.addEventListener('message', e => {
    const {TYPE: type, FROMSYMBOL: currency, PRICE: newPrice} = JSON.parse(e.data);    
    //console.log(messageContent); 
    if (type !== AGGREGATE_INDEX || newPrice === undefined){
        return;
    } 
    const handlers = tickersHandler.get(currency) ?? [];
    handlers.forEach(fn => fn(newPrice));
}); 

function sendToWebSocket(message){
    const stringifyMessage = JSON.stringify(message);  

    if (socket.readyState === WebSocket.OPEN){
        socket.send(stringifyMessage);
        return; 
    }   
    
    socket.addEventListener('open', () => {
        socket.send(stringifyMessage);
    }, { once: true });    
}

function subscribeToTickerOnWs(ticker){          
    sendToWebSocket({
        "action": "SubAdd",
         "subs": [`5~CCCAGG~${ticker}~USD`] 
     });
}

function unsubscribeToTickerOnWs(ticker){          
    sendToWebSocket({
        "action": "SubRemove",
         "subs": [`5~CCCAGG~${ticker}~USD`] 
     });
}

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandler.get(ticker) || [];
    tickersHandler.set(ticker, [...subscribers, cb]); 
    subscribeToTickerOnWs(ticker);
}

export const unsubscribeToTicker = ticker => {
    tickersHandler.delete(ticker); 
    unsubscribeToTickerOnWs(ticker);
}

//window.tickersHandler = tickersHandler; 