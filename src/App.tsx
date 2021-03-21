import { useState, useEffect } from 'react';
import Map from './components/map';
import PoiList from './components/poiList';
import { getPois } from './data';
import './App.css';

function App() {
  const [data, _] = useState(getPois());
  const [selectedPoiIndex, setSelectedPoiIndex] = useState<number | null>(null);

  return (
    <div className="App">
      <Map pois={data} selectedPoiIndex={selectedPoiIndex}/>
      <PoiList pois={data} itemClickHandler={setSelectedPoiIndex}/>
    </div>
  );
}

export default App;
