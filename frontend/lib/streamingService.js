export default async function performStreamedRequest(
    url,
    headers,
    body,
    setM,
    setSource,
    onConversationFinished // Add this parameter for the callback function
  ) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json', // Add this line
        },
        body: JSON.stringify(body),
      });
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      if (response.status === 400) {
        const errorResponse = await response.json();
        const { errorCode, errorMessage } = errorResponse;
  
        throw new Error(errorMessage || 'Bad Request');
      }
      if (response.status === 400) {
        const errorResponse = await response.json();
        const { errorCode, errorMessage } = errorResponse;
  
        throw new Error(errorMessage || 'Bad Request');
      }
  
      if (!response.ok) {
        throw new Error('Bad Request');
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let chunk = '';
      let contents = '';
  
      let isConversationFinished = false; // Flag variable
      let shouldStoreNextDataObject = false; // Flag to indicate whether to store the next data object
      let sourceData;
      let showErrorObject = false;
      reader.read().then(function processResult(result) {
        chunk += decoder.decode(result.value, { stream: true });
  
        // Split chunk into individual data objects
        const dataObjects = chunk.split('\n').filter(Boolean);
  
        // Reset contents before processing new data objects
        contents = '';
  
        // Process each data object
        dataObjects.forEach((dataObject, index) => {
          if (shouldStoreNextDataObject) {
            return;
          }
          if (showErrorObject) {
            if (onConversationFinished) {
              onConversationFinished(contents); // Pass any relevant data to the callback
            }
            const data = dataObject.replace(/^data: /, '');
            const newError = JSON.parse(data);
          
            showErrorObject = false;
            isConversationFinished = true; // Set the flag to true
            return;
          }
          // Process each data object except for the last one if it's incomplete
          if (!(index === dataObjects.length - 1 && !result.done)) {
            const data = dataObject.replace(/^data: /, '');
            if (data === '[DONE]') {
              isConversationFinished = true; // Set the flag to true
              if (setSource) {
                setSource(sourceData);
              }
              console.log(onConversationFinished);
              if (onConversationFinished) {
                onConversationFinished(contents); // Pass any relevant data to the callback
              }
  
              reader.cancel();
            } else if (data === '[ERROR]') {
              showErrorObject = true;
            } else if (data === '[METADATA]' || data === '[TITLE]' ) {
              shouldStoreNextDataObject = true;

             
            } else {
              try {
                console.log(data)
                const jsonData = JSON.parse(data);
                if (jsonData.content) {
                  // Get content of Dave's response
                  let newResponse = jsonData.content;
  
                  // Append Dave's response to contents if it exists
  
                  if (jsonData.replace) {
                    contents = newResponse;
                  } else {
                    contents += newResponse;
                  }
                  setM(contents);
                }
              } catch (error) {
                console.error('Invalid JSON:', error);
              }
            }
          }
        });
  
        // Set the updated contents
  
        // Continue streaming responses
        if (!isConversationFinished) {
          reader.read().then(processResult);
        }
      });
    } catch (error) {
     console.log(error)
    }
  }