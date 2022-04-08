import React, { useEffect, useState } from 'react';
import InitiativeItem from '../models/InitiativeItem';

interface APIDataModel {
    current?: string;
    track: InitiativeItem[];
}

interface ItemListenerProps<T> {
    children: (data: T) => React.ReactNode;
}

const ItemListener: React.FC<ItemListenerProps<APIDataModel>> = ({ children }) => {
    const [data, setData] = useState<APIDataModel>({
        track: [],
    });
    const [isListening, setListening] = useState(false);

    useEffect(() => {
        if (!isListening) {
            const events = new EventSource('/api/initiative/listener');

            events.onmessage = event => {
                const parsedData = JSON.parse(event.data);

                setData(parsedData);
            };

            setListening(true);
        }
    }, [isListening, data]);

    return <React.Fragment>{children(data)}</React.Fragment>;
};

export default ItemListener;
