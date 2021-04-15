const xresponse = {
    success: function(contents="no_content", token="no_token") {
        let xresponse_content = {
            status: "success",
            data: {}
        }
        if (token != "no_token")
        {
            xresponse_content.data.token = token;
        }
        if (contents != "no_content")
        {
            for (const [key, value] of Object.entries(contents)) {
                xresponse_content.data[key] = value;
            }
        }
        return xresponse_content;
    },
    error: function(type, token="no_token") {
        let xresponse_content = {
            status: "error",
            data: {
                type: type
            }
        }
        if (token != "no_token")
        {
            xresponse_content.data.authToken = token;
        }
        return xresponse_content;
    },
    fail: function(type, token="no_token") {
        let xresponse_content = {
            status: "fail",
            data: {
                type: type
            }
        }
        if (token != "no_token")
        {
            xresponse_content.data.authToken = token;
        }
        return xresponse_content;
    }
}
module.exports = xresponse;