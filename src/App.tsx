import { useState, useEffect } from 'react';
import Map from './components/map';
import PoiList from './components/poiList';
import { getPois } from './data';
import './App.css';
import Poi from './types/poi';

function App() {
  const [data, _] = useState(getPois());

  return (
    <div className="App">
      <Map pois={data}/>
      <PoiList pois={data}/>
    </div>
  );
}

export default App;
