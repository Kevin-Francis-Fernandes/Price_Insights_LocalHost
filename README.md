
# Main Project

This repository contains a Next.js project with an embedded Python server. Follow the steps below to set up and run both the Next.js and Python servers.



## Next.js Project

### Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)

### Installation

1. Clone the repository.
2. Navigate to the project directory.
   ```
   cd nextjs_project
   ```
3. Install the dependencies.
   ```
   npm install
   ```

### Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variables:

```
BRIGHT_DATA_USERNAME=your_brightdata_username
BRIGHT_DATA_PASSWORD=your_brightdata_password
MONGODB_URI=your_mongodb_uri
EMAIL_PASSWORD=your_email_password
NEXTAUTH_SECRET=your_randomly_generated_secret
NEXTAUTH_URL=http://localhost:3000
```

- **BRIGHT_DATA_USERNAME**: Your Bright Data username. Create a Bright Data account and use the Web Unlocker tool.
- **BRIGHT_DATA_PASSWORD**: Your Bright Data password.
- **MONGODB_URI**: Your MongoDB connection URI. Create a MongoDB database and enter the URI here.
- **EMAIL_PASSWORD**: The password for the email you are using with Nodemailer.
- **NEXTAUTH_SECRET**: A randomly generated secret for NextAuth.
- **NEXTAUTH_URL**: The domain name that you are running on, typically `http://localhost:3000` for local development.

### Running the Server

To start the Next.js development server, run:

```
npm run dev
```

Other available scripts:

- **Build**: `npm run build`
- **Start**: `npm run start`
- **Lint**: `npm run lint`

## Python Server

### Prerequisites

- Python (v3.7 or later)
- pip (v20.x or later)

### Installation

1. Navigate to the Python server directory.
   ```
   cd python
   ```
2. Install the required dependencies.
   ```
   pip install pandas scikit-learn flask pymongo flask-cors
   ```

### Running the Server

To start the Python server, run:

```
python main.py
```

## Accessing the Application

Open any browser and go to [http://localhost:3000](http://localhost:3000).

## Additional Information

This project uses several dependencies listed in the `package.json` file for the Next.js project and the `requirements.txt` file for the Python server. Ensure that all dependencies are installed correctly to avoid any runtime errors.

### Next.js Dependencies

- @headlessui/react
- @radix-ui/react-label
- axios
- bcryptjs
- cheerio
- clsx
- date-fns
- framer-motion
- fs
- headlessui
- mongoose
- next
- nodemailer
- prisma
- puppeteer
- puppeteer-core
- react
- react-dom
- react-icons
- react-loader-spinner
- react-loading-skeleton
- react-responsive-carousel
- react-spinners
- recharts
- tailwind-merge

### Python Dependencies

- pandas
- scikit-learn
- flask
- pymongo
- flask-cors

For any issues or questions, please refer to the respective documentation of the dependencies or create an issue in this repository.

---

Happy coding!
