import React from 'react';
// import './App.scss';
import ItemListener from './components/ItemListener';

const App: React.FC = () => {
  return (
    <ItemListener>
      {data => {
        return <div>{JSON.stringify(data)}</div>;
      }}
    </ItemListener>
  );
};

export default App;
