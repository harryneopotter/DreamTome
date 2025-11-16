import { Dream } from '../types';
import FlippableDreamCard from './FlippableDreamCard';
import { useState } from 'react';
import DreamModal from './DreamModal';

interface DreamCardProps {
  dream: Dream;
}

export default function DreamCard({ dream }: DreamCardProps) {
  const [showModal, setShowModal] = useState(false);

  const handleExpand = () => {
    setShowModal(true);
  };

  return (
    <>
      <FlippableDreamCard
        dream={dream}
        onExpand={handleExpand}
      />

      {showModal && <DreamModal dream={dream} onClose={() => setShowModal(false)} />}
    </>
  );
}
