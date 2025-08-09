// test-endpoints.js
// Simple test script to verify API endpoints

const BASE_URL = 'http://localhost:5000/api';

async function testEndpoint(url, method = 'GET', body = null, headers = {}) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    console.log(`${method} ${url}`);
    console.log(`Status: ${response.status}`);
    console.log('Response:', data);
    console.log('---');
    
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error testing ${url}:`, error.message);
    return { error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Testing NutriByte Backend Endpoints\n');
  
  // Test health check
  await testEndpoint(`${BASE_URL}/health`);
  
  // Test invalid endpoint
  await testEndpoint(`${BASE_URL}/invalid-endpoint`);
  
  // Test register (should work) - updated to include all required fields
  const registerData = {
    fullname: 'Test User New',
    email: `test${Date.now()}@example.com`, // Use timestamp to avoid conflicts
    password: 'testpassword123',
    phone: `123456${Date.now().toString().slice(-4)}` // Use timestamp for unique phone
  };
  
  const registerResult = await testEndpoint(`${BASE_URL}/auth/register`, 'POST', registerData);
  
  // Test login with same credentials (if register worked)
  if (registerResult.status === 201) {
    const loginData = {
      email: registerData.email, // Use the same email from registration
      password: 'testpassword123'
    };
    
    const loginResult = await testEndpoint(`${BASE_URL}/auth/login`, 'POST', loginData);
    
    // Test protected endpoint with token
    if (loginResult.status === 200 && loginResult.data.accessToken) {
      const token = loginResult.data.accessToken;
      const userId = loginResult.data.user.id; // Use .id from the response
      
      console.log('Testing with userId:', userId); // Debug log
      
      await testEndpoint(`${BASE_URL}/users/${userId}`, 'GET', null, {
        'Authorization': `Bearer ${token}`
      });
      
      // Test profile update (add age, height, weight)
      const profileUpdateData = {
        age: 25,
        height: 175,
        weight: 70
      };
      
      await testEndpoint(`${BASE_URL}/users/${userId}`, 'PUT', profileUpdateData, {
        'Authorization': `Bearer ${token}`
      });
      
      await testEndpoint(`${BASE_URL}/chats/recent`, 'GET', null, {
        'Authorization': `Bearer ${token}`
      });
      
      // Test creating a new chat
      const newChatData = {
        title: 'My First Nutrition Chat',
        roomId: `room-test-${Date.now()}`
      };
      
      const createChatResult = await testEndpoint(`${BASE_URL}/chats`, 'POST', newChatData, {
        'Authorization': `Bearer ${token}`
      });
      
      let chatId = null;
      if (createChatResult.status === 201 && createChatResult.data._id) {
        chatId = createChatResult.data._id;
        
        // Test adding a message to the chat
        const messageData = {
          chatId: chatId,
          senderId: userId,
          text: 'Hello, I want to know about healthy breakfast options.',
          fromAI: false
        };
        
        await testEndpoint(`${BASE_URL}/chats/message`, 'POST', messageData, {
          'Authorization': `Bearer ${token}`
        });
        
        // Test getting chat messages
        await testEndpoint(`${BASE_URL}/chats/${chatId}/messages`, 'GET', null, {
          'Authorization': `Bearer ${token}`
        });
      }
      
      // Test Gemini text generation (nutrition advice)
      const geminiTextData = {
        prompt: 'Give me 3 healthy breakfast ideas with approximate calorie counts. Keep it brief.'
      };
      
      await testEndpoint(`${BASE_URL}/gemini/text`, 'POST', geminiTextData, {
        'Authorization': `Bearer ${token}`
      });
      
      // Test adding an AI response to chat
      if (chatId) {
        const aiMessageData = {
          chatId: chatId,
          senderId: null, // AI messages don't have a user sender
          text: 'Here are some healthy breakfast options: 1. Oatmeal with berries (300 cal), 2. Greek yogurt with nuts (250 cal), 3. Avocado toast (350 cal)',
          fromAI: true
        };
        
        await testEndpoint(`${BASE_URL}/chats/message`, 'POST', aiMessageData, {
          'Authorization': `Bearer ${token}`
        });
        
        // Get updated recent chats to see our conversation
        await testEndpoint(`${BASE_URL}/chats/recent`, 'GET', null, {
          'Authorization': `Bearer ${token}`
        });
      }
    }
  }
  
  console.log('✅ Basic endpoint tests completed!');
}

// Run the tests
runTests().catch(console.error);
