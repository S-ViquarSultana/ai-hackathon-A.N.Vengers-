import { Inngest } from "inngest";
import connectDB from "./db"; // Make sure this actually connects to MongoDB
import User from "../backend/models/user"; // Mongoose model

export const inngest = new Inngest({ name: "AI-Edu-Guide" });

// 1. User Creation Sync
export const syncUserCreation = inngest.createFunction(
  { id: 'sync-user-from-clerk' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageURL: image_url,
    };
    
    await connectDB();  // Connect DB before using Mongoose
    await User.create(userData);
    return { status: "User created" };
  }
);

// 2. User Update Sync
export const syncUserUpdation = inngest.createFunction(
  { id: 'update-user-from-clerk' },
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageURL: image_url,
    };
    
    await connectDB();  // Connect DB before using Mongoose
    await User.findByIdAndUpdate(id, userData);
    return { status: "User updated" };
  }
);

// 3. User Deletion Sync
export const syncUserDeletion = inngest.createFunction(
  { id: 'delete-user-from-clerk' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    const { id } = event.data;
    await connectDB();
    await User.findByIdAndDelete(id);
    return { status: "User deleted" };
  }
);
