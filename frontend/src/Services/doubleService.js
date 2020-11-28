import {message} from "antd";

var RoomEnterSuccess = 20;
var RoomCommandStream = 21;
var RoomUserEnterNotify = 22;
var RoomUserLeaveNotify = 23;

let requestUrl;
var client;

export const onConnectSSE=(type,rid,enterCallback,messageCallback,partnerCallback,leaveCallback)=>{
    if (typeof (EventSource) !== "undefined") {
        console.log("server-sent events supported");

        requestUrl="http://123.57.65.161:30086/rooms?type=" + type
            + (type=="join"?("&rid="+rid):"")
            + "&token="+localStorage.getItem("token")
        console.log(requestUrl);
        client = new EventSource(requestUrl);

        client.onerror =  (evt)=> {
            message.info('Browser Does Not Support SSE')
            console.log(evt);
            console.log({status: "Fail !!!!!!",msg:"Browser Does Not Support SSE"});
        }
        client.onmessage =  (evt)=> {
            // it's not required that you send and receive JSON, you can just output the "evt.data" as well.
            let dataJSON = JSON.parse(evt.data)
            console.log(dataJSON);
            if (!dataJSON.success) {
                message.info('Connect to SSE Fail !!!!!!')
                client.close()
                console.log({status:"Connect to SSE Fail !!!!!!",msg:dataJSON.msg})
            } else if (dataJSON.msg == RoomEnterSuccess) {
                /* 成功进入房间 */
                enterCallback(dataJSON.data);
                console.log("roomId:"+dataJSON.data.rid)
                // onGetRooms();
            } else if (dataJSON.msg == RoomCommandStream) {
                /* 有新代码返回（虽然返回的其实是所有代码） */
                messageCallback(dataJSON.data)
            } else if (dataJSON.msg == RoomUserEnterNotify) {
                /* 有人进入当前房间 */
                console.log(dataJSON.data.uid + " - " + dataJSON.data.username + " Enter!")
                partnerCallback(dataJSON.data)
                // onGetRooms();
            } else if (dataJSON.msg == RoomUserLeaveNotify) {
                /* 有人离开当前房间 */
                console.log(dataJSON.data.uid + " - " + dataJSON.data.username + " Leave!")
                leaveCallback(dataJSON.data)
                // onGetRooms();
            }
        };
    } else {
        console.log("SSE not supported by this client-protocol");
    }
}

export const offConnection=(callback)=>{
    client.close()
    callback();
}

export const onGetRooms=(callback)=>{
    fetch("http://123.57.65.161:30086/getrooms", {
        method: 'GET',
    })
        .then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json)
            if (json.success) {
                callback(json.data)
            }
        }
    ).catch((error) => {
        console.log(error)
    })
}

export const sendCommand=(rid,command)=>{
    let opts = {
        method: "POST",
        body: JSON.stringify({
            "token": localStorage.getItem("token"),
            "rid": rid,
            "content": command
        }),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include"
    };

    fetch("http://123.57.65.161:30086/newcommand", opts)
        .then((response) => {
            return response.json();
        }).then((json) => {
        console.log(json)
        if (json.success) {
            // document.getElementById("msg").textContent = json.msg
            // document.getElementById("status").textContent = "Send Command Success"
            // onGetRooms()
            console.log({status:"Send Command Success",msg:json.msg})
        } else {
            // document.getElementById("status").textContent = "Send Command Failed !!!"
            // document.getElementById("msg").textContent = json.msg
            console.log({status:"Send Command Failed !!!",msg:json.msg})
        }
    }).catch((error) => {
        console.log(error);
    });
}
