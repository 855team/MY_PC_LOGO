import {message} from "antd";

var RoomEnterSuccess = 20;
var RoomCommandStream = 21;
var RoomUserEnterNotify = 22;
var RoomUserLeaveNotify = 23;
var RoomNoPermission = 25;

let requestUrl;
var client;

export const onConnectSSE=(type,rid,enterCallback,messageCallback,partnerCallback,leaveCallback)=>{
    if (typeof (EventSource) !== "undefined") {
        console.log("server-sent events supported");

        requestUrl="http://123.57.65.161:30086/rooms?type=" + type
            + (type=="join"?("&rid="+rid):"")
            + "&token="+localStorage.getItem("token")
        client = new EventSource(requestUrl);

        client.onerror =  (evt)=> {
            message.error("浏览器不支持SSE")
            console.log({status: "Fail !!!!!!",msg:"Browser Does Not Support SSE"});
        }
        client.onmessage =  (evt)=> {
            // it's not required that you send and receive JSON, you can just output the "evt.data" as well.
            let dataJSON = JSON.parse(evt.data)
            console.log(dataJSON);
            if (!dataJSON.success) {
                if(dataJSON.msg==RoomNoPermission)
                    message.error("对不起，你不能进入这个房间");
                else
                    message.error("连接SSE失败")
                client.close()
            } else if (dataJSON.msg == RoomEnterSuccess) {
                /* 成功进入房间 */
                enterCallback(dataJSON.data);
                // console.log("roomId:"+dataJSON.data.rid)
            } else if (dataJSON.msg == RoomCommandStream) {
                /* 有新代码返回（虽然返回的其实是所有代码） */
                messageCallback(dataJSON.data)
            } else if (dataJSON.msg == RoomUserEnterNotify) {
                /* 有人进入当前房间 */
                message.info(dataJSON.data.username+" 进入了房间")
                partnerCallback(dataJSON.data)
            } else if (dataJSON.msg == RoomUserLeaveNotify) {
                /* 有人离开当前房间 */
                message.warn(dataJSON.data.username+" 离开了房间")
                leaveCallback(dataJSON.data)
            }
        };
    } else {
        message.error("当前客户端协议不支持SSE");
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
