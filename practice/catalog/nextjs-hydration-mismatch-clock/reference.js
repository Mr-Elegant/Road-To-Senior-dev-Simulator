import React, { useState, useEffect } from 'react';

export function AppointmentCard({ appointmentDateUtc }) {
  const [localTime, setLocalTime] = useState(null);

  useEffect(() => {
    // Runs only on client after successful hydration
    setLocalTime(new Date(appointmentDateUtc).toLocaleTimeString());
  }, [appointmentDateUtc]);

  return (
    <div className="card">
      <h3>Doctor Consultation</h3>
      <p>
        Time:{' '}
        {localTime ? (
          <span>{localTime}</span>
        ) : (
          <span className="opacity-75">{new Date(appointmentDateUtc).toISOString().slice(11, 16)} UTC</span>
        )}
      </p>
    </div>
  );
}
