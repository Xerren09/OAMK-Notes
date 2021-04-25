//SPDX-FileCopyrightText: © 2021 Bars Margetsch <barsmargetsch@outlook.com>
//SPDX-License-Identifier: BSD 3-Clause
const xresponse = {
    success: function(res, contents="no_content", token) {
        let xresponse_content = {
            status: "success",
            data: {}
        }
        if (token != undefined)
        {
            xresponse_content.data.token = token;
        }
        if (contents != "no_content")
        {
            for (const [key, value] of Object.entries(contents)) {
                xresponse_content.data[key] = value;
            }
        }
        res.json(xresponse_content);
    },
    error: function(res, type) {
        let xresponse_content = {
            status: "error",
            data: {
                type: type
            }
        }
        res.json(xresponse_content);
    },
    fail: function(res, type, token) {
        let xresponse_content = {
            status: "fail",
            data: {
                type: type
            }
        }
        if (token != undefined)
        {
            xresponse_content.data.authToken = token;
        }
        res.json(xresponse_content);
    }
}
module.exports = xresponse;
/* 
This Module follows the sjson response format:
{
    status : "success",
    data : {
        
    },
}
OR
{
    status : "fail",
    data : {
        type : "credentials_taken" 
    },
}
OR
{
    status : "error",
    data : {
        type : "internal_database" 
    },
}

If there is an authorization token added, it is appended into the data:{} object as "token:<token>".
Tokens that are undefined will not be processed, this is to allow for conditional tokens (such as
when the token has been refreshed and it is sent with the next request, otherwise this field is 
omitted).
Response content should be provided in a key - value format in {}, the code will iterate through them
and append each key - value pair directly to data:{}. Providing a named object variable <key>, will append 
the object variable directly as:
data: { 
    <key>:{
        <subkey>:<subvalue>
    }
} 
*/