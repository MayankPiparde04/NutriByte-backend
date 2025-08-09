// test-gemini-image.js
// Test script specifically for Gemini image analysis

const BASE_URL = 'http://localhost:5000/api';

async function testImageAnalysis() {
  console.log('🖼️ Testing Gemini Image Analysis\n');
  
  // First, register and login to get a token
  const registerData = {
    fullname: 'Image Test User',
    email: `imagetest${Date.now()}@example.com`,
    password: 'testpassword123',
    phone: `987654${Date.now().toString().slice(-4)}`
  };
  
  try {
    const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    });
    
    const registerResult = await registerResponse.json();
    
    if (registerResponse.status !== 201) {
      console.error('Failed to register:', registerResult);
      return;
    }
    
    const token = registerResult.accessToken;
    console.log('✅ Authenticated successfully');
    
    // Test with a sample base64 image (1x1 red pixel PNG)
    const sampleImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    
    console.log('🔍 Testing image analysis with sample image...');
    
    const imageAnalysisData = {
      image: sampleImageBase64
    };
    
    const imageResponse = await fetch(`${BASE_URL}/gemini/analyze-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(imageAnalysisData)
    });
    
    const imageResult = await imageResponse.json();
    
    console.log(`Status: ${imageResponse.status}`);
    console.log('Response:', imageResult);
    
    if (imageResponse.status === 200) {
      console.log('✅ Image analysis endpoint is working!');
    } else {
      console.log('❌ Image analysis failed:', imageResult.error);
    }
    
    // Test with invalid image data
    console.log('\n🚫 Testing with invalid image data...');
    
    const invalidImageResponse = await fetch(`${BASE_URL}/gemini/analyze-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ image: 'invalid-image-data' })
    });
    
    const invalidResult = await invalidImageResponse.json();
    console.log(`Status: ${invalidImageResponse.status}`);
    console.log('Response:', invalidResult);
    
    if (invalidImageResponse.status === 400) {
      console.log('✅ Input validation working correctly!');
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testImageAnalysis();
