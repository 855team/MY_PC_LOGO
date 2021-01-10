import {postRequest} from '../utils/Ajax';
const backedip="http://123.57.65.161:30086"

export const login=(data,callback)=>{
    let url=backedip+"/login"
    postRequest(url, data, callback);
}

export const register=(data,callback)=>{
    let url=backedip+"/register"
    postRequest(url, data, callback);
}
export const validate=(data,callback)=>{
    let url=backedip+"/getuser";
    postRequest(url,data, callback);
}
export const modifyuser=(data,callback)=>{
    let url=backedip+"/modifyuser";
    postRequest(url,data, callback);
}