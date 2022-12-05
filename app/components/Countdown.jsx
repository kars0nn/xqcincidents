import React, { useState, useEffect } from 'react';

export function Countdown({dateString}) {
  // Create state variables for the years, days, hours, minutes, and seconds
  const [years, setYears] = useState(0);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [second, setSeconds] = useState(0);

  // Create a function to calculate the time difference between the input date and the current date
  function calculateTimeDifference(date) {
    // Get the current date and time
    const now = new Date();

    // Calculate the time difference between the input date and the current date
    const timeDifference = now - date;

    // Convert the time difference to seconds
    const seconds = Math.floor(timeDifference / 1000);

    // Calculate the number of years, days, hours, minutes, and seconds in the time difference
    const years = Math.floor(seconds / 31536000);
    const days = Math.floor((seconds % 31536000) / 86400);
    const hours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    const minutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    const second = Math.floor((((seconds % 31536000) % 86400) % 3600) % 60);

    // Set the state variables for the years, days, hours, minutes, and seconds
    setYears(years);
    setDays(days);
    setHours(hours);
    setMinutes(minutes);
    setSeconds(second);
  }

  // Use the useEffect hook to calculate the time difference when the component is first rendered
  useEffect(() => {
    // Create a new date object from the input date string
    const date = new Date(dateString);

    // Calculate the time difference
    calculateTimeDifference(date);
  }, []);

  // Use the useEffect hook to calculate the time difference every second
  useEffect(() => {
    // Create a new date object from the input date string
    const date = new Date(dateString);

    // Set a timeout to calculate the time difference every second
    const timeout = setTimeout(() => {
      calculateTimeDifference(date);
    }, 1000);

    // Clear the timeout when the component is unmounted
    return () => clearTimeout(timeout);
  });

  // Format the output string
  //${years.toString().padStart(2, '0')}y 
  const countdown = `${days.toString().padStart(2, '0')}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${second.toString().padStart(2, '0')}s`;

  // Return the formatted countdown string
    return <p>{countdown}</p>;
}