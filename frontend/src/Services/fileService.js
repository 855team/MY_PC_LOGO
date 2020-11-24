import {postRequest} from '../utils/Ajax';
const backedip="http://123.57.65.161:30086"

export const newproject=(data,callback)=>{
    let url=backedip+"/newproject"
    postRequest(url, data, callback);
}

export const modifyproject=(data,callback)=>{
    let url=backedip+"/modifyproject"
    postRequest(url, data, callback);
}

export const getproject=(data,callback)=>{
    let url=backedip+"/getproject"
    postRequest(url, data, callback);
}
export const deleteproject=(data,callback)=>{
    let url=backedip+"/deleteproject";
    postRequest(url,data, callback);
}

export const newfile=(data,callback)=>{
    let url=backedip+"/newfile"
    postRequest(url, data, callback);
}

export const modifile=(data,callback)=>{
    let url=backedip+"/modifyfile"
    postRequest(url, data, callback);
}


export const deletefile=(data,callback)=>{
    let url=backedip+"/deletefile";
    postRequest(url,data, callback);
}

