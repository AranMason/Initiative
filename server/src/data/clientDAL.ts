interface Client {
    id: string;
    response: any;
}

let clients: Client[] = [];

export const addClient = (client: Client) => {
    const existingClientIndex = clients.findIndex(s => s.id === client.id);
    if (existingClientIndex < 0) {
        clients.push(client);
    } else {
        clients[existingClientIndex] = client;
    }
};

export const createToClients = (fn: (client: Client) => object) => {
    clients.forEach(client => fn(client));
};
