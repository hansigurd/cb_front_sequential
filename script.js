$(document).ready(function() {
    const userIdField = $('#user_id');
    const messagesDiv = $('.messages');
    const messageInput = $('.message-input');
    const sendButton = $('#send');
    const typingIndicator = $('.typing-indicator');

    // Update the state of the send button
    function updateSendButtonState() {
        if(userIdField.val().trim() && messageInput.val().trim()) {
            sendButton.prop('disabled', false);  // Enable the send button.
        } else {
            sendButton.prop('disabled', true);  // Disable the send button.
        }
    }

    // Run this when the document is ready
    updateSendButtonState();  // Update button state at page load

    // Event listeners for user input and send button
    userIdField.on('input', updateSendButtonState);
    messageInput.on('input', updateSendButtonState);
    sendButton.on('click', sendMessage);
    messageInput.on('keydown', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
    const session_id = userIdField.val();
    const userInput = messageInput.val();
    if (userInput.trim()) {
        const userMessage = $('<div/>', {
            class: 'message user-message',
            text: userInput
        });
        messagesDiv.append(userMessage);
        messageInput.val('');
        updateSendButtonState(); // Update button state after clearing input field
        
        if (session_id.trim() === '') {
            alert('Error: User ID is required');
            return;
        }

        typingIndicator.css('display', 'flex');
        
        $.ajax({
            url: 'https://chatbot-cb-2a5f4f776879.herokuapp.com/api/chat', // Ensure this is your correct Heroku URL
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                session_id: session_id,
                input: userInput
            }),
            success: function(data) {
                let botResponse = data.bot_response;
                botResponse = botResponse.replace(/\n/g, ' <br> ');
                const botResponseWords = botResponse.split(' ');

                setTimeout(() => {
                    const gptMessage = $('<div/>', {
                        class: 'message gpt-message'
                    });
                    messagesDiv.append(gptMessage);
                    messagesDiv.scrollTop(messagesDiv[0].scrollHeight); // Scroll to bottom after appending message
                    typingIndicator.css('display', 'none'); // Hide the typing indicator here
                    
                    typewriterEffect(gptMessage, botResponseWords, 0);
                }, 100);
            },
            error: function(err) {
                console.error("Error:", err);
            }
        });
    }
    }

    function typewriterEffect(element, words, index) {
        if (index < words.length) {
            element.innerHTML += (index > 0 ? ' ' : '') + words[index];
            const delay = calculateDelay(words[index]);
            setTimeout(() => {
                typewriterEffect(element, words, index + 1);
                messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to bottom after each word is added
            }, delay);
        }
        else {
            sendButton.disabled = false;  // Enable the send button.
        }
    }

    function calculateDelay(word) {
        const baseDelay = 50;
        const additionalDelayPerChar = 5;
        const delayVariability = 20;
        const wordDelay = baseDelay + word.length * additionalDelayPerChar;
        const randomDelay = Math.random() * delayVariability;
        return wordDelay + randomDelay;
    }
});

function updateSendButtonState() {
    var userId = $('#user_id').val();
    var userInput = $('#user_input').val();

    if(userId && userInput) {
        $('.send-button').removeClass('disabled').addClass('enabled');
    } else {
        $('.send-button').removeClass('enabled').addClass('disabled');
    }
}

$(document).ready(function() {
    updateSendButtonState(); // Disable button at page load

    $('#user_id, #user_input').on('input', updateSendButtonState);
});
