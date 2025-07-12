module.exports = (token) => {
    if (!token) {
        throw new Error("Token is required to get the client ID.");
    };
    const user= token.split('.')[0]; 
    const buffer = Buffer.from(user, 'base64');
    clientid = buffer.toString('utf-8');
    return clientid;
};

