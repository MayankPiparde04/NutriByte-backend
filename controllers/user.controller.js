import User from '../models/user.models.js';

// Get user by ID (only allow users to get their own data or make it admin-only)
export const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const requestingUserId = req.user._id.toString();
    
    // Only allow users to access their own data
    if (userId !== requestingUserId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user.getPublicProfile());
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new user (this should probably be removed since we have auth/register)
export const postUser = async (req, res) => {
  try {
    // This endpoint might be redundant with auth/register
    // Consider removing or restricting to admin use
    res.status(400).json({ message: 'Use /api/auth/register to create users' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update existing user (only allow users to update their own data)
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const requestingUserId = req.user._id.toString();
    
    // Only allow users to update their own data
    if (userId !== requestingUserId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const updates = req.body;
    
    // Prevent updating sensitive fields
    delete updates.password;
    delete updates.refreshTokens;
    delete updates.email; // Email changes should be handled separately with verification
    delete updates._id;
    delete updates.__v;
    delete updates.createdAt;
    delete updates.updatedAt;
    
    // Validate profile fields if provided
    if (updates.age !== undefined) {
      if (typeof updates.age !== 'number' || updates.age < 1 || updates.age > 120) {
        return res.status(400).json({ message: 'Age must be between 1 and 120 years' });
      }
    }
    
    if (updates.height !== undefined) {
      if (typeof updates.height !== 'number' || updates.height < 1 || updates.height > 300) {
        return res.status(400).json({ message: 'Height must be between 1 and 300 cm' });
      }
    }
    
    if (updates.weight !== undefined) {
      if (typeof updates.weight !== 'number' || updates.weight < 1 || updates.weight > 1000) {
        return res.status(400).json({ message: 'Weight must be between 1 and 1000 kg' });
      }
    }
    
    if (updates.fullname !== undefined) {
      if (typeof updates.fullname !== 'string' || updates.fullname.trim().length === 0) {
        return res.status(400).json({ message: 'Full name is required and must be a valid string' });
      }
      updates.fullname = updates.fullname.trim();
    }
    
    if (updates.phone !== undefined) {
      if (typeof updates.phone !== 'string' || updates.phone.length < 10) {
        return res.status(400).json({ message: 'Phone number must be at least 10 digits' });
      }
      // Check if phone number is already taken by another user
      const phoneExists = await User.findOne({ phone: updates.phone, _id: { $ne: userId } });
      if (phoneExists) {
        return res.status(409).json({ message: 'Phone number is already in use' });
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(updatedUser.getPublicProfile());
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
