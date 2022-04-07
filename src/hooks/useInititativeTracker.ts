
const baseURL = "http://localhost:3000";

type AddItemData = {
  name: string,
  value: number,
  isPlayer?: boolean
}

interface InitiativeTrackerControls {
  addItem: (data: AddItemData) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  nextTurn: () => Promise<void>;
}
const useInitiativeTracker = (): InitiativeTrackerControls => {

  const addItem = async ({name, value}: AddItemData) => {
    if (!name || !value) return;

    await  fetch(`${baseURL}/api/initiative/item`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        value,
      }),
    });
  }

  const removeItem = async (id: string) => {
    if (!id) return;

    await  fetch(`${baseURL}/api/initiative/item`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id
      }),
    });
  }

  const nextTurn = async () => {
    await fetch(`${baseURL}/api/initiative/next`, {
      method: "PATCH"
    })
  }

  return {
    addItem,
    removeItem,
    nextTurn
  }

}

export default useInitiativeTracker;