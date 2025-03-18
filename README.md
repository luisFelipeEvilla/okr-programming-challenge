# Contact Management System

A modern web application built with Next.js 14 for managing contacts, featuring import/export capabilities and task management.

![image](https://github.com/user-attachments/assets/a51667d8-6561-474f-8f6a-3d1b5dac9843)
![image](https://github.com/user-attachments/assets/2abfa11e-04fe-4d9a-85a3-e64bd99160d3)

## Features

### Contact Management
- View and manage contacts in a paginated table
- Add new contacts through CSV import
- Export contacts to CSV format
- View detailed contact information
- Delete contacts with confirmation
- Responsive design for all screen sizes

### Task Management
- Monitor import/export tasks in real-time
- View task progress with visual indicators
- Download task results
- Detailed error reporting through modal dialogs
- Status tracking for all operations

### Technical Features
- Server-side rendering with Next.js App Router
- Modern UI components with Shadcn/UI
- Type-safe development with TypeScript
- Responsive design with Tailwind CSS
- Client-side state management
- Error handling and user feedback
- Cursor-based pagination
- File upload/download handling

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **Package Manager**: pnpm
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Testing**: Vitest
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18 or later
- pnpm 9.x or later
- API Server running (see:)[https://github.com/luisFelipeEvilla/okr-programming-challenge-api]

### Installation

1. Start API server:
(see:)[https://github.com/luisFelipeEvilla/okr-programming-challenge-api]

2. 
```bash
git clone [repository-url]
cd okr-programming-challenge
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Configure the following environment variables in your `.env.local`:

```env
# Constant Contact API Configuration
NEXT_PUBLIC_CONSTANT_CONTACT_CLIENT_ID=       # Your Constant Contact Client ID
NEXT_PUBLIC_CONSTANT_CONTACT_CLIENT_SECRET=   # Your Constant Contact Client Secret
NEXT_PUBLIC_CONSTANT_CONTACT_REDIRECT_URI=    # OAuth redirect URI
NEXT_PUBLIC_CONSTANT_CONTACT_AUTH_URL=        # Constant Contact Auth URL
NEXT_PUBLIC_CONSTANT_CONTACT_TOKEN_URL=       # Constant Contact Token URL
NEXT_PUBLIC_CONSTANT_CONTACT_API_URL=         # Constant Contact API URL

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Environment Variables

#### Required Variables:
- `NEXT_PUBLIC_CONSTANT_CONTACT_CLIENT_ID`: Your Constant Contact application client ID
- `NEXT_PUBLIC_CONSTANT_CONTACT_CLIENT_SECRET`: Your Constant Contact application client secret
- `NEXT_PUBLIC_CONSTANT_CONTACT_REDIRECT_URI`: OAuth callback URL (default: http://localhost:3000/api/auth/callback/constantcontact)

#### Optional Variables (with defaults):
- `NEXT_PUBLIC_CONSTANT_CONTACT_AUTH_URL`: Constant Contact authorization URL
- `NEXT_PUBLIC_CONSTANT_CONTACT_TOKEN_URL`: Constant Contact token endpoint
- `NEXT_PUBLIC_CONSTANT_CONTACT_API_URL`: Constant Contact API base URL
- `NEXT_PUBLIC_APP_URL`: Your application URL
- `NODE_ENV`: Application environment

### Running Tests

- Run tests in watch mode:
```bash
pnpm test:watch
```

- Run tests with UI:
```bash
pnpm test:ui
```

- Generate coverage report:
```bash
pnpm test:coverage
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   │   ├── contacts/     # Contact management
│   │   └── tasks/       # Task management
├── components/            # React components
│   ├── ui/              # Shadcn UI components
│   ├── Tables/          # Table components
│   └── buttons/         # Button components
├── lib/                  # Utility functions
├── schemas/              # Zod schemas
├── services/             # API services
└── tests/               # Test files
```

## Key Features in Detail

### Contact Management
- **Pagination**: Cursor-based pagination for efficient data loading
- **Search**: Contact search functionality
- **Import**: CSV file import with validation
- **Export**: Export contacts to CSV format
- **Delete**: Contact deletion with confirmation

### Task Management
- **Progress Tracking**: Real-time progress updates
- **Status Indicators**: Visual status indicators
- **Error Handling**: Detailed error reporting
- **Download**: Task results download functionality

### UI/UX Features
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: Toast notifications and error dialogs
- **Accessibility**: ARIA labels and keyboard navigation
- **Animations**: Smooth transitions and loading states

## API Integration

The application integrates with the Constant Contact API v3:
[docs](https://developer.constantcontact.com/api_reference/index.html#tag/Account-Services)

- **Authentication**: OAuth 2.0 flow
- **Endpoints**:
  - GET /contacts - List contacts
  - POST /contacts - Create contact
  - DELETE /contacts/:id - Delete contact
  - GET /activities - List tasks
  - GET /activities/contact_exports - Export contacts

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
