import React from 'react';

/**
 * Buggy Time Display: Causes SSR Hydration Mismatch
 */
export function AppointmentCard({ appointmentDateUtc }) {
  // BUG: Executes on server in UTC, then executes on client in local user timezone!
  const formattedTime = new Date(appointmentDateUtc).toLocaleTimeString();

  return (
    <div className="card">
      <h3>Doctor Consultation</h3>
      <p>Time: {formattedTime}</p>
    </div>
  );
}

function solution(input) {
  return "hydration_stabilized";
}