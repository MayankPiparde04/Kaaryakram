"use client"

import React from "react";

// This is just a placeholder component
// In a real app, you would integrate with a maps library
export default function MapComponent({ deliveryLocations = [] }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/30">
      <p className="text-muted-foreground">Map Component</p>
    </div>
  );
}
