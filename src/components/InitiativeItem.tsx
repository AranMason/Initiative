import React from 'react';

interface InitiativeItemProps {
  name: string;
  initiative: number;
  onDelete: () => Promise<void>;
  isCurrentTurn?: boolean;
}

const InitiativeItem: React.FC<InitiativeItemProps> = ({ name, initiative, onDelete, isCurrentTurn }) => {
  return (
    <div className="initiative-item-container layout-flex-row">
      <div className="layout-flex-row initiative-item padding-ml">
        <h3 className="margin-zero space-auto">{name}</h3>
        <span className="space-pre-auto space-l">{initiative}</span>
        <button type="button" onClick={onDelete}>
          X
        </button>
      </div>
    </div>
  );
};

export default InitiativeItem;
