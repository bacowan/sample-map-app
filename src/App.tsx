import { useState, useEffect } from 'react';
import Map from './components/map';
import PoiList from './components/poiList';
import Title from './components/title'
import './App.css';
import { getPois } from './utils';
import Poi from './types/poi';
import PoiTag from './types/poiTag';
import MapErrorBoundary from './components/mapErrorBoundary';
import WarningMessage from './components/warningMessage';

function App() {
  const [data, setData] = useState<Poi[]>([]);
  const [selectedPoiIndex, setSelectedPoiIndex] = useState<number | null>(null);
  const [hasWarning, setHasWarning] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        setData(await getPois());
      }
      catch {
        setHasWarning(true);
      }
    }
    getData();
  }, []);

  return (
    <div className="App">
      <Title header="Cycling trip across Japan" body="A list of waypoints that I'd like to visit on a cycling trip across Japan."/>
      <MapErrorBoundary>
        <Map pois={data} selectedPoiIndex={selectedPoiIndex}/>
      </MapErrorBoundary>
      <PoiList pois={data} selectedPoiIndex={selectedPoiIndex} setSelectedPoiIndex={setSelectedPoiIndex}/>
      { hasWarning && <WarningMessage message="A problem was encountered when loading the data!"/> }
    </div>
  );
}

export default App;
