document.getElementById('send-btn').addEventListener('click', async function () {
  const input = document.getElementById('chat-input').value;

  // Append user's input to the chat area
  const userMessage = `<div class="message user"><strong>You:</strong> ${input}</div>`;
  document.getElementById('chat-container').innerHTML += userMessage;

  // Clear input field
  document.getElementById('chat-input').value = '';

  try {
    // Call Gemini AI API with the user's question
    const response = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDwVflP2r8_Tb3EEYgugA3RMyokkjUSqig', {
      contents: [{ parts: [{ text: `Provide a step-by-step algorithm for solving the following engineering graphics problem: ${input}` }] }]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Check if the response structure is as expected
    if (response.data.candidates && response.data.candidates.length > 0) {
      // Get the response text
      const reply = response.data.candidates[0].content.parts[0].text.trim();
      // Display the response in the chat area
      const chatGptMessage = `<div class="message seg"><strong>SEGAT:</strong> ${reply}</div>`;
      document.getElementById('chat-container').innerHTML += chatGptMessage;

      // Visualize the engineering graphics answer
      visualizeEngineeringGraphics(reply);
    } else {
      console.error('Unexpected response structure:', response.data);
      const errorMessage = `<div class="message seg"><strong>Error:</strong> No valid response received from the AI.</div>`;
      document.getElementById('chat-container').innerHTML += errorMessage;
    }

  } catch (error) {
    console.error('Error fetching data from Gemini AI API:', error.response ? error.response.data : error);
    const errorMessage = `<div class="message seg"><strong>Error:</strong> ${error.response ? error.response.data.message : 'Something went wrong, please try again later.'}</div>`;
    document.getElementById('chat-container').innerHTML += errorMessage;
  }
});

// Function to visualize the engineering graphics answer
function visualizeEngineeringGraphics(algorithm) {
  console.log('Visualizing Algorithm: ', algorithm);

  // Split the algorithm into steps (this depends on how the algorithm is formatted)
  const steps = algorithm.split('\n'); // Example: splitting by new lines

  // Initialize Konva
  const stage = new Konva.Stage({
    container: 'canvas',   // id of container <div>
    width: window.innerWidth * 0.9,
    height: 400
  });

  const layer = new Konva.Layer();
  stage.add(layer);

  let currentStep = 0;

  function drawStep(step) {
    // Parse and draw based on the step description
    // This is a simplified example, you need to customize this based on the content of your steps
    const rect = new Konva.Rect({
      x: 20,
      y: 20 + (currentStep * 60), // Adjust vertical position for each step
      width: 150,
      height: 40,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 2,
      cornerRadius: 10
    });

    const text = new Konva.Text({
      x: 25,
      y: 25 + (currentStep * 60), // Align text with rectangle
      text: step,
      fontSize: 18,
      fill: 'white'
    });

    layer.add(rect);
    layer.add(text);
    layer.draw();
  }

  function showNextStep() {
    if (currentStep < steps.length) {
      drawStep(steps[currentStep]);
      currentStep++;
      setTimeout(showNextStep, 1000); // Show next step after 1 second
    }
  }

  // Start visualizing steps
  showNextStep();
}
