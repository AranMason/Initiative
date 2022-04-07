
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
  sort: () => Promise<void>;
  clear: () => Promise<void>;
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


  const sort = async () => {
    await fetch(`${baseURL}/api/initiative/sort`, {
      method: "post"
    })
  }

  const clear = async () => {
    await fetch(`${baseURL}/api/initiative/clear`, {
      method: "DELETE"
    })
  }

  return {
    addItem,
    removeItem,
    nextTurn,
    sort,
    clear
  }

}

export default useInitiativeTracker;