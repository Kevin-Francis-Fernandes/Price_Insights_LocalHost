import { NextApiRequest, NextApiResponse } from 'next';

export default async function handleUpdate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Your server-side logic here
    // For example, you might perform some database updates or other operations

    // Send a response indicating success
    await fetch(`http://127.0.0.1:5000/api/update`)
    res.status(200).json({ message: 'Update successful' });
  } catch (error) {
    // If an error occurs, send an error response to the client
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}