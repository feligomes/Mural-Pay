# MuralPay

A Next.js application for managing transfer requests and accounts. This application allows users to create accounts and manage transfer requests through the Mural Pay API. Currently supports Colombian banks and transactions.

🌐 **Live Demo**: [https://mural-pay.vercel.app/](https://mural-pay.vercel.app/)

## Features

- Account management
- Dynamic form validations
- Transfer request creation and management
- Different levels of filters for transfer requests
- Responsive design of all the pages
- Modern UI with a focus on user experience

## Technologies Used

- **Frontend Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Shadcn/ui
- **API Integration**: RTK Query
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mural-pay
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add required environment variables:
```env
NEXT_PUBLIC_API_URL=your_api_url_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Important Notes

1. **Colombian Address Format**:
   - The API requires a secondary address line

2. **Phone Number Format**:
   - Colombian phone numbers are required for all requests

3. **Transfer Request Filtering**:
   - Transfer request filtering is currently implemented client-side because the API does not support filtering by account

4. **Transfer Request Display**:
   - The transfer requests table displays a "From" field showing the account name
   - The "To" field is currently unavailable as this information is not provided by the API endpoint. This may be added in future updates to improve transfer request clarity.

5. **Account Management**:
   - The API does not support account deletion
   - To manage dashboard clutter, accounts are displayed using a "Show More" pagination system
   - Accounts are sorted by last update date, with most recent updates appearing first

## Potential Future Improvements

1. **Enhanced API Integration**:
   - Include recipient information in transfer request listings
   - Expand transaction details in API responses

2. **User Experience**:
   - Implement bulk transfer request operations
   - Add real-time status updates using WebSocket
   - Enhance transaction history visualization
   - Add export functionality for transfer requests
   - Enable detailed view of transfer requests

3. **Internationalization**:
   - Support for multiple countries beyond Colombia
   - Multi-language support
   - Dynamic currency conversion

4. **Advanced Features**:
   - Scheduled transfers
   - Recurring transfer requests
   - Transfer request templates
   - Advanced analytics and reporting

## Development

The project follows a modular structure:
- `/src/app` - Next.js pages and routing
- `/src/components` - Reusable UI components
- `/src/lib` - Utilities, configurations, and schemas
- `/src/hooks` - Custom React hooks
- `/src/store` - Redux store and API configurations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
