# eVoucher Generator

A web application to generate eVouchers using GraphQL API and export them to CSV.

## Features

- Generate multiple eVouchers with specified currency
- Export voucher data to CSV file
- Simple web interface

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd generate-eVoucher
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Build the TypeScript code:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm start
   ```

   Or run both build and start in one command:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Select the currency from the dropdown (USD, EUR, GBP)
2. Enter the number of vouchers to generate (1-100)
3. Click "Generate Vouchers"
4. The CSV file will be created in the project root directory

## API

The application uses the Eurostar Payment Gateway GraphQL API to create vouchers.

## Technologies Used

- Node.js
- Express
- TypeScript
- GraphQL Request
- CSV Writer
