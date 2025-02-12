# MuralPay

A Next.js application for managing transfer requests and accounts. This application allows users to create accounts and manage transfer requests integrating with mural pay api and limited to Colombian transactions for now.

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

1. **Colombian Address Handling**:
   - The API requieres a second address for Colombian addresses

2. **Phone Number Format**:
   - A Colombian phone numbers must be used for the requests

3. **Transfer Request Filtering**:
   - Currently, transfer request filtering is implemented on the frontend
   - This is due to API limitations in the provided endpoints, filtering by account is not available

4. **Transfer Request Display**:
   - The transfer requests table shows the "From" field
   - "To" field information is not available in the list endpoint response
   - If the API ends up providing more info we could make more descriptive rows

5. **Account Deletion**:
   - The API doesnt allow to delete accounts, for these reason when testing the dashboard may get over populated with accounts. 
   - To prevent this I implement a show more concept for the cards in the dashboard and ordering them with the last updated at the top. 

## Possible future Improvements

1. **Enhanced API Integration**:
   - Integration with recipient information in transfer request listings
   - Expanded transaction details in API responses

2. **User Experience**:
   - Add bulk transfer request operations
   - Implement real-time status updates using WebSocket
   - Enhanced transaction history visualization
   - Export functionality for transfer requests
   - Posibility to see the details of a transfer request

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
