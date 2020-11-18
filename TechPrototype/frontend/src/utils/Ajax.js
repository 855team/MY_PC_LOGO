let postRequest = (url,data,callback) => {
    let opts={
        method: "POST",
        body: JSON.stringify(data),
        headers:{
            'Content-Type': "application/json"
        }
    }

    fetch(url,opts)
        .then((response)=>{
            return response.json()
        })
        .then((data)=>{
            callback(data);
        })
        .catch((error)=>{
            console.log(error);
        })
}

export {postRequest};