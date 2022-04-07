import React, { useEffect, useState } from 'react';
import InitiativeItem from '../models/InitiativeItem';

const baseURL = 'localhost:3000';

interface ItemListenerProps<T> {
  children: (data: T) => React.ReactNode;
}

const ItemListener: React.FC<ItemListenerProps<InitiativeItem[]>> = ({ children }) => {
  // const [data, setData] = useState<InitiativeItem[]>([]);
  // const [isListening, setIsListening] = useState(false);

  const [facts, setFacts] = useState([]);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!listening) {
      const events = new EventSource('http://localhost:3000/api/initiative/listener');

      events.onmessage = event => {
        console.log(event.data);
        const parsedData = JSON.parse(event.data);

        setFacts(facts => facts.concat(parsedData));
      };

      setListening(true);
    }
  }, [listening, facts]);

  return <React.Fragment>{children(facts)}</React.Fragment>;
};

export default ItemListener;
