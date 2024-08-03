import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/index';
import { fetchStockData, setSymbol, setShowModal, selectStock } from '../store/stockSlice';
import io from 'socket.io-client';

const socket = io('http://localhost:7000');


export default function Home() {
  
  const dispatch = useDispatch<AppDispatch>();
  const { symbol, data, loading, error, showModal } = useSelector((state: RootState) => state.stock);

  useEffect(() => {
    dispatch(fetchStockData(symbol));
    socket.on('newData', () => {
      dispatch(fetchStockData(symbol));
    });
    return () => {
      socket.off('newData');
    };
  }, [symbol, dispatch]);

  const handleSymbolChange = (newSymbol: string) => {
    dispatch(setSymbol(newSymbol));
    dispatch(setShowModal(false));
  };
  function formatLargeNumber(num:number) {
    if (num >= 1e12) {
      return (num / 1e12).toFixed(3) + ' Trillion';
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(3) + ' Billion';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(3) + ' Million';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(4)
    } else {
      return num.toFixed(2);
    }
  }
 
  return (
    <div style={{backgroundColor:"#171b26", color:"white"}}>
      <div>
    <h1 style={{textAlign:"center",}}>Real-time Stock/Crypto Data {symbol}</h1>

      </div>
    <button onClick={() => dispatch(setShowModal(true))} style={{padding:"10px",marginBottom:"50px"}}>Change Symbol  </button>
    {loading ? (
        <p>Loading...</p>
    ) : error ? (
        <p>{error}</p>
    ) : (
        <table style={{ border: "1px solid #47c2be", width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{backgroundColor:"#293143"}}>
            <tr>
              <th style={{ border: "1px solid #47c2be", padding: "8px", textAlign: "left" }}>Symbol</th>
              <th style={{ border: "1px solid #47c2be", padding: "8px", textAlign: "left" }}>Markets</th>
              <th style={{ border: "1px solid #47c2be", padding: "8px", textAlign: "left" }}>AllTimeHighUSD</th>
              <th style={{ border: "1px solid #47c2be", padding: "8px", textAlign: "left" }}>TotalSupply</th>
              <th style={{ border: "1px solid #47c2be", padding: "8px", textAlign: "left" }}>Rate</th>
              <th style={{ border: "1px solid #47c2be", padding: "8px", textAlign: "left" }}>Volume</th>
              <th style={{ border: "1px solid #47c2be", padding: "8px", textAlign: "left" }}>Cap</th>
              <th style={{ border: "1px solid #47c2be", padding: "8px", textAlign: "left" }}>Liquidity</th>
              <th style={{ border: "1px solid #47c2be", padding: "8px", textAlign: "left" }}>1H</th>
              <th style={{ border: "1px solid #47c2be", padding: "8px", textAlign: "left" }}>24H</th>
              <th style={{ border: "1px solid #47c2be", padding: "8px", textAlign: "left" }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((entry) => (
              <tr key={entry._id}>
                <td style={{ border: "1px solid #47c2be", padding: "8px", textAlign: "left" }}>
                <a href={entry.links.website} target="_blank" style={{ color: 'white', textDecoration: 'none' }}>
                    <img src={entry.image} alt={entry.symbol} style={{ width: '20px', marginRight: '8px' }} />
                    {entry.symbol}
                  </a>
                </td>
                <td style={{ border: "1px solid #47c2be", padding: "8px", textAlign: "left" }}>{entry.markets}</td>
                <td style={{ border: "1px solid #47c2be", padding: "8px", textAlign: "left" }}>${formatLargeNumber(entry.allTimeHighUSD)}</td>
                <td style={{ border: "1px solid #47c2be", padding: "8px", textAlign: "left" }}>{entry.totalSupply}</td>
                <td style={{ border: "1px solid #47c2be", padding: "8px", textAlign: "left" }}>{entry.rate}</td>
                <td style={{ border: "1px solid #47c2be", padding: "8px", textAlign: "left" }}>${formatLargeNumber(entry.volume)}</td>
                <td style={{ border: "1px solid #47c2be", padding: "8px", textAlign: "left" }}>${formatLargeNumber(entry.cap)}</td>
                <td style={{ border: "1px solid #47c2be", padding: "8px", textAlign: "left" }}>${formatLargeNumber(entry.liquidity)}</td>
                <td style={{ border: "1px solid #47c2be", padding: "8px", textAlign: "left" }}>{entry.delta.hour}</td>
                <td style={{ border: "1px solid #47c2be", padding: "8px", textAlign: "left" }}>{entry.delta.day}</td>
                <td style={{ border: "1px solid #47c2be", padding: "8px", textAlign: "left" }}>{new Date(entry.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
    )}
    {showModal && (
        <div className="modal">
            <div className="modal-content">
                <h2>Select Symbol</h2>
                <button onClick={() => handleSymbolChange('ADA')}>ADA</button>
                <button onClick={() => handleSymbolChange('XRP')}>XRP</button>
                <button onClick={() => handleSymbolChange('BTC')}>BTC</button>
                <button onClick={() => handleSymbolChange('ETH')}>ETH</button>
                <button onClick={() => dispatch(setShowModal(false))}>Close</button>
            </div>
        </div>
    )}
</div>
  );
}
