# Admin Dashboard Instructions

## 🔐 Admin Login Credentials

After running the seed script, use these credentials to login as admin:

**Email:** `admin@iiitkalyani.ac.in`  
**Password:** `admin@123`

## 📊 Admin Dashboard Features

### 1. **Dashboard Overview** (`/admin`)
- View total users, students, coordinators, and admins
- See total clubs and their member counts
- Track total events (approved, pending, rejected)
- Quick access cards to manage users, clubs, and events

### 2. **User Management** (`/admin/users`)
- View all registered students with their details
- Filter users by role (Student, Coordinator, Admin)
- See user registration dates
- View student IDs and email addresses

### 3. **Club Statistics** (`/admin/clubs`)
- View all clubs with member counts
- See club coordinators
- Click "View Members" to expand and see all members in each club
- View member names and emails

### 4. **Event Management** (`/admin/events`)
- View all events with registration statistics
- Filter by status: All, Approved, Pending, Rejected
- See how many students registered for each event
- Click "View Registrations" to see all registered users
- View event details: date, location, club

## 🚀 How to Use

### Step 1: Seed the Database
```bash
npx tsx scripts/seed.ts
```

This will create:
- 1 Admin user
- 1 Coordinator (Alice)
- 3 Students (Bob, Charlie, Diana)
- 6 Clubs with various members
- 5 Events with registrations

### Step 2: Start the Development Server
```bash
npm run dev
```

### Step 3: Login as Admin
1. Go to `http://localhost:3001/login`
2. Enter admin credentials:
   - Email: `admin@iiitkalyani.ac.in`
   - Password: `admin@123`
3. Click "Login"

### Step 4: Access Admin Dashboard
After login, you'll be redirected to the homepage. Click on "Admin Dashboard" in the navigation bar or go directly to:
- Dashboard: `http://localhost:3001/admin`
- Users: `http://localhost:3001/admin/users`
- Clubs: `http://localhost:3001/admin/clubs`
- Events: `http://localhost:3001/admin/events`

## 🔒 Security Features

- **Role-based Access Control**: Only users with `role: 'admin'` can access admin pages
- **Automatic Redirect**: Non-admin users are redirected to home page
- **Protected API Routes**: Admin API endpoints check user role before returning data
- **Session-based Authentication**: Uses NextAuth with JWT tokens

## 📋 Admin API Endpoints

All admin endpoints require authentication and admin role:

- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users list
- `GET /api/admin/clubs` - Get clubs with member details
- `GET /api/admin/events` - Get events with registration details

## 🎯 Test User Credentials

### Admin
- Email: `admin@iiitkalyani.ac.in`
- Password: `admin@123`

### Coordinator
- Email: `alice@example.com`
- Password: `password123`

### Students
- Email: `bob@example.com` / Password: `password123`
- Email: `charlie@example.com` / Password: `password123`
- Email: `diana@example.com` / Password: `password123`

## 📈 Statistics Display

### Dashboard Stats:
- Total Users (with breakdown)
- Total Clubs
- Total Events (with status counts)
- Total Admins

### Club Stats:
- Total clubs count
- Total members across all clubs
- Per-club member counts
- Coordinator information

### Event Stats:
- Total events count
- Total registrations across all events
- Per-event registration counts
- Event status distribution

## 🎨 UI Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Interactive Cards**: Expandable cards to show member/registration details
- **Filter Tabs**: Filter users by role, events by status
- **Real-time Data**: Fetches fresh data from MongoDB
- **Loading States**: Shows loading indicator while fetching data
- **Error Handling**: Proper error messages and fallbacks

## 🔧 Customization

To change admin credentials:
1. Edit `scripts/seed.ts`
2. Modify the admin user creation:
```typescript
const admin = await UserModel.create({
  name: 'Your Name',
  email: 'your.email@domain.com',
  password: 'your_password',
  role: 'admin',
});
```
3. Run the seed script again

## 🐛 Troubleshooting

### Can't login as admin?
- Make sure you ran the seed script
- Check if the database is connected
- Verify MongoDB URI in `.env.local`

### Dashboard not showing data?
- Check browser console for errors
- Verify API routes are accessible
- Check MongoDB connection

### Not redirected to admin dashboard?
- Clear browser cache and cookies
- Check session storage
- Try logging out and back in

## 📝 Notes

- The admin dashboard is protected by authentication middleware
- Only users with `role: 'admin'` can access admin routes
- All data is fetched server-side from MongoDB
- The dashboard updates in real-time when you refresh the page
