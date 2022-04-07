import React, { useState } from 'react';
import useInitiativeTracker from '../hooks/useInititativeTracker';

const AddItemForm: React.FC = () => {
  const [name, setName] = useState('');
  const [initiative, setInitiative] = useState('');

  const { addItem } = useInitiativeTracker();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();

    if (!name || !initiative) return;

    addItem({ name, value: parseInt(initiative) });
    setName('');
    setInitiative('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <input type="text" value={initiative} onChange={e => setInitiative(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
};

export default AddItemForm;
