"use client";

import StockSearchSection from "../sections/searchbar";

export default function SearchPage() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '20px' }}>Search for Stock</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
        <div style={{
          width: '400px',
          padding: '20px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          backgroundColor: '#191919',
        }}>
          <StockSearchSection placeholder="Enter stock name or symbol" />
        </div>
      </div>
    </div>
  );
}
