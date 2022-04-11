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
    const [hasError, setHasError] = useState(false);
    const [isListening, setListening] = useState(false);

    useEffect(() => {
        if (!isListening) {
            const events = new EventSource('/api/initiative/listener');

            events.onmessage = event => {
                const parsedData = JSON.parse(event.data);
                setHasError(false);
                setData(parsedData);
            };

            events.onerror = () => {
                setHasError(true);
            };

            events.onopen = () => {
                setHasError(false);
            };

            setListening(true);
        }
    }, [isListening, data]);

    return (
        <React.Fragment>
            {hasError && <div>An error has occured</div>}
            {children(data)}
        </React.Fragment>
    );
};

export default ItemListener;
