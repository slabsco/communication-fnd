export const DynamicDefaultExampleQuestionList = `
{
    "html": "<p style=\"padding:0; margin:0\">Hello {{name}}😀,  please order the food.</p>",
    "header": "Order Food",
    "footer": "thanks for ordering",
    "sections": [
        {
            "id": "1743176925392",
            "title": "Brekfast",
            "rows": [
                {
                    "id": "1743176925392",
                    "text": "Egg",
                    "description": "this is fresh eggg"
                },
                {
                    "id": "1743176978916",
                    "text": "Bread",
                    "description": "this is special bread from the china"
                }
            ]
        },
        {
            "id": "1743176989550",
            "title": "Lunch",
            "rows": [
                {
                    "id": "1743176989550",
                    "text": "MOMO",
                    "description": "Nepali style momo"
                }
            ]
        }
    ],
    "buttonName": "See Menu",
}`;
export const DynamicDefaultExampleQuestionButton = `
{
    "html": "<p style=\"padding:0; margin:0\">Hello {{name}}😀,  please order the food.</p>",
    "header": "Order Food",
    "footer": "thanks for ordering",
    "answer": [
        {
            "id": "1743176925392",
            "text": "Brekfast",
        },
    ],
}`;
export const DynamicDefaultExampleSendMessage = `{
    "messages": [
        {
            "type": "message",
            "data": {
                "message": "Your message here"
            }
        }
    ]
}`;

export const DynamicSetConditionExample = `// globalVariables  => here you will get all the savedVariablesAnswer
condition = 'true'

if(condition){
    condition = 'true'
}else{
    condition = 'false'
}`;

export const DynamicDefaultApiConfig = `
// globalVariables  => here you will get all the savedVariablesAnswer
apiConfig = {
    url: 'your/api/endpoint', // Replace with your API endpoint
    method: 'POST', // or 'GET', depending on your needs
    headers: {
        'Content-Type': 'application/json',
        // Add any other headers you need here
    },
    data: {
        // Any payload that you want to send.
    },
}`;

export const dynamicDefaultValueFormatter = `
// globalVariables  => here you will get all the savedVariablesAnswer
// response  => here you will get the api response
data = {} // save the format data here..;

//format data starts here...



//format data ends here...
`;
