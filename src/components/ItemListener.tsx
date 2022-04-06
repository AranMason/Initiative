import React, { useEffect, useState } from "react";
import InitiativeItem from "../models/InitiativeItem";

interface ItemListenerProps<T> {
  children: (data: T) => React.ReactNode
}

const ItemListener: React.FC<ItemListenerProps<InitiativeItem[]>> = ({ children }) => {

  const [data, setData] = useState<InitiativeItem[]>([]);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!isListening) {
      const events = new EventSource('/api/initiative');

      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);

        setData(parsedData);
      };

      setIsListening(true);
    }
  }, [isListening, data]);


  return <React.Fragment>{children(data)}</React.Fragment>
}

export default ItemListener