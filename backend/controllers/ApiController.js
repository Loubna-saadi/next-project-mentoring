 // Assuming you have a User model
const jwt = require('jsonwebtoken');
const secretKey = 'lovementory'; // Replace 'your_secret_key' with your actual secret key
const bcrypt=require('bcrypt');
const Mentor=require('../models/mentor')
const Client=require('../models/client')
const Booking=require('../models/booking')
const Review=require('../models/review')
// Function to generate JWT token
const generateToken = (user) => {
    const payload = {
        userId: user._id,
        email: user.email,
        role: user.role // Assuming 'role' is stored in the user object
    };
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '12d' }); // Token expires in 1 hour
};

const apiControllers = {
  register:  async (req, res) => {
    const { username, email,phone, password, role } = req.body;

    try {
      let user;
      if (role === 'mentor') {
        user = await Mentor.findOne({ email });
        if (user) {
          return res.status(400).json({ errors: [{ msg: 'Mentor already exists' }] });
        }
        user = new Mentor({
          username,
          email,
          phone,
          password,
          role,
          // Additional mentor fields can be added here
        });
      } else if (role === 'client') {
        user = await Client.findOne({ email });
        if (user) {
          return res.status(400).json({ errors: [{ msg: 'Client already exists' }] });
        }

        user = new Client({
          username,
          email,
          phone,
          password,
          role,
          // Additional client fields can be added here
        });
      }

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      res.status(200).json({ msg: 'User registered successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
  

  login: async (req, res) => {
    const { email, password } = req.body;
    try {  // Check Mentor collection
      let user = await Mentor.findOne({ email });
      if (!user) { // If not found, check Client collection
        user = await Client.findOne({ email });
      }
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      // Generate JWT token
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  
      // Send token and user data in response
      const { password: userPassword, ...userData } = user._doc;
      res.status(200).json({ message: 'Login successful', token, userData });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  
  
  logout: (req, res) => {
    try {
      // Clear the JWT token stored on the client-side (e.g., in local storage)
      res.clearCookie('token');
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Error logging out:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getUserInfo: async (req, res) => {
    try {
      // Check if au²thorization header is present
      if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Authorization header missing' });
      }
      // Extract token from the authorization header
      const tokenParts = req.headers.authorization.split(' ');
      if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Invalid authorization header format' });
      }
      const token = tokenParts[1];
      try {
        // Verify and decode the token to get user ID and role
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decodedToken.userId;
        const userRole = decodedToken.role;
        console.log('Decoded Token:', decodedToken);
        console.log('Extracted Role:', userRole);
        console.log('Extracted ID:',  userId);
        // Find the user by ID and role in the database
        let user;
        if (userRole === 'mentor') {
          user = await Mentor.findById(userId);
        } else if (userRole === 'client') {
          user = await Client.findById(userId);
        }
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        // Return the user information
        const { _id, email, username, role } = user;
        res.status(200).json({ _id, email, username, role });
      } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Controller to fetch user profile based on role and ID
//  getUserProfile : async (req, res) => {
//   const { role, id } = req.params;

//   try {
//     let user;

//     // Fetch user based on role
//     if (role === 'client') {
//       user = await Client.findById(id);
//     } else if (role === 'mentor') {
//       user = await Mentor.findById(id);
//     } else {
//       return res.status(400).json({ message: 'Invalid role' });
//     }

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     console.error('Error fetching user profile:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// }

getUserProfile : async (req, res) => {
  try {
    // Check if authorization header is present
    if (!req.headers.authorization) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }
    // Extract token from the authorization header
    const tokenParts = req.headers.authorization.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Invalid authorization header format' });
    }
    const token = tokenParts[1];

    // Decode the JWT token to extract role and id
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const id = decodedToken.userId;
    const role = decodedToken.role;
   
  console.log('Decoded Token:', decodedToken);
console.log('Extracted Role:', role);
console.log('Extracted ID:', id);
    // Fetch user based on role and id
    let user;

    if (role === 'client') {
      user = await Client.findById(id);
    } else if (role === 'mentor') {
      user = await Mentor.findById(id);
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }},
  
  updateClient : async (req, res) => {
    const { id } = req.params; // Get the user ID from the URL params
    const { email, phone, username, password, role, photo } = req.body; // Assuming these are the fields you want to update
    try {
        // Check if the user exists in the client table
        const existingClient = await Client.findById(id);
        if (!existingClient) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Update the user's information
        existingClient.email = email;
        existingClient.phone = phone;
        existingClient.username = username;
        existingClient.role = role;
        existingClient.photo = photo;
        if (password) {
          const saltRounds = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          existingClient.password = hashedPassword;
      }
        // Save the updated user data
        await existingClient.save();
        res.status(200).json({ message: 'User information updated successfully', user: existingClient });
    } catch (error) {
        console.error('Error updating user information:', error);
        res.status(500).json({ message: 'Server error' ,error});
    }
},
updateMentor : async (req, res) => {
  const { id } = req.params; // Get the user ID from the URL params
  const { email, phone, username, password, photo,category,about, YearsInbusiness,NumberOfMentees,YearsOfMentoring } = req.body; // Assuming these are the fields you want to update
  try {
      // Check if the user exists in the client table
      const existingMentor = await Mentor.findById(id);
      if (!existingMentor) {
          return res.status(404).json({ message: 'User not found' });
      }
      // Update the user's information
      existingMentor.email = email;
      existingMentor.phone = phone;
      existingMentor.username = username;
      existingMentor.YearsOfMentoring = YearsOfMentoring;
      existingMentor.NumberOfMentees = NumberOfMentees;
      existingMentor. YearsInbusiness =  YearsInbusiness;
      existingMentor.about = about;
      existingMentor.category = category;
      existingMentor.photo = photo;
      if (password) {
        const saltRounds = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        existingMentor.password = hashedPassword;
    }
      // Save the updated user data
      await existingMentor.save();
      res.status(200).json({ message: 'Mentor information updated successfully', user: existingMentor });
  } catch (error) {
      console.error('Error updating mentor information:', error);
      res.status(500).json({ message: 'Server error' ,error});
  }
},
 getAllMentors : async (req, res) => {
  try {
    // Fetch all mentors from the database
    const mentors = await Mentor.find();
    // Send the mentors data as a JSON response
    res.status(200).json({
      success: true,
      data: mentors,
    });
  } catch (error) {
    // Handle errors if any
    console.error('Error fetching mentors:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }},

 getMentorById : async (req, res) => {
    try {
      const { id } = req.params; // Get the mentor ID from the request parameters
      const mentor = await Mentor.findById(id); // Find the mentor by ID
  
      if (!mentor) {
        return res.status(404).json({ success: false, message: 'Mentor not found' });
      }
  
      return res.status(200).json({ success: true, data: mentor });
    } catch (error) {
      console.error('Error fetching mentor:', error);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  },
  getClientById : async (req, res) => {
    try {
      const { id } = req.params; // Get the mentor ID from the request parameters
      const client = await Client.findById(id); // Find the client by ID
  
      if (!client) {
        return res.status(404).json({ success: false, message: 'client not found' });
      }
  
      return res.status(200).json({ success: true, data: client });
    } catch (error) {
      console.error('Error fetching client:', error);
      return res.status(500).json({ success: false, error: 'Server error' });
    }
  },
  addBooking : async(req,res)=>{
      const { mentor, client, appointmentDate, appointmentTime, appointmentPrice } = req.body;
      try {
        const existingBooking = await Booking.findOne({ client, appointmentDate, appointmentTime });
        if (existingBooking) {
          return res.status(400).json({ message: "Booking already exists" });
        }
        const newBooking = new Booking({
          mentor,
          client,
          appointmentDate,
          appointmentTime,
          appointmentPrice,
        });
        await newBooking.save();
        res.status(200).json({message:"Booking added successfully",newBooking});
        } catch (error) {
          console.error('Error adding booking:', error);
          res.status(500).json({message:"Server error",error});
          }
          
  },
  bookings : async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const userId = decodedToken.userId; // Assuming the user ID is stored in the token
      console.log('Decoded Token:', decodedToken);
      console.log('Extracted ID:',  userId);
      const bookings = await Booking.find({ client: userId });
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  },
  appointments : async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const userId = decodedToken.userId; // Assuming the user ID is stored in the token
      console.log('Decoded Token:', decodedToken);
      console.log('Extracted ID:',  userId);
      const bookings = await Booking.find({ mentor: userId });
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  },

  getAllReviews: async (req, res) => {
    try {
      const mentorId = req.params.id; // Use req.params.id to get mentorId from URL params
      const reviews = await Review.find({ mentor: mentorId })
        .populate('client', 'username photo'); // Populate client username and photo
      res.json({
        success: true,
        reviews,
      });
    } catch (error) {
      console.error('Error fetching reviews:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error fetching reviews',
      });
    }
  },
  
  
  
  createReview: async (req, res) => {
    try {
      const { mentorId, clientId, reviewText, rating } = req.body;
  
      if (!mentorId || !clientId || !reviewText || !rating) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
        });
      }
  
      const mentor = await Mentor.findById(mentorId);
      if (!mentor) {
        return res.status(404).json({
          success: false,
          message: 'Mentor not found',
        });
      }
  
      // Check if client exists (assuming Client model/schema)
      const client = await Client.findById(clientId);
      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Client not found',
        });
      }
  
      const newReview = new Review({
        mentor: mentorId,
        client: clientId,
        reviewText,
        rating,
      });
  
      await newReview.save();
  
      // Update mentor's average and total ratings
      mentor.reviews.push(newReview._id);
      mentor.totalRating += rating;
      mentor.averageRating = mentor.totalRating / mentor.reviews.length;
      await mentor.save();
  
      res.status(201).json({
        success: true,
        message: 'Review created successfully',
        review: newReview,
      });
    } catch (error) {
      console.error('Error creating review:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error creating review',
      });
    }
  },
  

  };
  

module.exports = apiControllers;

