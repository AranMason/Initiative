import React, { useState } from 'react';
import useInitiativeTracker from '../hooks/useInititativeTracker';

const AddItemForm: React.FC = () => {
  const [name, setName] = useState('');
  const [initiative, setInitiative] = useState('');
  const [error, setError] = useState<string>('');

  const { addItem } = useInitiativeTracker();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();

    if (!name || !initiative) {
      setError('Please ener both name and initiative');
    }

    addItem({ name, value: parseInt(initiative) });
    setName('');
    setInitiative('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="layout-flex-row flex-gap-m">
        <input type="text" value={name} placeholder="Name" onChange={e => setName(e.target.value)} />
        <input type="text" value={initiative} placeholder="Initiative" onChange={e => setInitiative(e.target.value)} />
        <button type="submit">Add</button>
      </div>
      {error && <span>{error}</span>}
    </form>
  );
};

export default AddItemForm;
